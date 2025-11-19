/* Componente de página de búsqueda */

import React, { useState } from 'react';
import tmdbService from '../services/tmdbService.js';
import { MovieCard } from './MovieCard.js';
import { SkeletonGrid } from './SkeletonCard.js';
import { MovieDetailPanel } from './MovieDetailPanel.js';

export function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    React.useEffect(() => {
        // Listener para abrir película desde PersonDetailPanel
        const handleOpenMovieDetail = (event) => {
            setSelectedMovie(event.detail);
        };
        
        window.addEventListener('openMovieDetail', handleOpenMovieDetail);
        
        return () => {
            window.removeEventListener('openMovieDetail', handleOpenMovieDetail);
        };
    }, []);

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
            setSelectedMovie(details);
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
        loading && React.createElement(SkeletonGrid, { count: 10 }),
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
        ),
        React.createElement(MovieDetailPanel, {
            movie: selectedMovie,
            onClose: () => setSelectedMovie(null)
        })
    );
}
