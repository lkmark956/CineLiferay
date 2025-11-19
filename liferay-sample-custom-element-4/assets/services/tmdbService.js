/**
 * Servicio para interactuar con TMDb API
 * Usando Bearer Token (método recomendado)
 */

import { TMDB_CONFIG } from '../config/tmdb.config.js';

class TMDbService {
    constructor() {
        this.baseURL = TMDB_CONFIG.BASE_URL;
        this.token = TMDB_CONFIG.BEARER_TOKEN;
    }

    /**
     * Método genérico para hacer peticiones GET
     */
    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        
        // Agregar parámetros a la URL
        Object.keys(params).forEach(key => 
            url.searchParams.append(key, params[key])
        );

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en la petición a TMDb:', error);
            throw error;
        }
    }

    /**
     * Obtener películas populares
     */
    async getPopularMovies(page = 1) {
        return this.get('/movie/popular', {
            language: 'es-ES',
            page
        });
    }

    /**
     * Buscar películas
     */
    async searchMovies(query, page = 1) {
        return this.get('/search/movie', {
            query,
            language: 'es-ES',
            page
        });
    }

    /**
     * Obtener detalles de una película
     */
    async getMovieDetails(movieId) {
        return this.get(`/movie/${movieId}`, {
            language: 'es-ES'
        });
    }

    /**
     * Obtener películas por género
     */
    async getMoviesByGenre(genreId, page = 1) {
        return this.get('/discover/movie', {
            language: 'es-ES',
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page
        });
    }

    /**
     * Obtener videos/trailers de una película
     */
    async getMovieVideos(movieId) {
        return this.get(`/movie/${movieId}/videos`, {
            language: 'es-ES'
        });
    }

    /**
     * Obtener reseñas de una película desde TMDB
     */
    async getMovieReviews(movieId, page = 1) {
        return this.get(`/movie/${movieId}/reviews`, {
            language: 'en-US',
            page
        });
    }

    /**
     * Obtener películas con más reseñas (usando películas populares como proxy)
     */
    async getTopRatedMovies(page = 1) {
        return this.get('/movie/top_rated', {
            language: 'es-ES',
            page
        });
    }

    /**
     * Obtener créditos de una película (actores y equipo técnico)
     */
    async getMovieCredits(movieId) {
        return this.get(`/movie/${movieId}/credits`, {
            language: 'es-ES'
        });
    }

    /**
     * Obtener detalles de una persona (actor/director)
     */
    async getPersonDetails(personId) {
        return this.get(`/person/${personId}`, {
            language: 'es-ES'
        });
    }

    /**
     * Obtener filmografía de una persona
     */
    async getPersonMovieCredits(personId) {
        return this.get(`/person/${personId}/movie_credits`, {
            language: 'es-ES'
        });
    }
}

export default new TMDbService();
