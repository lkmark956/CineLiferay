/* Servicio para gestionar favoritos usando localStorage */

const FAVORITES_KEY = 'cinehub_favorites';

const favoritesService = {
    // Obtener todos los favoritos
    getFavorites: () => {
        try {
            const favorites = localStorage.getItem(FAVORITES_KEY);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error al obtener favoritos:', error);
            return [];
        }
    },

    // Agregar una película a favoritos
    addFavorite: (movie) => {
        try {
            const favorites = favoritesService.getFavorites();
            const exists = favorites.some(fav => fav.id === movie.id);
            
            if (!exists) {
                const newFavorites = [...favorites, {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date,
                    addedAt: new Date().toISOString()
                }];
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al agregar favorito:', error);
            return false;
        }
    },

    // Eliminar una película de favoritos
    removeFavorite: (movieId) => {
        try {
            const favorites = favoritesService.getFavorites();
            const newFavorites = favorites.filter(fav => fav.id !== movieId);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            return true;
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
            return false;
        }
    },

    // Verificar si una película está en favoritos
    isFavorite: (movieId) => {
        const favorites = favoritesService.getFavorites();
        return favorites.some(fav => fav.id === movieId);
    },

    // Toggle favorito (agregar o quitar)
    toggleFavorite: (movie) => {
        if (favoritesService.isFavorite(movie.id)) {
            favoritesService.removeFavorite(movie.id);
            return false;
        } else {
            favoritesService.addFavorite(movie);
            return true;
        }
    }
};

export default favoritesService;
