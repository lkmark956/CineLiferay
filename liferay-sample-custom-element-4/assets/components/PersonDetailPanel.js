/* Componente para mostrar el panel de detalles de una persona (actor/director) */

import React, { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService.js';

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

    return React.createElement(
        'div',
        { 
            className: 'person-detail-backdrop',
            onClick: handleBackdropClick
        },
        React.createElement(
            'div',
            { className: 'person-detail-panel' },
            React.createElement(
                'button',
                {
                    className: 'close-button',
                    onClick: onClose
                },
                '✕'
            ),
            loading ? React.createElement(
                'div',
                { className: 'loading-container' },
                React.createElement('div', { className: 'spinner' }),
                React.createElement('p', null, 'Cargando información...')
            ) : React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    'div',
                    { className: 'person-detail-header' },
                    React.createElement(
                        'div',
                        { className: 'person-photo-section' },
                        React.createElement('img', {
                            src: imageUrl,
                            alt: person.name,
                            className: 'person-photo'
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'person-info-section' },
                        React.createElement('h2', { className: 'person-name' }, person.name),
                        person.birthday && React.createElement(
                            'p',
                            { className: 'person-meta' },
                            `📅 ${new Date(person.birthday).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}`
                        ),
                        person.place_of_birth && React.createElement(
                            'p',
                            { className: 'person-meta' },
                            `📍 ${person.place_of_birth}`
                        ),
                        person.known_for_department && React.createElement(
                            'p',
                            { className: 'person-department' },
                            person.known_for_department === 'Acting' ? '🎭 Actor/Actriz' : '🎬 Director'
                        ),
                        person.biography && React.createElement(
                            'div',
                            { className: 'person-biography' },
                            React.createElement('h3', null, 'Biografía'),
                            React.createElement('p', null, 
                                person.biography.length > 600 
                                    ? person.biography.substring(0, 600) + '...'
                                    : person.biography
                            )
                        )
                    )
                ),
                movies.length > 0 && React.createElement(
                    'div',
                    { className: 'person-movies-section' },
                    React.createElement('h3', { className: 'person-movies-title' }, 
                        '🎬 Filmografía Destacada'
                    ),
                    React.createElement(
                        'div',
                        { className: 'person-movies-grid' },
                        movies.map(movie =>
                            React.createElement(
                                'div',
                                { 
                                    key: movie.id, 
                                    className: 'person-movie-card',
                                    onClick: () => handleMovieCardClick(movie)
                                },
                                React.createElement('img', {
                                    src: movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                        : 'https://via.placeholder.com/300x450?text=Sin+Imagen',
                                    alt: movie.title,
                                    className: 'person-movie-poster'
                                }),
                                React.createElement(
                                    'div',
                                    { className: 'person-movie-info' },
                                    React.createElement('h4', { className: 'person-movie-title' }, movie.title),
                                    movie.character && React.createElement(
                                        'p',
                                        { className: 'person-movie-role' },
                                        movie.character
                                    ),
                                    movie.job && React.createElement(
                                        'p',
                                        { className: 'person-movie-role' },
                                        movie.job
                                    ),
                                    movie.release_date && React.createElement(
                                        'p',
                                        { className: 'person-movie-year' },
                                        new Date(movie.release_date).getFullYear()
                                    ),
                                    movie.vote_average > 0 && React.createElement(
                                        'p',
                                        { className: 'person-movie-rating' },
                                        `⭐ ${movie.vote_average.toFixed(1)}`
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}
