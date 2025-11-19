/* Componente para mostrar una tarjeta de película */

import React from 'react';
import { TMDB_CONFIG } from '../config/tmdb.config.js';
import { FavoriteButton } from './FavoriteButton.js';
import { WatchedButton } from './WatchedButton.js';

export function MovieCard({ movie, onClick }) {
    const imageUrl = movie.poster_path 
        ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return React.createElement(
        'div',
        { 
            className: 'movie-card',
            onClick: () => onClick(movie)
        },
        React.createElement(
            'div',
            { className: 'movie-actions' },
            React.createElement(FavoriteButton, { movie: movie }),
            React.createElement(WatchedButton, { movie: movie })
        ),
        React.createElement('img', {
            src: imageUrl,
            alt: movie.title,
            className: 'movie-poster'
        }),
        React.createElement(
            'div',
            { className: 'movie-info' },
            React.createElement('h3', null, movie.title),
            React.createElement(
                'p',
                { className: 'movie-rating' },
                `⭐ ${movie.vote_average.toFixed(1)}`
            ),
            React.createElement(
                'p',
                { className: 'movie-date' },
                movie.release_date
            )
        )
    );
}
