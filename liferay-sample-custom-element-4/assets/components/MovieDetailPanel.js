/* Componente para mostrar el panel de detalles de una película */

import React, { useState, useEffect } from 'react';
import { TMDB_CONFIG } from '../config/tmdb.config.js';
import tmdbService from '../services/tmdbService.js';
import listsService from '../services/listsService.js';
import reviewsService from '../services/reviewsService.js';
import { PersonDetailPanel } from './PersonDetailPanel.js';

export function MovieDetailPanel({ movie, onClose }) {
    const [trailerKey, setTrailerKey] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [showListsModal, setShowListsModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [tmdbReviews, setTmdbReviews] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [showReviewsSection, setShowReviewsSection] = useState(false);
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [selectedPersonId, setSelectedPersonId] = useState(null);

    useEffect(() => {
        if (movie) {
            loadTrailer();
            loadReviews();
            loadCredits();
            setUserLists(listsService.getLists());
            
            // Cargar reseña del usuario si existe
            const userReview = reviewsService.getUserMovieReview(movie.id);
            if (userReview) {
                setReviewRating(userReview.rating);
                setReviewText(userReview.text);
            } else {
                setReviewRating(5);
                setReviewText('');
            }
        }
    }, [movie]);

    const loadTrailer = async () => {
        try {
            const videos = await tmdbService.getMovieVideos(movie.id);
            const trailer = videos.results.find(video => 
                video.type === 'Trailer' && video.site === 'YouTube'
            );
            if (trailer) {
                setTrailerKey(trailer.key);
            }
        } catch (error) {
            console.error('Error cargando tráiler:', error);
        }
    };

    const loadReviews = async () => {
        try {
            // Cargar reseñas de TMDB
            const tmdbData = await tmdbService.getMovieReviews(movie.id);
            setTmdbReviews(tmdbData.results.slice(0, 3)); // Solo primeras 3
            
            // Cargar reseñas de usuarios locales
            const localReviews = reviewsService.getMovieReviews(movie.id);
            setUserReviews(localReviews);
        } catch (error) {
            console.error('Error cargando reseñas:', error);
        }
    };

    const loadCredits = async () => {
        try {
            const creditsData = await tmdbService.getMovieCredits(movie.id);
            setCredits({
                cast: creditsData.cast.slice(0, 6), // Primeros 6 actores
                crew: creditsData.crew
            });
        } catch (error) {
            console.error('Error cargando créditos:', error);
        }
    };

    if (!movie) return null;

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('movie-detail-backdrop')) {
            onClose();
        }
    };

    const handleShare = () => {
        const url = `https://www.themoviedb.org/movie/${movie.id}`;
        const text = `¡Mira esta película! ${movie.title}`;
        
        if (navigator.share) {
            navigator.share({ title: movie.title, text: text, url: url })
                .catch(err => console.log('Error al compartir:', err));
        } else {
            navigator.clipboard.writeText(url);
            alert('¡Enlace copiado al portapapeles!');
        }
    };

    const handleAddToList = (listId) => {
        listsService.addMovieToList(listId, movie);
        setUserLists(listsService.getLists());
        alert('Película añadida a la lista');
    };

    const handleRemoveFromList = (listId) => {
        listsService.removeMovieFromList(listId, movie.id);
        setUserLists(listsService.getLists());
        alert('Película eliminada de la lista');
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (reviewText.trim()) {
            reviewsService.addReview(
                movie.id,
                movie.title,
                movie.poster_path,
                reviewRating,
                reviewText
            );
            setShowReviewModal(false);
            loadReviews();
            alert('¡Reseña publicada!');
        }
    };

    const handleDeleteReview = (reviewId) => {
        if (confirm('¿Eliminar tu reseña?')) {
            reviewsService.deleteReview(reviewId);
            loadReviews();
            setReviewText('');
            setReviewRating(5);
        }
    };

    const handlePersonClick = (personId) => {
        setSelectedPersonId(personId);
    };

    const handlePersonMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            setSelectedPersonId(null); // Cerrar panel de persona
            // Forzar recarga del componente con la nueva película
            onClose();
            setTimeout(() => {
                // Esto reabrirá el panel con la nueva película
                window.dispatchEvent(new CustomEvent('openMovieDetail', { detail: details }));
            }, 100);
        } catch (error) {
            console.error('Error cargando detalles de película:', error);
        }
    };

    const imageUrl = movie.poster_path 
        ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return React.createElement(
        'div',
        { 
            className: 'movie-detail-backdrop',
            onClick: handleBackdropClick
        },
        React.createElement(
            'div',
            { className: 'movie-detail-panel' },
            React.createElement(
                'button',
                {
                    className: 'close-button',
                    onClick: onClose
                },
                '✕'
            ),
            React.createElement(
                'div',
                { className: 'movie-detail-poster-section' },
                React.createElement('img', {
                    src: imageUrl,
                    alt: movie.title
                })
            ),
            React.createElement(
                'div',
                { className: 'movie-detail-content' },
                React.createElement('h2', { className: 'detail-title' }, movie.title),
                React.createElement(
                    'div',
                    { className: 'detail-actions' },
                    trailerKey && React.createElement(
                        'button',
                        {
                            className: 'action-button theater-button',
                            onClick: () => setShowTrailer(!showTrailer)
                        },
                        React.createElement('span', null, showTrailer ? '📽️ Cerrar Tráiler' : '🎬 Ver Tráiler')
                    ),
                    React.createElement(
                        'button',
                        {
                            className: 'action-button share-button',
                            onClick: handleShare
                        },
                        React.createElement('span', null, '📤 Compartir')
                    ),
                    React.createElement(
                        'button',
                        {
                            className: 'action-button lists-button',
                            onClick: () => setShowListsModal(true)
                        },
                        React.createElement('span', null, '+ Añadir a Lista')
                    ),
                    React.createElement(
                        'button',
                        {
                            className: 'action-button review-button',
                            onClick: () => setShowReviewModal(true)
                        },
                        React.createElement('span', null, reviewsService.hasUserReviewed(movie.id) ? '✏️ Editar Reseña' : '✍️ Escribir Reseña')
                    )
                ),
                showTrailer && trailerKey && React.createElement(
                    'div',
                    { className: 'trailer-container' },
                    React.createElement('iframe', {
                        width: '100%',
                        height: '315',
                        src: `https://www.youtube.com/embed/${trailerKey}`,
                        title: 'YouTube video player',
                        frameBorder: '0',
                        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                        allowFullScreen: true
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'detail-rating' },
                    React.createElement('span', { className: 'rating-star' }, '⭐'),
                    React.createElement('span', { className: 'rating-value' }, movie.vote_average.toFixed(1)),
                    React.createElement('span', { className: 'rating-count' }, `(${movie.vote_count} votos)`)
                ),
                React.createElement(
                    'div',
                    { className: 'detail-meta' },
                    React.createElement('span', { className: 'meta-date' }, movie.release_date),
                    movie.original_language && React.createElement(
                        'span',
                        { className: 'meta-language' },
                        movie.original_language.toUpperCase()
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'detail-overview' },
                    React.createElement('h3', { className: 'overview-title' }, 'Sinopsis'),
                    React.createElement('p', { className: 'overview-text' }, movie.overview || 'No hay sinopsis disponible.')
                ),
                movie.popularity && React.createElement(
                    'div',
                    { className: 'detail-popularity' },
                    React.createElement('span', null, '🔥 Popularidad: '),
                    React.createElement('strong', null, Math.round(movie.popularity))
                ),
                credits.cast.length > 0 && React.createElement(
                    'div',
                    { className: 'credits-section' },
                    React.createElement('h3', { className: 'credits-title' }, '🎬 Reparto Principal'),
                    React.createElement(
                        'div',
                        { className: 'cast-grid' },
                        credits.cast.map(actor =>
                            React.createElement(
                                'div',
                                { 
                                    key: actor.id, 
                                    className: 'cast-card',
                                    onClick: () => handlePersonClick(actor.id)
                                },
                                React.createElement('img', {
                                    src: actor.profile_path 
                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                        : 'https://via.placeholder.com/185x278?text=Sin+Foto',
                                    alt: actor.name,
                                    className: 'cast-photo'
                                }),
                                React.createElement(
                                    'div',
                                    { className: 'cast-info' },
                                    React.createElement('p', { className: 'cast-name' }, actor.name),
                                    React.createElement('p', { className: 'cast-character' }, actor.character)
                                )
                            )
                        )
                    )
                ),
                credits.crew.filter(person => person.job === 'Director').length > 0 && React.createElement(
                    'div',
                    { className: 'credits-section' },
                    React.createElement('h3', { className: 'credits-title' }, '🎥 Dirección'),
                    React.createElement(
                        'div',
                        { className: 'director-list' },
                        credits.crew
                            .filter(person => person.job === 'Director')
                            .map(director =>
                                React.createElement(
                                    'div',
                                    { 
                                        key: director.id, 
                                        className: 'director-card',
                                        onClick: () => handlePersonClick(director.id)
                                    },
                                    React.createElement('img', {
                                        src: director.profile_path 
                                            ? `https://image.tmdb.org/t/p/w185${director.profile_path}`
                                            : 'https://via.placeholder.com/185x278?text=Sin+Foto',
                                        alt: director.name,
                                        className: 'director-photo'
                                    }),
                                    React.createElement(
                                        'div',
                                        { className: 'director-info' },
                                        React.createElement('p', { className: 'director-name' }, director.name)
                                    )
                                )
                            )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'reviews-section' },
                    React.createElement(
                        'div',
                        { className: 'reviews-header' },
                        React.createElement('h3', null, '📝 Reseñas'),
                        React.createElement(
                            'button',
                            {
                                className: 'reviews-toggle',
                                onClick: () => setShowReviewsSection(!showReviewsSection)
                            },
                            showReviewsSection ? '▼ Ocultar' : '▶ Ver reseñas'
                        )
                    ),
                    showReviewsSection && React.createElement(
                        'div',
                        { className: 'reviews-content' },
                        userReviews.length > 0 && React.createElement(
                            'div',
                            { className: 'user-reviews-section' },
                            React.createElement('h4', null, '👤 Reseñas de usuarios'),
                            userReviews.map(review =>
                                React.createElement(
                                    'div',
                                    { key: review.id, className: 'review-card user-review' },
                                    React.createElement(
                                        'div',
                                        { className: 'review-header' },
                                        React.createElement('strong', null, review.username),
                                        React.createElement('span', { className: 'review-rating' }, '⭐'.repeat(review.rating)),
                                        reviewsService.getUserMovieReview(movie.id)?.id === review.id && React.createElement(
                                            'button',
                                            {
                                                className: 'review-delete',
                                                onClick: () => handleDeleteReview(review.id)
                                            },
                                            '🗑️'
                                        )
                                    ),
                                    React.createElement('p', { className: 'review-text' }, review.text),
                                    React.createElement('span', { className: 'review-date' }, 
                                        new Date(review.date).toLocaleDateString('es-ES')
                                    )
                                )
                            )
                        ),
                        tmdbReviews.length > 0 && React.createElement(
                            'div',
                            { className: 'tmdb-reviews-section' },
                            React.createElement('h4', null, '🌐 Reseñas de TMDB'),
                            tmdbReviews.map((review, index) =>
                                React.createElement(
                                    'div',
                                    { key: index, className: 'review-card tmdb-review' },
                                    React.createElement(
                                        'div',
                                        { className: 'review-header' },
                                        React.createElement('strong', null, review.author),
                                        review.author_details?.rating && React.createElement(
                                            'span',
                                            { className: 'review-rating' },
                                            `⭐ ${review.author_details.rating}/10`
                                        )
                                    ),
                                    React.createElement('p', { className: 'review-text' }, 
                                        review.content.length > 300 
                                            ? review.content.substring(0, 300) + '...'
                                            : review.content
                                    ),
                                    React.createElement('span', { className: 'review-date' }, 
                                        new Date(review.created_at).toLocaleDateString('es-ES')
                                    )
                                )
                            )
                        ),
                        userReviews.length === 0 && tmdbReviews.length === 0 && React.createElement(
                            'p',
                            { className: 'no-reviews' },
                            'No hay reseñas disponibles. ¡Sé el primero en escribir una!'
                        )
                    )
                )
            )
        ),
        showListsModal && React.createElement(
            'div',
            {
                className: 'lists-modal-backdrop',
                onClick: () => setShowListsModal(false)
            },
            React.createElement(
                'div',
                {
                    className: 'lists-modal-content',
                    onClick: (e) => e.stopPropagation()
                },
                React.createElement('h3', null, 'Añadir a lista'),
                React.createElement(
                    'button',
                    {
                        className: 'lists-modal-close',
                        onClick: () => setShowListsModal(false)
                    },
                    '✕'
                ),
                userLists.length === 0 ? React.createElement(
                    'div',
                    { className: 'lists-modal-empty' },
                    React.createElement('p', null, 'No tienes listas creadas'),
                    React.createElement('p', null, 'Ve a "Mis Películas" para crear una')
                ) : React.createElement(
                    'div',
                    { className: 'lists-modal-list' },
                    userLists.map(list => {
                        const isInList = listsService.isMovieInList(list.id, movie.id);
                        return React.createElement(
                            'div',
                            {
                                key: list.id,
                                className: `list-option ${isInList ? 'in-list' : ''}`
                            },
                            React.createElement(
                                'div',
                                { className: 'list-option-info' },
                                React.createElement('h4', null, list.name),
                                React.createElement('span', { className: 'list-option-count' }, 
                                    `${list.movies.length} película${list.movies.length !== 1 ? 's' : ''}`
                                )
                            ),
                            React.createElement(
                                'button',
                                {
                                    className: `list-option-button ${isInList ? 'remove' : 'add'}`,
                                    onClick: () => isInList 
                                        ? handleRemoveFromList(list.id) 
                                        : handleAddToList(list.id)
                                },
                                isInList ? '✓ En lista' : '+ Añadir'
                            )
                        );
                    })
                )
            )
        ),
        showReviewModal && React.createElement(
            'div',
            {
                className: 'review-modal-backdrop',
                onClick: () => setShowReviewModal(false)
            },
            React.createElement(
                'div',
                {
                    className: 'review-modal-content',
                    onClick: (e) => e.stopPropagation()
                },
                React.createElement('h3', null, reviewsService.hasUserReviewed(movie.id) ? 'Editar Reseña' : 'Escribir Reseña'),
                React.createElement(
                    'button',
                    {
                        className: 'review-modal-close',
                        onClick: () => setShowReviewModal(false)
                    },
                    '✕'
                ),
                React.createElement(
                    'form',
                    { onSubmit: handleSubmitReview, className: 'review-form' },
                    React.createElement(
                        'div',
                        { className: 'rating-selector' },
                        React.createElement('label', null, 'Tu valoración:'),
                        React.createElement(
                            'div',
                            { className: 'stars-selector' },
                            [1, 2, 3, 4, 5].map(star =>
                                React.createElement(
                                    'button',
                                    {
                                        key: star,
                                        type: 'button',
                                        className: `star ${star <= reviewRating ? 'active' : ''}`,
                                        onClick: () => setReviewRating(star)
                                    },
                                    '⭐'
                                )
                            )
                        )
                    ),
                    React.createElement('textarea', {
                        placeholder: '¿Qué te pareció esta película?',
                        value: reviewText,
                        onChange: (e) => setReviewText(e.target.value),
                        className: 'review-textarea',
                        rows: 6,
                        required: true,
                        minLength: 10
                    }),
                    React.createElement(
                        'div',
                        { className: 'review-modal-actions' },
                        React.createElement(
                            'button',
                            {
                                type: 'button',
                                className: 'modal-button cancel',
                                onClick: () => setShowReviewModal(false)
                            },
                            'Cancelar'
                        ),
                        React.createElement(
                            'button',
                            {
                                type: 'submit',
                                className: 'modal-button confirm'
                            },
                            'Publicar'
                        )
                    )
                )
            )
        ),
        React.createElement(PersonDetailPanel, {
            personId: selectedPersonId,
            onClose: () => setSelectedPersonId(null),
            onMovieClick: handlePersonMovieClick
        })
    );
}
