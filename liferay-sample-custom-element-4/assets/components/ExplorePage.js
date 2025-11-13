/**
 * Componente de página explorar
 * Muestra 5 películas de 6 géneros diferentes
 */

import React, { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService.js';

export function ExplorePage() {
    const [genreMovies, setGenreMovies] = useState({});
    const [loading, setLoading] = useState(true);

    // IDs de géneros de TMDb
    const genres = [
        { id: 28, name: 'Acción' },
        { id: 35, name: 'Comedia' },
        { id: 18, name: 'Drama' },
        { id: 27, name: 'Terror' },
        { id: 878, name: 'Ciencia Ficción' },
        { id: 10749, name: 'Romance' }
    ];

    useEffect(() => {
        loadGenreMovies();
    }, []);

    const loadGenreMovies = async () => {
        try {
            setLoading(true);
            const moviesData = {};

            // Cargar 6 películas para cada género
            for (const genre of genres) {
                const data = await tmdbService.getMoviesByGenre(genre.id);
                moviesData[genre.name] = data.results.slice(0, 6);
            }

            setGenreMovies(moviesData);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando géneros:', error);
            setLoading(false);
        }
    };

    const handleMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            alert(`${details.title}\n\n${details.overview}\n\nCalificación: ${details.vote_average}/10`);
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    if (loading) {
        return React.createElement(
            'div',
            { className: 'loading-container' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Explorando géneros...')
        );
    }

    return React.createElement(
        'div',
        { className: 'explore-page' },
        React.createElement('h1', { className: 'page-title' }, 
            React.createElement('span', { className: 'page-icon' }),
            'Explorar por Género'
        ),
        genres.map(genre =>
            React.createElement(
                'section',
                { key: genre.id, className: 'genre-section' },
                React.createElement('h2', { className: 'genre-title' }, genre.name),
                React.createElement(
                    'div',
                    { className: 'genre-movies-horizontal' },
                    genreMovies[genre.name]?.map(movie =>
                        React.createElement(
                            'div',
                            {
                                key: movie.id,
                                className: 'genre-movie-card',
                                onClick: () => handleMovieClick(movie)
                            },
                            React.createElement('img', {
                                src: movie.poster_path 
                                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                    : 'https://via.placeholder.com/200x300?text=No+Image',
                                alt: movie.title,
                                className: 'genre-movie-poster'
                            }),
                            React.createElement(
                                'div',
                                { className: 'genre-movie-info' },
                                React.createElement('h4', { className: 'genre-movie-title' }, movie.title),
                                React.createElement('p', { className: 'genre-movie-rating' }, `⭐ ${movie.vote_average.toFixed(1)}`)
                            )
                        )
                    )
                )
            )
        )
    );
}
