/**
 * Componente de barra de navegación lateral
 */

import React from 'react';

export function Sidebar({ currentView, onNavigate }) {
    const menuItems = [
        { id: 'home', label: 'Ventana Principal', icon: '▶' },
        { id: 'search', label: 'Buscar', icon: '⌕' },
        { id: 'explore', label: 'Explorar', icon: '◈' }
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
                        className: `sidebar-item ${currentView === item.id ? 'active' : ''}`,
                        onClick: () => onNavigate(item.id)
                    },
                    React.createElement('span', { className: 'sidebar-icon' }, item.icon),
                    React.createElement('span', { className: 'sidebar-label' }, item.label)
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
