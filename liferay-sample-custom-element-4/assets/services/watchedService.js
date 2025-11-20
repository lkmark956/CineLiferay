/* Servicio para gestionar películas vistas usando localStorage */

const WATCHED_KEY = 'cinehub_watched';

const watchedService = {
    // Obtener todas las películas vistas
    getWatched: () => {
        try {
            const watched = localStorage.getItem(WATCHED_KEY);
            return watched ? JSON.parse(watched) : [];
        } catch (error) {
            console.error('Error al obtener películas vistas:', error);
            return [];
        }
    },

    // Marcar una película como vista
    markAsWatched: (movie) => {
        try {
            const watched = watchedService.getWatched();
            const exists = watched.some(w => w.id === movie.id);
            
            if (!exists) {
                const newWatched = [...watched, {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date,
                    watchedAt: new Date().toISOString()
                }];
                localStorage.setItem(WATCHED_KEY, JSON.stringify(newWatched));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al marcar como vista:', error);
            return false;
        }
    },

    // Desmarcar una película como vista
    unmarkAsWatched: (movieId) => {
        try {
            const watched = watchedService.getWatched();
            const newWatched = watched.filter(w => w.id !== movieId);
            localStorage.setItem(WATCHED_KEY, JSON.stringify(newWatched));
            return true;
        } catch (error) {
            console.error('Error al desmarcar como vista:', error);
            return false;
        }
    },

    // Verificar si una película está marcada como vista
    isWatched: (movieId) => {
        const watched = watchedService.getWatched();
        return watched.some(w => w.id === movieId);
    },

    // Toggle vista
    toggleWatched: (movie) => {
        if (watchedService.isWatched(movie.id)) {
            watchedService.unmarkAsWatched(movie.id);
            return false;
        } else {
            watchedService.markAsWatched(movie);
            return true;
        }
    }
};

export default watchedService;
