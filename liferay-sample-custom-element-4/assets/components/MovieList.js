/* Componente para mostrar lista de películas */

import React, { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService.js';
import { MovieCard } from './MovieCard.js';

export function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadPopularMovies();
    }, []);

    const loadPopularMovies = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tmdbService.getPopularMovies();
            setMovies(data.results.slice(0, 6)); // Solo 6 películas para la demo
            setLoading(false);
        } catch (err) {
            setError('Error al cargar películas');
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadPopularMovies();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await tmdbService.searchMovies(searchQuery);
            setMovies(data.results.slice(0, 6));
            setLoading(false);
        } catch (err) {
            setError('Error al buscar películas');
            setLoading(false);
        }
    };

    const handleMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            alert(`${details.title}\n\n${details.overview}\n\nPresupuesto: $${details.budget.toLocaleString()}`);
        } catch (err) {
            console.error('Error al cargar detalles:', err);
        }
    };

    if (loading) {
        return React.createElement('div', { className: 'loading' }, 'Cargando películas...');
    }

    if (error) {
        return React.createElement('div', { className: 'error' }, error);
    }

    return React.createElement(
        'div',
        { className: 'movie-list-container' },
        React.createElement(
            'h1',
            { className: 'title' },
            '🎬 TMDb Movie Browser'
        ),
        React.createElement(
            'form',
            { onSubmit: handleSearch, className: 'search-form' },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Buscar películas...',
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: 'search-input'
            }),
            React.createElement('button', { type: 'submit', className: 'search-button' }, '🔍 Buscar')
        ),
        React.createElement(
            'div',
            { className: 'movies-grid' },
            movies.map(movie => 
                React.createElement(MovieCard, {
                    key: movie.id,
                    movie: movie,
                    onClick: handleMovieClick
                })
            )
        )
    );
}
