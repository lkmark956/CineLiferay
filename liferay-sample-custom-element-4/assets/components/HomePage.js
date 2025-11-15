/**
 * Componente de la página principal
 * Muestra animación ticker + top 5 películas más vistas
 */

import React, { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService.js';
import { TickerAnimation } from './TickerAnimation.js';
import { MovieDetailPanel } from './MovieDetailPanel.js';

export function HomePage() {
    const [topMovies, setTopMovies] = useState([]);
    const [tickerMovies, setTickerMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [clickedCardId, setClickedCardId] = useState(null);

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            setLoading(true);
            
            // Cargar múltiples páginas de películas para tener suficientes
            const [page1, page2] = await Promise.all([
                tmdbService.getPopularMovies(1),
                tmdbService.getPopularMovies(2)
            ]);
            
            const allMovies = [...page1.results, ...page2.results];
            
            // Top 5 para la lista horizontal
            setTopMovies(allMovies.slice(0, 5));
            
            // Películas para el ticker (usamos más películas para 3 líneas)
            setTickerMovies(allMovies.slice(5, 35));
            
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setLoading(false);
        }
    };

    const handleMovieClick = (movie, movieId) => {
        setClickedCardId(movieId);
        // Pequeño delay para que la animación de la tarjeta se vea
        setTimeout(() => {
            setSelectedMovie(movie);
        }, 300);
    };

    const handleCloseDetail = () => {
        setSelectedMovie(null);
        setClickedCardId(null);
    };

    if (loading) {
        return React.createElement(
            'div',
            { className: 'loading-container' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Cargando películas...')
        );
    }

    return React.createElement(
        'div',
        { className: 'home-page' },
        React.createElement(
            'div',
            { className: 'hero-section' },
                React.createElement('h1', { className: 'hero-title' }, 
                    React.createElement('span', { className: 'title-word' }, 'Bienvenido'),
                    React.createElement('span', { className: 'title-word' }, ' a '),
                    React.createElement('span', { className: 'title-word title-highlight' }, 'CineHub')
                ),
                React.createElement('p', { className: 'hero-subtitle' }, 'Descubre las películas más populares del momento')
        ),
        tickerMovies.length > 0 && React.createElement(
            'div',
            { className: 'ticker-triple-container' },
            React.createElement(
                'div',
                { className: 'ticker-horizontal-wrapper ticker-line-1' },
                React.createElement(TickerAnimation, { items: tickerMovies.slice(0, 10), direction: 'left' })
            ),
            React.createElement(
                'div',
                { className: 'ticker-horizontal-wrapper ticker-line-2' },
                React.createElement(TickerAnimation, { items: tickerMovies.slice(10, 20), direction: 'right' })
            ),
            React.createElement(
                'div',
                { className: 'ticker-horizontal-wrapper ticker-line-3' },
                React.createElement(TickerAnimation, { items: tickerMovies.slice(20, 30), direction: 'left' })
            )
        ),
        React.createElement(
            'section',
            { className: 'recent-movies-section' },
            React.createElement('h2', { className: 'section-title' }, 
                'Recién Llegadas'
            ),
            React.createElement(
                'div',
                { className: 'top-movies-horizontal' },
                tickerMovies.slice(0, 5).map(movie =>
                    React.createElement(
                        'div',
                        { 
                            key: movie.id, 
                            className: `top-movie-card ${clickedCardId === `recent-${movie.id}` ? 'flipping' : ''}`,
                            onClick: () => handleMovieClick(movie, `recent-${movie.id}`)
                        },
                        React.createElement('img', {
                            src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                            alt: movie.title,
                            className: 'top-movie-poster'
                        }),
                        React.createElement(
                            'div',
                            { className: 'top-movie-overlay' },
                            React.createElement('h3', { className: 'top-movie-title' }, movie.title),
                            React.createElement('p', { className: 'top-movie-rating' }, `⭐ ${movie.vote_average.toFixed(1)}`)
                        )
                    )
                )
            )
        ),
        React.createElement(
            'section',
            { className: 'top-movies-section' },
                React.createElement('h2', { className: 'section-title' }, 
                    'Top 5 Más Vistas'
                ),
            React.createElement(
                'div',
                { className: 'top-movies-horizontal' },
                topMovies.map((movie, index) =>
                    React.createElement(
                        'div',
                        { 
                            key: movie.id, 
                            className: `top-movie-card ${clickedCardId === `top-${movie.id}` ? 'flipping' : ''}`,
                            onClick: () => handleMovieClick(movie, `top-${movie.id}`)
                        },
                        React.createElement('div', { className: 'movie-rank-number' }, (index + 1).toString()),
                        React.createElement('img', {
                            src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                            alt: movie.title,
                            className: 'top-movie-poster'
                        }),
                        React.createElement(
                            'div',
                            { className: 'top-movie-overlay' },
                            React.createElement('h3', { className: 'top-movie-title' }, movie.title),
                            React.createElement('p', { className: 'top-movie-rating' }, `⭐ ${movie.vote_average.toFixed(1)}`)
                        )
                    )
                )
            )
        ),
        React.createElement(MovieDetailPanel, {
            movie: selectedMovie,
            onClose: handleCloseDetail
        })
    );
}
