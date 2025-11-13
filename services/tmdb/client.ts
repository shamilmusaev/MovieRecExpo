// TMDB API Client
// TODO: Implement TMDB API integration

import axios from 'axios';
import { TMDBMovieDetails, TMDBPaginatedResponse, TMDBMovie, TMDBTVShow, TMDBGenre, TMDBVideo } from '../../types';
import { EXPO_PUBLIC_TMDB_API_KEY, EXPO_PUBLIC_TMDB_BASE_URL, EXPO_PUBLIC_TMDB_IMAGE_BASE_URL } from '@env';

class TMDBClient {
  private apiKey: string;
  private baseURL: string;
  private imageBaseURL: string;

  constructor() {
    this.apiKey = EXPO_PUBLIC_TMDB_API_KEY || '';
    this.baseURL = EXPO_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
    this.imageBaseURL = EXPO_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

    if (!this.apiKey) {
      throw new Error('TMDB API key is required. Please set EXPO_PUBLIC_TMDB_API_KEY in your .env file.');
    }

    // Configure axios defaults
    axios.defaults.baseURL = this.baseURL;
    axios.defaults.params = {
      api_key: this.apiKey,
    };
  }

  // TODO: Implement API methods
  // - getPopularMovies()
  // - getTVShows()
  // - getMovieDetails()
  // - getVideos()
  // - getSimilarMovies()
  // - getGenres()

  getImageUrl(path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '';
    return `${this.imageBaseURL}/${size}${path}`;
  }
}

export const tmdbClient = new TMDBClient();