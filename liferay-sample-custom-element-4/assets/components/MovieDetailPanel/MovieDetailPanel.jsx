/* Componente para mostrar el panel de detalles de una película */

import React, { useState, useEffect } from 'react';
import { TMDB_CONFIG } from '../../config/tmdb.config';
import tmdbService from '../../services/tmdbService';
import listsService from '../../services/listsService';
import reviewsService from '../../services/reviewsService';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { WatchedButton } from '../WatchedButton/WatchedButton';
import { PersonDetailPanel } from '../PersonDetailPanel/PersonDetailPanel';
import './MovieDetailPanel.css';

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
            // Cargar datos básicos inmediatamente
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

            // Cargar trailer inmediatamente (es rápido)
            loadTrailer();
            
            // Cargar créditos inmediatamente (necesario para la vista)
            loadCredits();
            
            // Cargar reseñas solo si el usuario las solicita
        }
    }, [movie]);

    const loadTrailer = async () => {
        try {
            const videos = await tmdbService.getMovieVideos(movie.id);
            console.log('Videos encontrados:', videos);
            const trailer = videos.results.find(video => 
                video.type === 'Trailer' && video.site === 'YouTube'
            );
            if (trailer) {
                console.log('Trailer key:', trailer.key);
                setTrailerKey(trailer.key);
            } else {
                console.log('No se encontró trailer para esta película');
            }
        } catch (error) {
            console.error('Error cargando tráiler:', error);
        }
    };

    const loadReviews = async () => {
        try {
            const tmdbData = await tmdbService.getMovieReviews(movie.id);
            setTmdbReviews(tmdbData.results.slice(0, 3));
            
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
                cast: creditsData.cast.slice(0, 6),
                crew: creditsData.crew.filter(person => person.job === 'Director')
            });
        } catch (error) {
            console.error('Error cargando créditos:', error);
        }
    };

    const handlePersonClick = (personId) => {
        setSelectedPersonId(personId);
    };

    const handlePersonMovieClick = async (movie) => {
        try {
            const details = await tmdbService.getMovieDetails(movie.id);
            setSelectedPersonId(null);
            onClose();
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('openMovieDetail', { detail: details }));
            }, 100);
        } catch (error) {
            console.error('Error cargando detalles de película:', error);
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

    const imageUrl = movie.poster_path 
        ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <div className="movie-detail-backdrop" onClick={handleBackdropClick}>
            <div className="movie-detail-panel">
                <button className="close-button" onClick={onClose}>✕</button>
                
                <div className="movie-detail-poster-section">
                    <img src={imageUrl} alt={movie.title} />
                </div>

                <div className="movie-detail-content">
                    <h2 className="detail-title">{movie.title}</h2>

                    <div className="detail-actions">
                        <FavoriteButton movie={movie} />
                        <WatchedButton movie={movie} />
                        {trailerKey && (
                            <button
                                className="action-button theater-button"
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank')}
                            >
                                🎬 Ver Tráiler
                            </button>
                        )}
                        <button className="action-button share-button" onClick={handleShare}>
                            📤 Compartir
                        </button>
                        <button
                            className="action-button lists-button"
                            onClick={() => setShowListsModal(true)}
                        >
                            + Añadir a Lista
                        </button>
                        <button
                            className="action-button review-button"
                            onClick={() => setShowReviewModal(true)}
                        >
                            {reviewsService.hasUserReviewed(movie.id) ? '✏️ Editar Reseña' : '✍️ Escribir Reseña'}
                        </button>
                    </div>

                    <div className="detail-rating">
                        <span className="rating-star">⭐</span>
                        <span className="rating-value">{movie.vote_average.toFixed(1)}</span>
                        <span className="rating-count">({movie.vote_count} votos)</span>
                    </div>

                    <div className="detail-meta">
                        <span className="meta-date">{movie.release_date}</span>
                        {movie.original_language && (
                            <span className="meta-language">{movie.original_language.toUpperCase()}</span>
                        )}
                    </div>

                    <div className="detail-overview">
                        <h3 className="overview-title">Sinopsis</h3>
                        <p className="overview-text">{movie.overview || 'No hay sinopsis disponible.'}</p>
                    </div>

                    {movie.popularity && (
                        <div className="detail-popularity">
                            <span>🔥 Popularidad: </span>
                            <strong>{Math.round(movie.popularity)}</strong>
                        </div>
                    )}

                    {credits.crew.length > 0 && (
                        <div className="credits-section">
                            <h3 className="credits-title">🎥 Dirección</h3>
                            <div className="director-list">
                                {credits.crew.map(director => (
                                    <div
                                        key={director.id}
                                        className="director-card"
                                        onClick={() => handlePersonClick(director.id)}
                                    >
                                        <img
                                            src={director.profile_path 
                                                ? `https://image.tmdb.org/t/p/w185${director.profile_path}`
                                                : 'https://via.placeholder.com/185x278?text=Sin+Foto'}
                                            alt={director.name}
                                            className="director-photo"
                                        />
                                        <div className="director-info">
                                            <p className="director-name">{director.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {credits.cast.length > 0 && (
                        <div className="credits-section">
                            <h3 className="credits-title">🎬 Reparto Principal</h3>
                            <div className="cast-grid">
                                {credits.cast.map(actor => (
                                    <div
                                        key={actor.id}
                                        className="cast-card"
                                        onClick={() => handlePersonClick(actor.id)}
                                    >
                                        <img
                                            src={actor.profile_path 
                                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                : 'https://via.placeholder.com/185x278?text=Sin+Foto'}
                                            alt={actor.name}
                                            className="cast-photo"
                                        />
                                        <div className="cast-info">
                                            <p className="cast-name">{actor.name}</p>
                                            <p className="cast-character">{actor.character}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="reviews-section">
                        <div className="reviews-header">
                            <h3>📝 Reseñas</h3>
                            <button
                                className="reviews-toggle"
                                onClick={() => {
                                    if (!showReviewsSection && tmdbReviews.length === 0) {
                                        loadReviews();
                                    }
                                    setShowReviewsSection(!showReviewsSection);
                                }}
                            >
                                {showReviewsSection ? '▼ Ocultar' : '▶ Ver reseñas'}
                            </button>
                        </div>
                        {showReviewsSection && (
                            <div className="reviews-content">
                                {userReviews.length > 0 && (
                                    <div className="user-reviews-section">
                                        <h4>👤 Reseñas de usuarios</h4>
                                        {userReviews.map(review => (
                                            <div key={review.id} className="review-card user-review">
                                                <div className="review-header">
                                                    <strong>{review.username}</strong>
                                                    <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                                                    {reviewsService.getUserMovieReview(movie.id)?.id === review.id && (
                                                        <button
                                                            className="review-delete"
                                                            onClick={() => handleDeleteReview(review.id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="review-text">{review.text}</p>
                                                <span className="review-date">
                                                    {new Date(review.date).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {tmdbReviews.length > 0 && (
                                    <div className="tmdb-reviews-section">
                                        <h4>🌐 Reseñas de TMDB</h4>
                                        {tmdbReviews.map((review, index) => (
                                            <div key={index} className="review-card tmdb-review">
                                                <div className="review-header">
                                                    <strong>{review.author}</strong>
                                                    {review.author_details?.rating && (
                                                        <span className="review-rating">
                                                            ⭐ {review.author_details.rating}/10
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="review-text">
                                                    {review.content.length > 300 
                                                        ? review.content.substring(0, 300) + '...'
                                                        : review.content}
                                                </p>
                                                <span className="review-date">
                                                    {new Date(review.created_at).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {userReviews.length === 0 && tmdbReviews.length === 0 && (
                                    <p className="no-reviews">
                                        No hay reseñas disponibles. ¡Sé el primero en escribir una!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Listas */}
            {showListsModal && (
                <div className="lists-modal-backdrop" onClick={() => setShowListsModal(false)}>
                    <div className="lists-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Añadir a lista</h3>
                        <button className="lists-modal-close" onClick={() => setShowListsModal(false)}>
                            ✕
                        </button>
                        {userLists.length === 0 ? (
                            <div className="lists-modal-empty">
                                <p>No tienes listas creadas</p>
                                <p>Ve a "Mis Películas" para crear una</p>
                            </div>
                        ) : (
                            <div className="lists-modal-list">
                                {userLists.map(list => {
                                    const isInList = listsService.isMovieInList(list.id, movie.id);
                                    return (
                                        <div key={list.id} className={`list-option ${isInList ? 'in-list' : ''}`}>
                                            <div className="list-option-info">
                                                <h4>{list.name}</h4>
                                                <span className="list-option-count">
                                                    {list.movies.length} película{list.movies.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <button
                                                className={`list-option-button ${isInList ? 'remove' : 'add'}`}
                                                onClick={() => isInList 
                                                    ? handleRemoveFromList(list.id) 
                                                    : handleAddToList(list.id)}
                                            >
                                                {isInList ? '✓ En lista' : '+ Añadir'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de Reseña */}
            {showReviewModal && (
                <div className="review-modal-backdrop" onClick={() => setShowReviewModal(false)}>
                    <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{reviewsService.hasUserReviewed(movie.id) ? 'Editar Reseña' : 'Escribir Reseña'}</h3>
                        <button className="review-modal-close" onClick={() => setShowReviewModal(false)}>
                            ✕
                        </button>
                        <form onSubmit={handleSubmitReview} className="review-form">
                            <div className="rating-selector">
                                <label>Tu valoración:</label>
                                <div className="stars-selector">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star ${star <= reviewRating ? 'active' : ''}`}
                                            onClick={() => setReviewRating(star)}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                placeholder="¿Qué te pareció esta película?"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="review-textarea"
                                rows={6}
                                required
                                minLength={10}
                            />
                            <div className="review-modal-actions">
                                <button
                                    type="button"
                                    className="modal-button cancel"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="modal-button confirm">
                                    Publicar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <PersonDetailPanel
                personId={selectedPersonId}
                onClose={() => setSelectedPersonId(null)}
                onMovieClick={handlePersonMovieClick}
            />
        </div>
    );
}
