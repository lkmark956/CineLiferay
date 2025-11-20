/* Componente Skeleton Loader para tarjetas de películas */

import React from 'react';
import './SkeletonCard.css';

export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-poster"></div>
            <div className="skeleton-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-rating"></div>
                <div className="skeleton-date"></div>
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 10 }) {
    return (
        <div className="movies-grid">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
            ))}
        </div>
    );
}

export function SkeletonHorizontal({ count = 5 }) {
    return (
        <div className="top-movies-horizontal">
            {Array.from({ length: count }).map((_, index) => (
                <div key={`skeleton-h-${index}`} className="skeleton-card-horizontal">
                    <div className="skeleton-poster-horizontal"></div>
                </div>
            ))}
        </div>
    );
}
