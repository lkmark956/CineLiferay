/**
 * Componente de página explorar
 * Muestra 5 películas de 6 géneros diferentes
 */

import React, { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService.js';
import { MovieDetailPanel } from './MovieDetailPanel.js';
import { CinematicLoader } from './CinematicLoader.js';

export function ExplorePage() {
    const [genreMovies, setGenreMovies] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [genrePages, setGenrePages] = useState({});

    // IDs de géneros de TMDb
    const genres = [
        { id: 28, name: 'Acción', icon: '💥' },
        { id: 35, name: 'Comedia', icon: '😂' },
        { id: 18, name: 'Drama', icon: '🎭' },
        { id: 27, name: 'Terror', icon: '👻' },
        { id: 878, name: 'Ciencia Ficción', icon: '🚀' },
        { id: 10749, name: 'Romance', icon: '💕' },
        { id: 16, name: 'Animación', icon: '🎨' },
        { id: 12, name: 'Aventura', icon: '🗺️' }
    ];

    useEffect(() => {
        loadGenreMovies();
    }, []);

    const loadGenreMovies = async () => {
        try {
            setLoading(true);
            const moviesData = {};
            const pagesData = {};

            // Cargar 18 películas para cada género (3 páginas de 6)
            for (const genre of genres) {
                const data = await tmdbService.getMoviesByGenre(genre.id);
                moviesData[genre.name] = data.results.slice(0, 18);
                pagesData[genre.name] = 0; // Página inicial
            }

            setGenreMovies(moviesData);
            setGenrePages(pagesData);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando géneros:', error);
            setLoading(false);
        }
    };

    const scrollGenre = (genreName, direction) => {
        const currentPage = genrePages[genreName] || 0;
        const maxPage = 2; // 0, 1, 2 (3 páginas de 6 películas)
        
        let newPage = currentPage;
        if (direction === 'next' && currentPage < maxPage) {
            newPage = currentPage + 1;
        } else if (direction === 'prev' && currentPage > 0) {
            newPage = currentPage - 1;
        }
        
        setGenrePages({ ...genrePages, [genreName]: newPage });
    };

    const handleMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            setSelectedMovie(details);
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    const handleGenreFilter = (genreId) => {
        setSelectedGenre(selectedGenre === genreId ? null : genreId);
    };

    const genresToShow = selectedGenre 
        ? genres.filter(g => g.id === selectedGenre)
        : genres;

    if (loading) {
        return React.createElement(CinematicLoader, { message: 'Explorando géneros...' });
    }

    return React.createElement(
        'div',
        { className: 'explore-page' },
        React.createElement('h1', { className: 'page-title' }, 
            React.createElement('span', { className: 'page-icon' }),
            'Explorar por Género'
        ),
        React.createElement(
            'div',
            { className: 'genre-filters' },
            genres.map(genre =>
                React.createElement(
                    'button',
                    {
                        key: genre.id,
                        className: `genre-filter-button ${selectedGenre === genre.id ? 'active' : ''}`,
                        onClick: () => handleGenreFilter(genre.id)
                    },
                    React.createElement('span', { className: 'genre-icon' }, genre.icon),
                    React.createElement('span', null, genre.name)
                )
            )
        ),
        genresToShow.map(genre => {
            const currentPage = genrePages[genre.name] || 0;
            const startIndex = currentPage * 6;
            const endIndex = startIndex + 6;
            const moviesToShow = genreMovies[genre.name]?.slice(startIndex, endIndex) || [];
            const hasPrev = currentPage > 0;
            const hasNext = currentPage < 2 && genreMovies[genre.name]?.length > endIndex;

            return React.createElement(
                'section',
                { key: genre.id, className: 'genre-section' },
                React.createElement('h2', { className: 'genre-title' }, genre.name),
                React.createElement(
                    'div',
                    { className: 'genre-movies-wrapper' },
                    hasPrev && React.createElement(
                        'button',
                        {
                            className: 'genre-nav-button prev',
                            onClick: () => scrollGenre(genre.name, 'prev')
                        },
                        '‹'
                    ),
                    React.createElement(
                        'div',
                        { className: 'genre-movies-horizontal' },
                        moviesToShow.map(movie =>
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
                                    React.createElement('p', { className: 'genre-movie-rating' }, `★ ${movie.vote_average.toFixed(1)}`)
                                )
                            )
                        )
                    ),
                    hasNext && React.createElement(
                        'button',
                        {
                            className: 'genre-nav-button next',
                            onClick: () => scrollGenre(genre.name, 'next')
                        },
                        '›'
                    )
                )
            );
        }),
        React.createElement(MovieDetailPanel, {
            movie: selectedMovie,
            onClose: () => setSelectedMovie(null)
        })
    );
}
