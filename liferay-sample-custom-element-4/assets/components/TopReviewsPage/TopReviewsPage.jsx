/* Página de películas mejor valoradas y con más reseñas */

import React, { useState, useEffect } from 'react';
import tmdbService from '../../services/tmdbService';
import reviewsService from '../../services/reviewsService';
import { MovieDetailPanel } from '../MovieDetailPanel/MovieDetailPanel';
import { CinematicLoader } from '../CinematicLoader/CinematicLoader';
import './TopReviewsPage.css';

export function TopReviewsPage() {
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [topUserReviewed, setTopUserReviewed] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tmdb'); // 'tmdb' o 'user'

    useEffect(() => {
        loadData();
        
        // Listener para abrir película desde PersonDetailPanel
        const handleOpenMovieDetail = (event) => {
            setSelectedMovie(event.detail);
        };
        
        window.addEventListener('openMovieDetail', handleOpenMovieDetail);
        
        return () => {
            window.removeEventListener('openMovieDetail', handleOpenMovieDetail);
        };
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
        return <CinematicLoader message="Cargando reseñas..." />;
    }

    return (
        <div className="top-reviews-page">
            <h1 className="page-title">
                <span className="page-icon"></span>
                Películas Mejor Valoradas
            </h1>
            
            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'tmdb' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tmdb')}
                >
                    Top TMDB
                    <span className="tab-count">{topRatedMovies.length}</span>
                </button>
                <button
                    className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
                    onClick={() => setActiveTab('user')}
                >
                    Tus reseñas
                    <span className="tab-count">{topUserReviewed.length}</span>
                </button>
            </div>

            {/* Content - TMDB Top Rated */}
            {activeTab === 'tmdb' && (
                <div className="tab-content">
                    {topRatedMovies.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">□</div>
                            <h2>No hay películas disponibles</h2>
                        </div>
                    ) : (
                        <div className="movies-grid">
                            {topRatedMovies.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    className="top-review-card"
                                    onClick={() => handleMovieClick(movie)}
                                >
                                    <div className="top-review-rank">#{index + 1}</div>
                                    <img
                                        src={movie.poster_path 
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : 'https://via.placeholder.com/500x750?text=No+Image'}
                                        alt={movie.title}
                                        className="movie-poster"
                                    />
                                    <div className="movie-info">
                                        <h3>{movie.title}</h3>
                                        <div className="movie-stats">
                                            <span className="movie-rating">
                                                ★ {movie.vote_average.toFixed(1)}
                                            </span>
                                            <span className="movie-votes">
                                                {movie.vote_count} votos
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Content - User Reviewed */}
            {activeTab === 'user' && (
                <div className="tab-content">
                    {topUserReviewed.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">□</div>
                            <h2>No hay reseñas de usuarios</h2>
                            <p>Sé el primero en escribir una reseña</p>
                        </div>
                    ) : (
                        <div className="movies-grid">
                            {topUserReviewed.map((movieStat, index) => (
                                <div
                                    key={movieStat.movieId}
                                    className="top-review-card"
                                    onClick={() => handleMovieClick(movieStat)}
                                >
                                    <div className="top-review-rank">#{index + 1}</div>
                                    <img
                                        src={movieStat.moviePoster 
                                            ? `https://image.tmdb.org/t/p/w500${movieStat.moviePoster}`
                                            : 'https://via.placeholder.com/500x750?text=No+Image'}
                                        alt={movieStat.movieTitle}
                                        className="movie-poster"
                                    />
                                    <div className="movie-info">
                                        <h3>{movieStat.movieTitle}</h3>
                                        <div className="movie-stats">
                                            <span className="movie-rating">
                                                ★ {movieStat.averageRating}
                                            </span>
                                            <span className="movie-votes">
                                                {movieStat.reviewCount} reseña{movieStat.reviewCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <MovieDetailPanel
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </div>
    );
}
