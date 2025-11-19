/**
 * Configuración de TMDb API
 * 
 * API Key: Se usa como parámetro en la URL (?api_key=xxx)
 * Bearer Token: Se usa en el header Authorization (más seguro y recomendado)
 */

export const TMDB_CONFIG = {
    API_KEY: '249914836156769a8b05e0a33c274674',
    BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNDk5MTQ4MzYxNTY3NjlhOGIwNWUwYTMzYzI3NDY3NCIsIm5iZiI6MTc2Mjg5NTQ2NS4xOTM5OTk4LCJzdWIiOiI2OTEzYTY2OTRhOGU0ZmEwNDZhYTIxNjQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.svJPcWcy6EeFv0TWzq1-6HffSuZ7owjyUPNBFNLjmhY',
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500'
};
