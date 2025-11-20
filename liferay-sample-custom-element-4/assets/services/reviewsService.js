/* Servicio para gestionar reseñas de películas, almacena las reseñas de usuarios en localStorage  */

const STORAGE_KEY = 'cinehub_reviews';

// Generar ID único para el usuario (se mantiene en localStorage)
const getUserId = () => {
    let userId = localStorage.getItem('cinehub_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cinehub_user_id', userId);
    }
    return userId;
};

const reviewsService = {
    /**
     * Obtener todas las reseñas
     */
    getAllReviews() {
        try {
            const reviews = localStorage.getItem(STORAGE_KEY);
            return reviews ? JSON.parse(reviews) : [];
        } catch (error) {
            console.error('Error al obtener reseñas:', error);
            return [];
        }
    },

    /**
     * Obtener reseñas de una película específica
     */
    getMovieReviews(movieId) {
        const allReviews = this.getAllReviews();
        return allReviews.filter(review => review.movieId === movieId);
    },

    /**
     * Obtener reseñas del usuario actual
     */
    getUserReviews() {
        const userId = getUserId();
        const allReviews = this.getAllReviews();
        return allReviews.filter(review => review.userId === userId);
    },

    /**
     * Añadir una nueva reseña
     */
    addReview(movieId, movieTitle, moviePoster, rating, text) {
        try {
            const reviews = this.getAllReviews();
            const userId = getUserId();
            
            // Verificar si el usuario ya reseñó esta película
            const existingIndex = reviews.findIndex(
                r => r.movieId === movieId && r.userId === userId
            );

            const newReview = {
                id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                movieId,
                movieTitle,
                moviePoster,
                userId,
                username: 'Usuario_' + userId.substr(-6),
                rating,
                text: text.trim(),
                date: new Date().toISOString(),
                likes: 0
            };

            if (existingIndex >= 0) {
                // Actualizar reseña existente
                reviews[existingIndex] = { ...reviews[existingIndex], ...newReview };
            } else {
                // Añadir nueva reseña
                reviews.push(newReview);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
            return newReview;
        } catch (error) {
            console.error('Error al añadir reseña:', error);
            return null;
        }
    },

    /**
     * Eliminar una reseña
     */
    deleteReview(reviewId) {
        try {
            const reviews = this.getAllReviews();
            const filtered = reviews.filter(review => review.id !== reviewId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error al eliminar reseña:', error);
            return false;
        }
    },

    /**
     * Verificar si el usuario ya reseñó una película
     */
    hasUserReviewed(movieId) {
        const userId = getUserId();
        const reviews = this.getAllReviews();
        return reviews.some(r => r.movieId === movieId && r.userId === userId);
    },

    /**
     * Obtener la reseña del usuario para una película
     */
    getUserMovieReview(movieId) {
        const userId = getUserId();
        const reviews = this.getAllReviews();
        return reviews.find(r => r.movieId === movieId && r.userId === userId);
    },

    /**
     * Dar like a una reseña
     */
    likeReview(reviewId) {
        try {
            const reviews = this.getAllReviews();
            const review = reviews.find(r => r.id === reviewId);
            if (review) {
                review.likes = (review.likes || 0) + 1;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
                return review.likes;
            }
            return 0;
        } catch (error) {
            console.error('Error al dar like:', error);
            return 0;
        }
    },

    /**
     * Obtener estadísticas de reseñas
     */
    getStats() {
        const reviews = this.getAllReviews();
        const userReviews = this.getUserReviews();
        
        return {
            totalReviews: reviews.length,
            userReviews: userReviews.length,
            averageRating: reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : 0
        };
    },

    /**
     * Obtener películas con más reseñas
     */
    getTopReviewedMovies(limit = 10) {
        const reviews = this.getAllReviews();
        const movieStats = {};

        // Agrupar reseñas por película
        reviews.forEach(review => {
            if (!movieStats[review.movieId]) {
                movieStats[review.movieId] = {
                    movieId: review.movieId,
                    movieTitle: review.movieTitle,
                    moviePoster: review.moviePoster,
                    reviewCount: 0,
                    totalRating: 0,
                    reviews: []
                };
            }
            movieStats[review.movieId].reviewCount++;
            movieStats[review.movieId].totalRating += review.rating;
            movieStats[review.movieId].reviews.push(review);
        });

        // Convertir a array y ordenar por número de reseñas
        return Object.values(movieStats)
            .sort((a, b) => b.reviewCount - a.reviewCount)
            .slice(0, limit)
            .map(stat => ({
                ...stat,
                averageRating: (stat.totalRating / stat.reviewCount).toFixed(1)
            }));
    }
};

export default reviewsService;
