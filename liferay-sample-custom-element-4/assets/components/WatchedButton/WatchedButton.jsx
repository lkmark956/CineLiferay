/* Componente botón de visto */

import React, { useState, useEffect } from 'react';
import watchedService from '../../services/watchedService.js';
import './WatchedButton.css';

export function WatchedButton({ movie, onToggle, showAsIcon = false }) {
    const [isWatched, setIsWatched] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsWatched(watchedService.isWatched(movie.id));
    }, [movie.id]);

    const handleClick = (e) => {
        e.stopPropagation();
        setIsAnimating(true);
        
        const newState = watchedService.toggleWatched(movie);
        setIsWatched(newState);
        
        if (onToggle) {
            onToggle(newState);
        }

        setTimeout(() => setIsAnimating(false), 600);
    };

    // Si showAsIcon es true y la película no está vista, no mostrar nada
    if (showAsIcon && !isWatched) {
        return null;
    }

    // Si showAsIcon es true, mostrar como badge removible
    if (showAsIcon) {
        return (
            <button
                className={`watched-badge-remove ${isAnimating ? 'animating' : ''}`}
                onClick={handleClick}
                title="Desmarcar como vista"
            >
                ✓
            </button>
        );
    }

    // Modo botón normal
    return (
        <button
            className={`watched-button ${isWatched ? 'is-watched' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleClick}
            title={isWatched ? 'Desmarcar como vista' : 'Marcar como vista'}
        >
            {isWatched ? '✓' : '○'}
        </button>
    );
}
