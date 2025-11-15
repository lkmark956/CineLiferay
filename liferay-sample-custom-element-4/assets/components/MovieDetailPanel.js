/**
 * Componente para mostrar el panel de detalles de una película
 * Se muestra al hacer click en una tarjeta con animación
 */

import React from 'react';
import { TMDB_CONFIG } from '../config/tmdb.config.js';

export function MovieDetailPanel({ movie, onClose }) {
    if (!movie) return null;

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('movie-detail-backdrop')) {
            onClose();
        }
    };

    const imageUrl = movie.poster_path 
        ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return React.createElement(
        'div',
        { 
            className: 'movie-detail-backdrop',
            onClick: handleBackdropClick
        },
        React.createElement(
            'div',
            { className: 'movie-detail-panel' },
            React.createElement(
                'button',
                {
                    className: 'close-button',
                    onClick: onClose
                },
                '✕'
            ),
            React.createElement(
                'div',
                { className: 'movie-detail-poster-section' },
                React.createElement('img', {
                    src: imageUrl,
                    alt: movie.title
                })
            ),
            React.createElement(
                'div',
                { className: 'movie-detail-content' },
                React.createElement('h2', { className: 'detail-title' }, movie.title),
                React.createElement(
                    'div',
                    { className: 'detail-rating' },
                    React.createElement('span', { className: 'rating-star' }, '⭐'),
                    React.createElement('span', { className: 'rating-value' }, movie.vote_average.toFixed(1)),
                    React.createElement('span', { className: 'rating-count' }, `(${movie.vote_count} votos)`)
                ),
                React.createElement(
                    'div',
                    { className: 'detail-meta' },
                    React.createElement('span', { className: 'meta-date' }, movie.release_date),
                    movie.original_language && React.createElement(
                        'span',
                        { className: 'meta-language' },
                        movie.original_language.toUpperCase()
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'detail-overview' },
                    React.createElement('h3', { className: 'overview-title' }, 'Sinopsis'),
                    React.createElement('p', { className: 'overview-text' }, movie.overview || 'No hay sinopsis disponible.')
                ),
                movie.popularity && React.createElement(
                    'div',
                    { className: 'detail-popularity' },
                    React.createElement('span', null, '🔥 Popularidad: '),
                    React.createElement('strong', null, Math.round(movie.popularity))
                )
            )
        )
    );
}
