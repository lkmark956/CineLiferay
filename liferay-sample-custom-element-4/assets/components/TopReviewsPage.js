/* Página de películas mejor valoradas y con más reseñas */

import React, { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService.js';
import reviewsService from '../services/reviewsService.js';
import { MovieDetailPanel } from './MovieDetailPanel.js';
import { CinematicLoader } from './CinematicLoader.js';

export function TopReviewsPage() {
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [topUserReviewed, setTopUserReviewed] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tmdb'); // 'tmdb' o 'user'

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Cargar películas top rated de TMDB
            const tmdbData = await tmdbService.getTopRatedMovies(1);
            setTopRatedMovies(tmdbData.results.slice(0, 20));
            
            // Cargar películas con más reseñas de usuarios
            const userTopMovies = reviewsService.getTopReviewedMovies(20);
            setTopUserReviewed(userTopMovies);
            
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setLoading(false);
        }
    };

    const handleMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id || movie.movieId);
            setSelectedMovie(details);
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    if (loading) {
        return React.createElement(CinematicLoader, { message: 'Cargando reseñas...' });
    }

    return React.createElement(
        'div',
        { className: 'top-reviews-page' },
        React.createElement('h1', { className: 'page-title' }, 
            React.createElement('span', { className: 'page-icon' }),
            'Películas Mejor Valoradas'
        ),
        
        // Tabs
        React.createElement(
            'div',
            { className: 'tabs-container' },
            React.createElement(
                'button',
                {
                    className: `tab-button ${activeTab === 'tmdb' ? 'active' : ''}`,
                    onClick: () => setActiveTab('tmdb')
                },
                'Top TMDB',
                React.createElement('span', { className: 'tab-count' }, topRatedMovies.length)
            ),
            React.createElement(
                'button',
                {
                    className: `tab-button ${activeTab === 'user' ? 'active' : ''}`,
                    onClick: () => setActiveTab('user')
                },
                'Tus reseñas',
                React.createElement('span', { className: 'tab-count' }, topUserReviewed.length)
            )
        ),

        // Content - TMDB Top Rated
        activeTab === 'tmdb' && React.createElement(
            'div',
            { className: 'tab-content' },
            topRatedMovies.length === 0 ? React.createElement(
                'div',
                { className: 'empty-state' },
                React.createElement('div', { className: 'empty-icon' }, '□'),
                React.createElement('h2', null, 'No hay películas disponibles')
            ) : React.createElement(
                'div',
                { className: 'movies-grid' },
                topRatedMovies.map((movie, index) =>
                    React.createElement(
                        'div',
                        {
                            key: movie.id,
                            className: 'top-review-card',
                            onClick: () => handleMovieClick(movie)
                        },
                        React.createElement('div', { className: 'top-review-rank' }, `#${index + 1}`),
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
                            React.createElement(
                                'div',
                                { className: 'movie-stats' },
                                React.createElement('span', { className: 'movie-rating' }, 
                                    `★ ${movie.vote_average.toFixed(1)}`
                                ),
                                React.createElement('span', { className: 'movie-votes' }, 
                                    `${movie.vote_count} votos`
                                )
                            )
                        )
                    )
                )
            )
        ),

        // Content - User Reviewed
        activeTab === 'user' && React.createElement(
            'div',
            { className: 'tab-content' },
            topUserReviewed.length === 0 ? React.createElement(
                'div',
                { className: 'empty-state' },
                React.createElement('div', { className: 'empty-icon' }, '□'),
                React.createElement('h2', null, 'No hay reseñas de usuarios'),
                React.createElement('p', null, 'Sé el primero en escribir una reseña')
            ) : React.createElement(
                'div',
                { className: 'movies-grid' },
                topUserReviewed.map((movieStat, index) =>
                    React.createElement(
                        'div',
                        {
                            key: movieStat.movieId,
                            className: 'top-review-card',
                            onClick: () => handleMovieClick(movieStat)
                        },
                        React.createElement('div', { className: 'top-review-rank' }, `#${index + 1}`),
                        React.createElement('img', {
                            src: movieStat.moviePoster 
                                ? `https://image.tmdb.org/t/p/w500${movieStat.moviePoster}`
                                : 'https://via.placeholder.com/500x750?text=No+Image',
                            alt: movieStat.movieTitle,
                            className: 'movie-poster'
                        }),
                        React.createElement(
                            'div',
                            { className: 'movie-info' },
                            React.createElement('h3', null, movieStat.movieTitle),
                            React.createElement(
                                'div',
                                { className: 'movie-stats' },
                                React.createElement('span', { className: 'movie-rating' }, 
                                    `★ ${movieStat.averageRating}`
                                ),
                                React.createElement('span', { className: 'movie-votes' }, 
                                    `${movieStat.reviewCount} reseña${movieStat.reviewCount !== 1 ? 's' : ''}`
                                )
                            )
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
