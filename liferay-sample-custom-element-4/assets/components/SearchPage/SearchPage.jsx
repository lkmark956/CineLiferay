/* Componente de página de búsqueda */

import React, { useState } from 'react';
import tmdbService from '../../services/tmdbService.js';
import { MovieCard } from '../MovieCard/MovieCard.jsx';
import { SkeletonGrid } from '../SkeletonCard/SkeletonCard.jsx';
import { MovieDetailPanel } from '../MovieDetailPanel/MovieDetailPanel.jsx';
import './SearchPage.css';

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

    return (
        <div className="search-page">
            <h1 className="page-title">
                <span className="page-icon"></span>
                Buscar Películas
            </h1>
            <form onSubmit={handleSearch} className="search-form-large">
                <input
                    type="text"
                    placeholder="Escribe el nombre de una película..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-large"
                />
                <button type="submit" className="search-button-large">
                    ⌕ Buscar
                </button>
            </form>
            {loading && <SkeletonGrid count={10} />}
            {!loading && searched && movies.length === 0 && (
                <div className="no-results">
                    <p>No se encontraron resultados</p>
                    <p className="no-results-hint">Intenta con otro término de búsqueda</p>
                </div>
            )}
            {!loading && movies.length > 0 && (
                <div>
                    <p className="results-count">{movies.length} resultados encontrados</p>
                    <div className="movies-grid">
                        {movies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={handleMovieClick}
                            />
                        ))}
                    </div>
                </div>
            )}
            <MovieDetailPanel
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
            />
        </div>
    );
}
