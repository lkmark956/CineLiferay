/* Componente de animación tipo ticker para dirección izquierda o derecha */

import React, { useEffect, useRef, useState } from 'react';
import './TickerAnimation.css';

export function TickerAnimation({ items = [], direction = 'left' }) {
    const [offset, setOffset] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        let startOffset = 0;
        if (direction === 'right') {
            // Para dirección derecha, empezar desde la izquierda (negativo)
            const itemWidth = 150;
            const totalWidth = itemWidth * items.length;
            startOffset = -totalWidth;
        }

        setOffset(startOffset);

        const speed = direction === 'left' ? -1 : 1;
        const interval = setInterval(() => {
            setOffset(prev => {
                const newOffset = prev + speed;
                const itemWidth = 150; // 130px card + 20px gap
                const totalWidth = itemWidth * items.length;
                
                // Reset para dirección izquierda (va de derecha a izquierda)
                if (direction === 'left' && Math.abs(newOffset) >= totalWidth) {
                    return 0;
                }
                // Reset para dirección derecha (va de izquierda a derecha)
                if (direction === 'right' && newOffset >= 0) {
                    return -totalWidth;
                }
                return newOffset;
            });
        }, 20);

        return () => clearInterval(interval);
    }, [items, direction]);

    // Sextuplicar items para bucle más largo y suave
    const displayItems = [...items, ...items, ...items, ...items, ...items, ...items];

    return (
        <div className="ticker-container" ref={containerRef}>
            <div 
                className="ticker-track"
                style={{ transform: `translateX(${offset}px)` }}
            >
                {displayItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="ticker-item">
                        <img 
                            src={item.poster_path 
                                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                : 'https://via.placeholder.com/200x300?text=No+Image'}
                            alt={item.title}
                            className="ticker-poster"
                        />
                        <div className="ticker-info">
                            <h4 className="ticker-title">{item.title}</h4>
                            <p className="ticker-rating">⭐ {item.vote_average.toFixed(1)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
