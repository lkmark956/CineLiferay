/* Componente botón de favoritos */

import React, { useState, useEffect } from 'react';
import favoritesService from '../services/favoritesService.js';

export function FavoriteButton({ movie, onToggle }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsFavorite(favoritesService.isFavorite(movie.id));
    }, [movie.id]);

    const handleClick = (e) => {
        e.stopPropagation();
        setIsAnimating(true);
        
        const newState = favoritesService.toggleFavorite(movie);
        setIsFavorite(newState);
        
        if (onToggle) {
            onToggle(newState);
        }

        setTimeout(() => setIsAnimating(false), 600);
    };

    return React.createElement(
        'button',
        {
            className: `favorite-button ${isFavorite ? 'is-favorite' : ''} ${isAnimating ? 'animating' : ''}`,
            onClick: handleClick,
            'aria-label': isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
        },
        isFavorite ? '❤️' : '🤍'
    );
}
