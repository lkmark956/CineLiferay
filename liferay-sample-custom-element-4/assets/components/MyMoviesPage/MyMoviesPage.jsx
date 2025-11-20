/* Página de Mis Películas vistas y listas personalizadas */

import React, { useState, useEffect } from 'react';
import watchedService from '../../services/watchedService';
import listsService from '../../services/listsService';
import { MovieDetailPanel } from '../MovieDetailPanel/MovieDetailPanel';
import { WatchedButton } from '../WatchedButton/WatchedButton';
import tmdbService from '../../services/tmdbService';
import './MyMoviesPage.css';

export function MyMoviesPage() {
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [lists, setLists] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedList, setSelectedList] = useState(null);
    const [showCreateListModal, setShowCreateListModal] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [activeTab, setActiveTab] = useState('watched'); // 'watched' o 'lists'

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

    const loadData = () => {
        setWatchedMovies(watchedService.getWatched());
        setLists(listsService.getLists());
    };

    const handleMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            setSelectedMovie(details);
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    const handleCreateList = (e) => {
        e.preventDefault();
        if (newListName.trim()) {
            listsService.createList(newListName, newListDescription);
            setNewListName('');
            setNewListDescription('');
            setShowCreateListModal(false);
            loadData();
        }
    };

    const handleDeleteList = (listId) => {
        if (confirm('¿Estás seguro de eliminar esta lista?')) {
            listsService.deleteList(listId);
            loadData();
        }
    };

    const handleRemoveMovieFromList = (listId, movieId) => {
        listsService.removeMovieFromList(listId, movieId);
        loadData();
    };

    return (
        <div className="my-movies-page">
            <h1 className="page-title">
                <span className="page-icon"></span>
                Mis Películas
            </h1>
            
            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'watched' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watched')}
                >
                    Vistas
                    <span className="tab-count">{watchedMovies.length}</span>
                </button>
                <button
                    className={`tab-button ${activeTab === 'lists' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lists')}
                >
                    Mis Listas
                    <span className="tab-count">{lists.length}</span>
                </button>
            </div>

            {/* Content - Watched Movies */}
            {activeTab === 'watched' && (
                <div className="tab-content">
                    {watchedMovies.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">□</div>
                            <h2>No has visto ninguna película</h2>
                            <p>Marca películas como vistas para verlas aquí</p>
                        </div>
                    ) : (
                        <div className="movies-grid">
                            {watchedMovies.map(movie => (
                                <div
                                    key={movie.id}
                                    className="movie-card"
                                    onClick={() => handleMovieClick(movie)}
                                >
                                    <WatchedButton
                                        movie={movie}
                                        showAsIcon={true}
                                        onToggle={() => loadData()}
                                    />
                                    <img
                                        src={movie.poster_path 
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : 'https://via.placeholder.com/500x750?text=No+Image'}
                                        alt={movie.title}
                                        className="movie-poster"
                                    />
                                    <div className="movie-info">
                                        <h3>{movie.title}</h3>
                                        <p className="movie-rating">★ {movie.vote_average.toFixed(1)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Content - Lists */}
            {activeTab === 'lists' && (
                <div className="tab-content">
                    <button
                        className="create-list-button"
                        onClick={() => setShowCreateListModal(true)}
                    >
                        + Crear Nueva Lista
                    </button>
                    {lists.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">□</div>
                            <h2>No tienes listas creadas</h2>
                            <p>Crea listas personalizadas para organizar tus películas</p>
                        </div>
                    ) : (
                        <div className="lists-container">
                            {lists.map(list => (
                                <div key={list.id} className="list-card">
                                    <div className="list-header">
                                        <h3 className="list-title">{list.name}</h3>
                                        <button
                                            className="delete-list-button"
                                            onClick={() => handleDeleteList(list.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {list.description && <p className="list-description">{list.description}</p>}
                                    <p className="list-count">
                                        {list.movies.length} película{list.movies.length !== 1 ? 's' : ''}
                                    </p>
                                    {list.movies.length > 0 && (
                                        <div className="list-movies">
                                            {list.movies.slice(0, 4).map(movie => (
                                                <div
                                                    key={movie.id}
                                                    className="list-movie-mini"
                                                    onClick={() => handleMovieClick(movie)}
                                                >
                                                    <img
                                                        src={movie.poster_path 
                                                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                                            : 'https://via.placeholder.com/200x300?text=No+Image'}
                                                        alt={movie.title}
                                                    />
                                                </div>
                                            ))}
                                            {list.movies.length > 4 && (
                                                <div className="list-movie-more">
                                                    +{list.movies.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal para crear lista */}
            {showCreateListModal && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowCreateListModal(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Crear Nueva Lista</h2>
                        <form onSubmit={handleCreateList}>
                            <input
                                type="text"
                                placeholder="Nombre de la lista"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                className="modal-input"
                                autoFocus
                            />
                            <textarea
                                placeholder="Descripción (opcional)"
                                value={newListDescription}
                                onChange={(e) => setNewListDescription(e.target.value)}
                                className="modal-textarea"
                                rows={3}
                            />
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="modal-button cancel"
                                    onClick={() => setShowCreateListModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="modal-button confirm"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
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
