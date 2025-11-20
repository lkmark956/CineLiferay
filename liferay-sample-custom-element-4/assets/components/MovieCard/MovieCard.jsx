/* Componente para mostrar una tarjeta de película */

import React from 'react';
import { TMDB_CONFIG } from '../../config/tmdb.config.js';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton.jsx';
import { WatchedButton } from '../WatchedButton/WatchedButton.jsx';
import './MovieCard.css';

export function MovieCard({ movie, onClick }) {
    const imageUrl = movie.poster_path 
        ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <div className="movie-card" onClick={() => onClick(movie)}>
            <div className="movie-actions">
                <FavoriteButton movie={movie} />
                <WatchedButton movie={movie} />
            </div>
            <img 
                src={imageUrl}
                alt={movie.title}
                className="movie-poster"
            />
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
                <p className="movie-date">{movie.release_date}</p>
            </div>
        </div>
    );
}
