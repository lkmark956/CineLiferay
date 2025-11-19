/* Componente de partículas flotantes (estrellitas del fondo del inicio) */

import React, { useMemo } from 'react';

export function FloatingParticles({ count = 20, type = 'stars' }) {
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 10 + 15,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.3
        }));
    }, [count]);

    const getParticleContent = () => {
        switch (type) {
            case 'stars':
                return '⭐';
            case 'sparkles':
                return '✨';
            case 'circles':
                return '●';
            default:
                return '⭐';
        }
    };

    return React.createElement(
        'div',
        { className: 'floating-particles-container' },
        particles.map(particle =>
            React.createElement(
                'div',
                {
                    key: particle.id,
                    className: 'floating-particle',
                    style: {
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        fontSize: `${particle.size}px`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                        opacity: particle.opacity
                    }
                },
                getParticleContent()
            )
        )
    );
}
