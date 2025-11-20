/* Servicio para gestionar listas personalizadas de películas */

const LISTS_KEY = 'cinehub_lists';

const listsService = {
    // Obtener todas las listas
    getLists: () => {
        try {
            const lists = localStorage.getItem(LISTS_KEY);
            return lists ? JSON.parse(lists) : [];
        } catch (error) {
            console.error('Error al obtener listas:', error);
            return [];
        }
    },

    // Crear una nueva lista
    createList: (name, description = '') => {
        try {
            const lists = listsService.getLists();
            const newList = {
                id: Date.now(),
                name: name.trim(),
                description: description.trim(),
                movies: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const updatedLists = [...lists, newList];
            localStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
            return newList;
        } catch (error) {
            console.error('Error al crear lista:', error);
            return null;
        }
    },

    // Eliminar una lista
    deleteList: (listId) => {
        try {
            const lists = listsService.getLists();
            const updatedLists = lists.filter(list => list.id !== listId);
            localStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
            return true;
        } catch (error) {
            console.error('Error al eliminar lista:', error);
            return false;
        }
    },

    // Actualizar nombre/descripción de una lista
    updateList: (listId, updates) => {
        try {
            const lists = listsService.getLists();
            const updatedLists = lists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };
                }
                return list;
            });
            localStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
            return true;
        } catch (error) {
            console.error('Error al actualizar lista:', error);
            return false;
        }
    },

    // Agregar película a una lista
    addMovieToList: (listId, movie) => {
        try {
            const lists = listsService.getLists();
            const updatedLists = lists.map(list => {
                if (list.id === listId) {
                    const exists = list.movies.some(m => m.id === movie.id);
                    if (!exists) {
                        return {
                            ...list,
                            movies: [...list.movies, {
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path,
                                vote_average: movie.vote_average,
                                release_date: movie.release_date,
                                addedAt: new Date().toISOString()
                            }],
                            updatedAt: new Date().toISOString()
                        };
                    }
                }
                return list;
            });
            localStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
            return true;
        } catch (error) {
            console.error('Error al agregar película a lista:', error);
            return false;
        }
    },

    // Eliminar película de una lista
    removeMovieFromList: (listId, movieId) => {
        try {
            const lists = listsService.getLists();
            const updatedLists = lists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        movies: list.movies.filter(m => m.id !== movieId),
                        updatedAt: new Date().toISOString()
                    };
                }
                return list;
            });
            localStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
            return true;
        } catch (error) {
            console.error('Error al eliminar película de lista:', error);
            return false;
        }
    },

    // Obtener una lista específica
    getList: (listId) => {
        const lists = listsService.getLists();
        return lists.find(list => list.id === listId);
    },

    // Verificar si una película está en alguna lista
    isMovieInList: (listId, movieId) => {
        const list = listsService.getList(listId);
        return list ? list.movies.some(m => m.id === movieId) : false;
    }
};

export default listsService;
