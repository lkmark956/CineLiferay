/* Componente de loading cinematográfico */

import React from 'react';
import './CinematicLoader.css';

export function CinematicLoader({ message = 'Cargando...' }) {
    return (
        <div className="cinematic-loader-container">
            <div className="film-reel">
                <div className="reel-circle left-reel">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="reel-hole"></div>
                    ))}
                </div>
                <div className="film-strip">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="film-frame"></div>
                    ))}
                </div>
                <div className="reel-circle right-reel">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="reel-hole"></div>
                    ))}
                </div>
            </div>
            <p className="loader-message">{message}</p>
            <div className="countdown-bars">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="countdown-bar"></div>
                ))}
            </div>
        </div>
    );
}
