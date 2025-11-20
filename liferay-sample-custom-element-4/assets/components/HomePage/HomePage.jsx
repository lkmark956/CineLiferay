/* Componente de la página principal y muestra animación ticker + top 5 películas más vistas */

import React, { useState, useEffect } from 'react';
import tmdbService from '../../services/tmdbService.js';
import { TickerAnimation } from '../TickerAnimation/TickerAnimation.jsx';
import { MovieDetailPanel } from '../MovieDetailPanel/MovieDetailPanel.jsx';
import { SkeletonHorizontal } from '../SkeletonCard/SkeletonCard.jsx';
import { FloatingParticles } from '../FloatingParticles/FloatingParticles.jsx';
import './HomePage.css';

export function HomePage() {
    const [topMovies, setTopMovies] = useState([]);
    const [tickerMovies, setTickerMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        loadHomeData();
        
        // Listener para abrir película desde PersonDetailPanel
        const handleOpenMovieDetail = (event) => {
            setSelectedMovie(event.detail);
        };
        
        window.addEventListener('openMovieDetail', handleOpenMovieDetail);
        
        return () => {
            window.removeEventListener('openMovieDetail', handleOpenMovieDetail);
        };
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

    const handleMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            setSelectedMovie(details);
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    if (loading) {
        return (
            <div className="home-page">
                <div className="hero-section">
                    <h1 className="hero-title">
                        <span className="title-word">Bienvenido</span>
                        <span className="title-word"> a </span>
                        <span className="title-word title-highlight">CineHub</span>
                    </h1>
                    <p className="hero-subtitle">Descubre las películas más populares del momento</p>
                </div>
                <section className="recent-movies-section">
                    <h2 className="section-title">Recién Llegadas</h2>
                    <SkeletonHorizontal count={5} />
                </section>
                <section className="top-movies-section">
                    <h2 className="section-title">Top 5 Más Vistas</h2>
                    <SkeletonHorizontal count={5} />
                </section>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="hero-section">
                <FloatingParticles count={30} type="stars" />
                <h1 className="hero-title">
                    <span className="title-word">Bienvenido</span>
                    <span className="title-word"> a </span>
                    <span className="title-word title-highlight">CineHub</span>
                </h1>
                <p className="hero-subtitle">Descubre las películas más populares del momento</p>
            </div>
            {tickerMovies.length > 0 && (
                <div className="ticker-triple-container">
                    <div className="ticker-horizontal-wrapper ticker-line-1">
                        <TickerAnimation items={tickerMovies.slice(0, 10)} direction="left" />
                    </div>
                    <div className="ticker-horizontal-wrapper ticker-line-2">
                        <TickerAnimation items={tickerMovies.slice(10, 20)} direction="right" />
                    </div>
                    <div className="ticker-horizontal-wrapper ticker-line-3">
                        <TickerAnimation items={tickerMovies.slice(20, 30)} direction="left" />
                    </div>
                </div>
            )}
            <section className="recent-movies-section">
                <h2 className="section-title">
                    <span className="section-icon"></span>
                    Recién Llegadas
                </h2>
                <div className="top-movies-horizontal">
                    {tickerMovies.slice(0, 5).map(movie => (
                        <div 
                            key={movie.id} 
                            className="top-movie-card"
                            onClick={() => handleMovieClick(movie)}
                        >
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="top-movie-poster"
                            />
                            <div className="top-movie-overlay">
                                <h3 className="top-movie-title">{movie.title}</h3>
                                <p className="top-movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="top-movies-section">
                <h2 className="section-title">
                    <span className="section-icon"></span>
                    Top 5 Más Vistas
                </h2>
                <div className="top-movies-horizontal">
                    {topMovies.map((movie, index) => (
                        <div 
                            key={movie.id} 
                            className="top-movie-card"
                            onClick={() => handleMovieClick(movie)}
                        >
                            <div className="movie-rank-number">{(index + 1).toString()}</div>
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="top-movie-poster"
                            />
                            <div className="top-movie-overlay">
                                <h3 className="top-movie-title">{movie.title}</h3>
                                <p className="top-movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <MovieDetailPanel 
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </div>
    );
}
