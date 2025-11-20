/* Página de películas favoritas */

import React, { useState, useEffect } from 'react';
import favoritesService from '../../services/favoritesService.js';
import { MovieDetailPanel } from '../MovieDetailPanel/MovieDetailPanel.jsx';
import tmdbService from '../../services/tmdbService.js';
import './FavoritesPage.css';

export function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        loadFavorites();
        
        // Listener para abrir película desde PersonDetailPanel
        const handleOpenMovieDetail = (event) => {
            setSelectedMovie(event.detail);
        };
        
        window.addEventListener('openMovieDetail', handleOpenMovieDetail);
        
        return () => {
            window.removeEventListener('openMovieDetail', handleOpenMovieDetail);
        };
    }, []);

    const loadFavorites = () => {
        const favs = favoritesService.getFavorites();
        setFavorites(favs);
    };

    const handleMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            setSelectedMovie(details);
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    const handleRemoveFavorite = (movieId) => {
        favoritesService.removeFavorite(movieId);
        loadFavorites();
    };

    return (
        <div className="favorites-page">
            <h1 className="page-title">
                <span className="page-icon"></span>
                Mis Favoritos
            </h1>
            {favorites.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💔</div>
                    <h2>No tienes favoritos aún</h2>
                    <p>Marca películas con el corazón para verlas aquí</p>
                </div>
            ) : (
                <>
                    <p className="results-count">
                        {favorites.length} película{favorites.length !== 1 ? 's' : ''} favorita{favorites.length !== 1 ? 's' : ''}
                    </p>
                    <div className="movies-grid">
                        {favorites.map(movie => (
                            <div
                                key={movie.id}
                                className="movie-card"
                                onClick={() => handleMovieClick(movie)}
                            >
                                <button
                                    className="remove-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFavorite(movie.id);
                                    }}
                                >
                                    ✕
                                </button>
                                <img 
                                    src={movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                        : 'https://via.placeholder.com/500x750?text=No+Image'}
                                    alt={movie.title}
                                    className="movie-poster"
                                />
                                <div className="movie-info">
                                    <h3>{movie.title}</h3>
                                    <p className="movie-rating">★ {movie.vote_average.toFixed(1)}</p>
                                    <p className="movie-date">{movie.release_date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            <MovieDetailPanel
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </div>
    );
}
