/* Componente de loading cinematográfico */

import React from 'react';

export function CinematicLoader({ message = 'Cargando...' }) {
    return React.createElement(
        'div',
        { className: 'cinematic-loader-container' },
        React.createElement(
            'div',
            { className: 'film-reel' },
            React.createElement('div', { className: 'reel-circle left-reel' },
                Array.from({ length: 8 }).map((_, i) =>
                    React.createElement('div', { key: i, className: 'reel-hole' })
                )
            ),
            React.createElement('div', { className: 'film-strip' },
                Array.from({ length: 5 }).map((_, i) =>
                    React.createElement('div', { key: i, className: 'film-frame' })
                )
            ),
            React.createElement('div', { className: 'reel-circle right-reel' },
                Array.from({ length: 8 }).map((_, i) =>
                    React.createElement('div', { key: i, className: 'reel-hole' })
                )
            )
        ),
        React.createElement('p', { className: 'loader-message' }, message),
        React.createElement(
            'div',
            { className: 'countdown-bars' },
            Array.from({ length: 3 }).map((_, i) =>
                React.createElement('div', { key: i, className: 'countdown-bar' })
            )
        )
    );
}
