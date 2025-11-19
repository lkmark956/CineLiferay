/* Página de películas favoritas */

import React, { useState, useEffect } from 'react';
import favoritesService from '../services/favoritesService.js';
import { MovieDetailPanel } from './MovieDetailPanel.js';
import tmdbService from '../services/tmdbService.js';

export function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        loadFavorites();
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

    return React.createElement(
        'div',
        { className: 'favorites-page' },
        React.createElement('h1', { className: 'page-title' }, 
            React.createElement('span', { className: 'page-icon' }),
            'Mis Favoritos'
        ),
        favorites.length === 0 ? React.createElement(
            'div',
            { className: 'empty-state' },
            React.createElement('div', { className: 'empty-icon' }, '💔'),
            React.createElement('h2', null, 'No tienes favoritos aún'),
            React.createElement('p', null, 'Marca películas con el corazón para verlas aquí')
        ) : React.createElement(
            React.Fragment,
            null,
            React.createElement('p', { className: 'results-count' }, 
                `${favorites.length} película${favorites.length !== 1 ? 's' : ''} favorita${favorites.length !== 1 ? 's' : ''}`
            ),
            React.createElement(
                'div',
                { className: 'movies-grid' },
                favorites.map(movie =>
                    React.createElement(
                        'div',
                        {
                            key: movie.id,
                            className: 'movie-card',
                            onClick: () => handleMovieClick(movie)
                        },
                        React.createElement(
                            'button',
                            {
                                className: 'remove-button',
                                onClick: (e) => {
                                    e.stopPropagation();
                                    handleRemoveFavorite(movie.id);
                                }
                            },
                            '✕'
                        ),
                        React.createElement('img', {
                            src: movie.poster_path 
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : 'https://via.placeholder.com/500x750?text=No+Image',
                            alt: movie.title,
                            className: 'movie-poster'
                        }),
                        React.createElement(
                            'div',
                            { className: 'movie-info' },
                            React.createElement('h3', null, movie.title),
                            React.createElement('p', { className: 'movie-rating' }, `★ ${movie.vote_average.toFixed(1)}`),
                            React.createElement('p', { className: 'movie-date' }, movie.release_date)
                        )
                    )
                )
            )
        ),
        React.createElement(MovieDetailPanel, {
            movie: selectedMovie,
            onClose: () => setSelectedMovie(null)
        })
    );
}
