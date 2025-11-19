/* Componente de barra de navegación lateral */

import React, { useState, useEffect } from 'react';
import favoritesService from '../services/favoritesService.js';
import watchedService from '../services/watchedService.js';
import listsService from '../services/listsService.js';

export function Sidebar({ currentView, onNavigate }) {
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [myMoviesCount, setMyMoviesCount] = useState(0);

    useEffect(() => {
        // Actualizar contadores
        const updateCounts = () => {
            setFavoritesCount(favoritesService.getFavorites().length);
            
            const watched = watchedService.getWatched().length;
            const lists = listsService.getLists();
            const listsMoviesCount = lists.reduce((total, list) => total + list.movies.length, 0);
            setMyMoviesCount(watched + listsMoviesCount);
        };

        updateCounts();

        // Actualizar cada segundo (para reflejar cambios en tiempo real)
        const interval = setInterval(updateCounts, 1000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        { id: 'home', label: 'Inicio', icon: '▶' },
        { id: 'search', label: 'Buscar', icon: '⌕' },
        { id: 'explore', label: 'Explorar', icon: '◈' },
        { id: 'favorites', label: 'Favoritos', icon: '♥', count: favoritesCount, divider: true },
        { id: 'my-movies', label: 'Mis Películas', icon: '☰', count: myMoviesCount },
        { id: 'top-reviews', label: 'Top Reseñas', icon: '★' }
    ];

    return React.createElement(
        'div',
        { className: 'sidebar' },
        React.createElement(
            'div',
            { className: 'sidebar-header' },
            React.createElement('h2', { className: 'sidebar-title' }, 
                React.createElement('span', { className: 'logo-icon' }, '▶'),
                ' CineHub'
            )
        ),
        React.createElement(
            'nav',
            { className: 'sidebar-nav' },
            menuItems.map(item =>
                React.createElement(
                    'button',
                    {
                        key: item.id,
                        className: `sidebar-item ${currentView === item.id ? 'active' : ''} ${item.divider ? 'divider' : ''}`,
                        onClick: () => onNavigate(item.id)
                    },
                    React.createElement('span', { className: 'sidebar-icon' }, item.icon),
                    React.createElement('span', { className: 'sidebar-label' }, item.label),
                    item.count !== undefined && item.count > 0 
                        ? React.createElement('span', { className: 'sidebar-badge' }, item.count)
                        : null
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'sidebar-footer' },
            React.createElement('p', { className: 'sidebar-credits' }, 'Powered by TMDb')
        )
    );
}
