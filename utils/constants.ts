// App constants and configuration

// TMDB API Endpoints
export const TMDB_ENDPOINTS = {
  // Movies
  POPULAR_MOVIES: '/movie/popular',
  TOP_RATED_MOVIES: '/movie/top_rated',
  TRENDING_MOVIES: '/trending/movie/week',
  MOVIE_DETAILS: '/movie',
  MOVIE_VIDEOS: '/movie/{id}/videos',
  MOVIE_SIMILAR: '/movie/{id}/similar',
  MOVIE_WATCH_PROVIDERS: '/movie/{id}/watch_providers',

  // TV Shows
  POPULAR_TV: '/tv/popular',
  TOP_RATED_TV: '/tv/top_rated',
  TRENDING_TV: '/trending/tv/week',
  TV_DETAILS: '/tv',
  TV_VIDEOS: '/tv/{id}/videos',
  TV_SIMILAR: '/tv/{id}/similar',
  TV_WATCH_PROVIDERS: '/tv/{id}/watch_providers',

  // General
  GENRES_MOVIES: '/genre/movie/list',
  GENRES_TV: '/genre/tv/list',
  SEARCH_MULTI: '/search/multi',
} as const;

// Image sizes for TMDB
export const TMDB_IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w92',
    MEDIUM: 'w154',
    LARGE: 'w342',
    XLARGE: 'w500',
    ORIGINAL: 'original',
  },
  BACKDROP: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  // Video player settings
  AUTOPLAY_DELAY: 500, // ms
  PRELOAD_VIDEO_COUNT: 3,
  MAX_VIDEO_QUALITY: '720p',

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGES_TO_LOAD: 10,

  // Cache settings
  CACHE_DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours
  MAX_CACHE_SIZE_MB: 100,

  // UI settings
  ANIMATION_DURATION: 300, // ms
  DEBOUNCE_DELAY: 500, // ms for search input

  // Content filtering
  MIN_RATING: 0,
  MAX_ADULT_CONTENT: false,
} as const;

// Re-export Storage Keys from types
export { STORAGE_KEYS } from '../types/storage';

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'API error. Please try again later.',
  NOT_FOUND: 'Content not found.',
  INVALID_API_KEY: 'Invalid API key. Please check your configuration.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;

// Video types priority (for selecting best video)
export const VIDEO_TYPE_PRIORITY = {
  'Trailer': 1,
  'Teaser': 2,
  'Clip': 3,
  'Featurette': 4,
  'Behind the Scenes': 5,
  'Bloopers': 6,
} as const;

// Content type labels
export const CONTENT_TYPE_LABELS = {
  movie: 'Movie',
  tv: 'TV Series',
  both: 'All',
} as const;