/**
 * Componente de página explorar
 * Muestra 5 películas de 6 géneros diferentes
 */

import React, { useState, useEffect } from 'react';
import tmdbService from '../../services/tmdbService.js';
import { MovieDetailPanel } from '../MovieDetailPanel/MovieDetailPanel.jsx';
import { CinematicLoader } from '../CinematicLoader/CinematicLoader.jsx';
import './ExplorePage.css';

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
        
        // Listener para abrir película desde PersonDetailPanel
        const handleOpenMovieDetail = (event) => {
            setSelectedMovie(event.detail);
        };
        
        window.addEventListener('openMovieDetail', handleOpenMovieDetail);
        
        return () => {
            window.removeEventListener('openMovieDetail', handleOpenMovieDetail);
        };
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
        return <CinematicLoader message="Explorando géneros..." />;
    }

    return (
        <div className="explore-page">
            <h1 className="page-title">
                <span className="page-icon"></span>
                Explorar por Género
            </h1>
            <div className="genre-filters">
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        className={`genre-filter-button ${selectedGenre === genre.id ? 'active' : ''}`}
                        onClick={() => handleGenreFilter(genre.id)}
                    >
                        <span className="genre-icon">{genre.icon}</span>
                        <span>{genre.name}</span>
                    </button>
                ))}
            </div>
            {genresToShow.map(genre => {
                const currentPage = genrePages[genre.name] || 0;
                const startIndex = currentPage * 6;
                const endIndex = startIndex + 6;
                const moviesToShow = genreMovies[genre.name]?.slice(startIndex, endIndex) || [];
                const hasPrev = currentPage > 0;
                const hasNext = currentPage < 2 && genreMovies[genre.name]?.length > endIndex;

                return (
                    <section key={genre.id} className="genre-section">
                        <h2 className="genre-title">{genre.name}</h2>
                        <div className="genre-movies-wrapper">
                            {hasPrev && (
                                <button
                                    className="genre-nav-button prev"
                                    onClick={() => scrollGenre(genre.name, 'prev')}
                                >
                                    ‹
                                </button>
                            )}
                            <div className="genre-movies-horizontal">
                                {moviesToShow.map(movie => (
                                    <div
                                        key={movie.id}
                                        className="genre-movie-card"
                                        onClick={() => handleMovieClick(movie)}
                                    >
                                        <img 
                                            src={movie.poster_path 
                                                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                                : 'https://via.placeholder.com/200x300?text=No+Image'}
                                            alt={movie.title}
                                            className="genre-movie-poster"
                                        />
                                        <div className="genre-movie-info">
                                            <h4 className="genre-movie-title">{movie.title}</h4>
                                            <p className="genre-movie-rating">★ {movie.vote_average.toFixed(1)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {hasNext && (
                                <button
                                    className="genre-nav-button next"
                                    onClick={() => scrollGenre(genre.name, 'next')}
                                >
                                    ›
                                </button>
                            )}
                        </div>
                    </section>
                );
            })}
            <MovieDetailPanel
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </div>
    );
}
