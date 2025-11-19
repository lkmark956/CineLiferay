/* Página de Mis Películas vistas y listas personalizadas */

import React, { useState, useEffect } from 'react';
import watchedService from '../services/watchedService.js';
import listsService from '../services/listsService.js';
import { MovieDetailPanel } from './MovieDetailPanel.js';
import { WatchedButton } from './WatchedButton.js';
import tmdbService from '../services/tmdbService.js';

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

    return React.createElement(
        'div',
        { className: 'my-movies-page' },
        React.createElement('h1', { className: 'page-title' }, 
            React.createElement('span', { className: 'page-icon' }),
            'Mis Películas'
        ),
        
        // Tabs
        React.createElement(
            'div',
            { className: 'tabs-container' },
            React.createElement(
                'button',
                {
                    className: `tab-button ${activeTab === 'watched' ? 'active' : ''}`,
                    onClick: () => setActiveTab('watched')
                },
                'Vistas',
                React.createElement('span', { className: 'tab-count' }, watchedMovies.length)
            ),
            React.createElement(
                'button',
                {
                    className: `tab-button ${activeTab === 'lists' ? 'active' : ''}`,
                    onClick: () => setActiveTab('lists')
                },
                'Mis Listas',
                React.createElement('span', { className: 'tab-count' }, lists.length)
            )
        ),

        // Content - Watched Movies
        activeTab === 'watched' && React.createElement(
            'div',
            { className: 'tab-content' },
            watchedMovies.length === 0 ? React.createElement(
                'div',
                { className: 'empty-state' },
                React.createElement('div', { className: 'empty-icon' }, '□'),
                React.createElement('h2', null, 'No has visto ninguna película'),
                React.createElement('p', null, 'Marca películas como vistas para verlas aquí')
            ) : React.createElement(
                'div',
                { className: 'movies-grid' },
                watchedMovies.map(movie =>
                    React.createElement(
                        'div',
                        {
                            key: movie.id,
                            className: 'movie-card',
                            onClick: () => handleMovieClick(movie)
                        },
                        React.createElement(WatchedButton, {
                            movie: movie,
                            showAsIcon: true,
                            onToggle: () => loadData()
                        }),
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
                            React.createElement('p', { className: 'movie-rating' }, `★ ${movie.vote_average.toFixed(1)}`)
                        )
                    )
                )
            )
        ),

        // Content - Lists
        activeTab === 'lists' && React.createElement(
            'div',
            { className: 'tab-content' },
            React.createElement(
                'button',
                {
                    className: 'create-list-button',
                    onClick: () => setShowCreateListModal(true)
                },
                '+ Crear Nueva Lista'
            ),
            lists.length === 0 ? React.createElement(
                'div',
                { className: 'empty-state' },
                React.createElement('div', { className: 'empty-icon' }, '□'),
                React.createElement('h2', null, 'No tienes listas creadas'),
                React.createElement('p', null, 'Crea listas personalizadas para organizar tus películas')
            ) : React.createElement(
                'div',
                { className: 'lists-container' },
                lists.map(list =>
                    React.createElement(
                        'div',
                        { key: list.id, className: 'list-card' },
                        React.createElement(
                            'div',
                            { className: 'list-header' },
                            React.createElement('h3', { className: 'list-title' }, list.name),
                            React.createElement(
                                'button',
                                {
                                    className: 'delete-list-button',
                                    onClick: () => handleDeleteList(list.id)
                                },
                                '✕'
                            )
                        ),
                        list.description && React.createElement('p', { className: 'list-description' }, list.description),
                        React.createElement('p', { className: 'list-count' }, 
                            `${list.movies.length} película${list.movies.length !== 1 ? 's' : ''}`
                        ),
                        list.movies.length > 0 && React.createElement(
                            'div',
                            { className: 'list-movies' },
                            list.movies.slice(0, 4).map(movie =>
                                React.createElement(
                                    'div',
                                    {
                                        key: movie.id,
                                        className: 'list-movie-mini',
                                        onClick: () => handleMovieClick(movie)
                                    },
                                    React.createElement('img', {
                                        src: movie.poster_path 
                                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                            : 'https://via.placeholder.com/200x300?text=No+Image',
                                        alt: movie.title
                                    })
                                )
                            ),
                            list.movies.length > 4 && React.createElement(
                                'div',
                                { className: 'list-movie-more' },
                                `+${list.movies.length - 4}`
                            )
                        )
                    )
                )
            )
        ),

        // Modal para crear lista
        showCreateListModal && React.createElement(
            'div',
            {
                className: 'modal-backdrop',
                onClick: () => setShowCreateListModal(false)
            },
            React.createElement(
                'div',
                {
                    className: 'modal-content',
                    onClick: (e) => e.stopPropagation()
                },
                React.createElement('h2', null, 'Crear Nueva Lista'),
                React.createElement(
                    'form',
                    { onSubmit: handleCreateList },
                    React.createElement('input', {
                        type: 'text',
                        placeholder: 'Nombre de la lista',
                        value: newListName,
                        onChange: (e) => setNewListName(e.target.value),
                        className: 'modal-input',
                        autoFocus: true
                    }),
                    React.createElement('textarea', {
                        placeholder: 'Descripción (opcional)',
                        value: newListDescription,
                        onChange: (e) => setNewListDescription(e.target.value),
                        className: 'modal-textarea',
                        rows: 3
                    }),
                    React.createElement(
                        'div',
                        { className: 'modal-actions' },
                        React.createElement(
                            'button',
                            {
                                type: 'button',
                                className: 'modal-button cancel',
                                onClick: () => setShowCreateListModal(false)
                            },
                            'Cancelar'
                        ),
                        React.createElement(
                            'button',
                            {
                                type: 'submit',
                                className: 'modal-button confirm'
                            },
                            'Crear'
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
