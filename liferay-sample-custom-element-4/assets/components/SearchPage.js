/**
 * Componente de página de búsqueda
 */

import React, { useState } from 'react';
import tmdbService from '../services/tmdbService.js';
import { MovieCard } from './MovieCard.js';

export function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            setSearched(true);
            const data = await tmdbService.searchMovies(searchQuery);
            setMovies(data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error en búsqueda:', error);
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

    return React.createElement(
        'div',
        { className: 'search-page' },
        React.createElement('h1', { className: 'page-title' }, 
            React.createElement('span', { className: 'page-icon' }),
            'Buscar Películas'
        ),
        React.createElement(
            'form',
            { onSubmit: handleSearch, className: 'search-form-large' },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Escribe el nombre de una película...',
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: 'search-input-large'
            }),
            React.createElement(
                'button',
                { type: 'submit', className: 'search-button-large' },
                '⌕ Buscar'
            )
        ),
        loading && React.createElement(
            'div',
            { className: 'loading-container' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Buscando...')
        ),
        !loading && searched && movies.length === 0 && React.createElement(
            'div',
            { className: 'no-results' },
            React.createElement('p', null, 'No se encontraron resultados'),
            React.createElement('p', { className: 'no-results-hint' }, 'Intenta con otro término de búsqueda')
        ),
        !loading && movies.length > 0 && React.createElement(
            'div',
            null,
            React.createElement('p', { className: 'results-count' }, `${movies.length} resultados encontrados`),
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
        )
    );
}
