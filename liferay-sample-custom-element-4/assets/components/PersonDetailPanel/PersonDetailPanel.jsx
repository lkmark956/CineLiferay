/* Componente para mostrar el panel de detalles de una persona (actor/director) */

import React, { useState, useEffect } from 'react';
import tmdbService from '../../services/tmdbService';
import './PersonDetailPanel.css';

export function PersonDetailPanel({ personId, onClose, onMovieClick }) {
    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (personId) {
            loadPersonData();
        }
    }, [personId]);

    const loadPersonData = async () => {
        try {
            setLoading(true);
            
            // Cargar detalles de la persona y su filmografía en paralelo
            const [personDetails, credits] = await Promise.all([
                tmdbService.getPersonDetails(personId),
                tmdbService.getPersonMovieCredits(personId)
            ]);
            
            setPerson(personDetails);
            
            // Ordenar películas por popularidad y tomar las más relevantes
            const sortedMovies = credits.cast
                .concat(credits.crew.filter(c => c.job === 'Director'))
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, 12); // Top 12 películas
            
            setMovies(sortedMovies);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos de la persona:', error);
            setLoading(false);
        }
    };

    if (!personId) return null;

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('person-detail-backdrop')) {
            onClose();
        }
    };

    const handleMovieCardClick = (movie) => {
        onClose(); // Cerrar el panel de persona
        onMovieClick(movie); // Abrir el panel de película
    };

    const imageUrl = person?.profile_path 
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : 'https://via.placeholder.com/500x750?text=Sin+Foto';

    return (
        <div className="person-detail-backdrop" onClick={handleBackdropClick}>
            <div className="person-detail-panel">
                <button className="close-button" onClick={onClose}>✕</button>
                
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando información...</p>
                    </div>
                ) : (
                    <>
                        <div className="person-detail-header">
                            <div className="person-photo-section">
                                <img src={imageUrl} alt={person.name} className="person-photo" />
                            </div>
                            <div className="person-info-section">
                                <h2 className="person-name">{person.name}</h2>
                                {person.birthday && (
                                    <p className="person-meta">
                                        📅 {new Date(person.birthday).toLocaleDateString('es-ES', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                )}
                                {person.place_of_birth && (
                                    <p className="person-meta">📍 {person.place_of_birth}</p>
                                )}
                                {person.known_for_department && (
                                    <p className="person-department">
                                        {person.known_for_department === 'Acting' ? '🎭 Actor/Actriz' : '🎬 Director'}
                                    </p>
                                )}
                                {person.biography && (
                                    <div className="person-biography">
                                        <h3>Biografía</h3>
                                        <p>
                                            {person.biography.length > 600 
                                                ? person.biography.substring(0, 600) + '...'
                                                : person.biography}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {movies.length > 0 && (
                            <div className="person-movies-section">
                                <h3 className="person-movies-title">🎬 Filmografía Destacada</h3>
                                <div className="person-movies-grid">
                                    {movies.map(movie => (
                                        <div
                                            key={movie.id}
                                            className="person-movie-card"
                                            onClick={() => handleMovieCardClick(movie)}
                                        >
                                            <img
                                                src={movie.poster_path 
                                                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                                    : 'https://via.placeholder.com/300x450?text=Sin+Imagen'}
                                                alt={movie.title}
                                                className="person-movie-poster"
                                            />
                                            <div className="person-movie-info">
                                                <h4 className="person-movie-title">{movie.title}</h4>
                                                {movie.character && (
                                                    <p className="person-movie-role">{movie.character}</p>
                                                )}
                                                {movie.job && (
                                                    <p className="person-movie-role">{movie.job}</p>
                                                )}
                                                {movie.release_date && (
                                                    <p className="person-movie-year">
                                                        {new Date(movie.release_date).getFullYear()}
                                                    </p>
                                                )}
                                                {movie.vote_average > 0 && (
                                                    <p className="person-movie-rating">
                                                        ⭐ {movie.vote_average.toFixed(1)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
