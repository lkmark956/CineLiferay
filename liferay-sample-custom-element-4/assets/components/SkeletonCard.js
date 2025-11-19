/* Componente Skeleton Loader para tarjetas de películas */

import React from 'react';

export function SkeletonCard() {
    return React.createElement(
        'div',
        { className: 'skeleton-card' },
        React.createElement('div', { className: 'skeleton-poster' }),
        React.createElement(
            'div',
            { className: 'skeleton-info' },
            React.createElement('div', { className: 'skeleton-title' }),
            React.createElement('div', { className: 'skeleton-rating' }),
            React.createElement('div', { className: 'skeleton-date' })
        )
    );
}

export function SkeletonGrid({ count = 10 }) {
    return React.createElement(
        'div',
        { className: 'movies-grid' },
        Array.from({ length: count }).map((_, index) =>
            React.createElement(SkeletonCard, { key: `skeleton-${index}` })
        )
    );
}

export function SkeletonHorizontal({ count = 5 }) {
    return React.createElement(
        'div',
        { className: 'top-movies-horizontal' },
        Array.from({ length: count }).map((_, index) =>
            React.createElement(
                'div',
                { key: `skeleton-h-${index}`, className: 'skeleton-card-horizontal' },
                React.createElement('div', { className: 'skeleton-poster-horizontal' })
            )
        )
    );
}
