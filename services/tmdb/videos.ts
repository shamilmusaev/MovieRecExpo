// TMDB Video Service
// Fetches movies/TV shows with their associated trailer videos

import axios from 'axios';
import { tmdbClient } from './client';
import { VideoItem, ContentType } from '../../types';
import { TMDBMovie, TMDBTVShow, TMDBGenre, TMDBVideo, TMDBPaginatedResponse } from '../../types';
import {
  validateTMDBMovie,
  validateTMDBTVShow,
  validateTMDBGenre,
  validateTMDBVideo,
  validateVideoItem,
  safeLog
} from '../../utils/validation';

class TMDBVideoService {
  private genreCache: Map<ContentType, TMDBGenre[]> = new Map();

  /**
   * Get trending movies with YouTube trailer keys
   */
  async getTrendingMovies(page: number = 1, genreId?: number): Promise<VideoItem[]> {
    try {
      // Fetch trending movies
      const response = await axios.get<TMDBPaginatedResponse<TMDBMovie>>('/trending/movie/week', {
        params: {
          page,
          with_genres: genreId,
        },
      });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.results)) {
        throw new Error('Invalid API response structure for trending movies');
      }

      const movies = response.data.results.filter(movie => {
        const validation = validateTMDBMovie(movie);
        if (!validation.isValid) {
          safeLog('warn', 'Skipping invalid movie data', {
            movieId: movie.id,
            title: movie.title,
            errors: validation.errors
          });
          return false;
        }
        return true;
      });

      // Fetch genres if not cached
      if (!this.genreCache.has(ContentType.MOVIE)) {
        await this.fetchGenres(ContentType.MOVIE);
      }
      const genres = this.genreCache.get(ContentType.MOVIE) || [];

      // Transform movies to VideoItem format and fetch trailer for each
      const videoItems: VideoItem[] = [];

      for (const movie of movies) {
        const trailerKey = await this.getVideoTrailer(movie.id, ContentType.MOVIE);

        const videoItem: VideoItem = {
          id: movie.id,
          title: movie.title,
          description: movie.overview,
          posterUrl: movie.poster_path ? tmdbClient.getImageUrl(movie.poster_path) : undefined,
          backdropUrl: movie.backdrop_path ? tmdbClient.getImageUrl(movie.backdrop_path, 'w780') : undefined,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          voteCount: movie.vote_count,
          popularity: movie.popularity,
          isAdult: movie.adult,
          originalLanguage: movie.original_language,
          originalTitle: movie.original_title,
          genreIds: movie.genre_ids,
          genres: genres.filter(genre => movie.genre_ids.includes(genre.id)),
          contentType: ContentType.MOVIE,
          videoKey: trailerKey,
          videoType: trailerKey ? 'youtube' : 'direct', // We're using YouTube videos
          videoUrl: undefined, // Not using direct URLs for YouTube
        };

        videoItems.push(videoItem);
      }

      return videoItems;
    } catch (error) {
      safeLog('error', 'Error fetching trending movies', error);
      throw new Error('Failed to fetch trending movies');
    }
  }

  /**
   * Get popular TV shows with YouTube trailer keys
   */
  async getPopularTVShows(page: number = 1, genreId?: number): Promise<VideoItem[]> {
    try {
      // Fetch popular TV shows
      const response = await axios.get<TMDBPaginatedResponse<TMDBTVShow>>('/tv/popular', {
        params: {
          page,
          with_genres: genreId,
        },
      });

      const shows = response.data.results;

      // Fetch genres if not cached
      if (!this.genreCache.has(ContentType.TV)) {
        await this.fetchGenres(ContentType.TV);
      }
      const genres = this.genreCache.get(ContentType.TV) || [];

      // Transform TV shows to VideoItem format and fetch trailer for each
      const videoItems: VideoItem[] = [];

      for (const show of shows) {
        const trailerKey = await this.getVideoTrailer(show.id, ContentType.TV);

        const videoItem: VideoItem = {
          id: show.id,
          title: show.name,
          description: show.overview,
          posterUrl: show.poster_path ? tmdbClient.getImageUrl(show.poster_path) : undefined,
          backdropUrl: show.backdrop_path ? tmdbClient.getImageUrl(show.backdrop_path, 'w780') : undefined,
          releaseDate: show.first_air_date,
          rating: show.vote_average,
          voteCount: show.vote_count,
          popularity: show.popularity,
          isAdult: show.adult,
          originalLanguage: show.original_language,
          originalTitle: show.original_name,
          genreIds: show.genre_ids,
          genres: genres.filter(genre => show.genre_ids.includes(genre.id)),
          contentType: ContentType.TV,
          videoKey: trailerKey,
          videoType: trailerKey ? 'youtube' : 'direct',
          videoUrl: undefined,
        };

        videoItems.push(videoItem);
      }

      return videoItems;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw new Error('Failed to fetch popular TV shows');
    }
  }

  /**
   * Get anime content (TV shows with animation genre from Japan)
   */
  async getAnimeContent(page: number = 1, genreId?: number): Promise<VideoItem[]> {
    try {
      // Anime is typically TV shows with animation genre (16) from Japan
      // We'll filter for Japanese animation content
      const response = await axios.get<TMDBPaginatedResponse<TMDBTVShow>>('/discover/tv', {
        params: {
          page,
          with_genres: genreId || 16, // Animation genre ID
          with_original_language: 'ja', // Japanese content
          sort_by: 'popularity.desc',
        },
      });

      const shows = response.data.results;

      // Fetch genres if not cached
      if (!this.genreCache.has(ContentType.TV)) {
        await this.fetchGenres(ContentType.TV);
      }
      const genres = this.genreCache.get(ContentType.TV) || [];

      // Transform to VideoItem format and fetch trailers
      const videoItems: VideoItem[] = [];

      for (const show of shows) {
        const trailerKey = await this.getVideoTrailer(show.id, ContentType.TV);

        const videoItem: VideoItem = {
          id: show.id,
          title: show.name,
          description: show.overview,
          posterUrl: show.poster_path ? tmdbClient.getImageUrl(show.poster_path) : undefined,
          backdropUrl: show.backdrop_path ? tmdbClient.getImageUrl(show.backdrop_path, 'w780') : undefined,
          releaseDate: show.first_air_date,
          rating: show.vote_average,
          voteCount: show.vote_count,
          popularity: show.popularity,
          isAdult: show.adult,
          originalLanguage: show.original_language,
          originalTitle: show.original_name,
          genreIds: show.genre_ids,
          genres: genres.filter(genre => show.genre_ids.includes(genre.id)),
          contentType: ContentType.ANIME,
          videoKey: trailerKey,
          videoType: trailerKey ? 'youtube' : 'direct',
          videoUrl: undefined,
        };

        videoItems.push(videoItem);
      }

      return videoItems;
    } catch (error) {
      console.error('Error fetching anime content:', error);
      throw new Error('Failed to fetch anime content');
    }
  }

  /**
   * Get YouTube trailer key for a specific movie or TV show
   */
  async getVideoTrailer(contentId: number, contentType: ContentType): Promise<string | undefined> {
    try {
      const endpoint = contentType === ContentType.MOVIE ? `/movie/${contentId}/videos` : `/tv/${contentId}/videos`;

      const response = await axios.get<TMDBPaginatedResponse<TMDBVideo>>(endpoint);
      const videos = response.data.results;

      // Prioritize official trailers, then teasers
      const trailer = videos.find(video =>
        (video.type === 'Trailer' || video.type === 'Teaser') &&
        video.site === 'YouTube' &&
        video.official
      ) || videos.find(video =>
        (video.type === 'Trailer' || video.type === 'Teaser') &&
        video.site === 'YouTube'
      );

      return trailer?.key;
    } catch (error) {
      console.error(`Error fetching trailer for ${contentType} ${contentId}:`, error);
      return undefined;
    }
  }

  /**
   * Fetch and cache genres for a content type
   */
  private async fetchGenres(contentType: ContentType): Promise<void> {
    try {
      const endpoint = contentType === ContentType.MOVIE ? '/genre/movie/list' : '/genre/tv/list';

      const response = await axios.get<{ genres: TMDBGenre[] }>(endpoint);
      this.genreCache.set(contentType, response.data.genres);
    } catch (error) {
      console.error(`Error fetching ${contentType} genres:`, error);
      // Set empty array to prevent repeated failed requests
      this.genreCache.set(contentType, []);
    }
  }

  /**
   * Get cached genres for a content type
   */
  async getGenres(contentType: ContentType): Promise<TMDBGenre[]> {
    if (!this.genreCache.has(contentType)) {
      await this.fetchGenres(contentType);
    }
    return this.genreCache.get(contentType) || [];
  }

  /**
   * Search for content by title
   */
  async searchContent(query: string, contentType: ContentType, page: number = 1): Promise<VideoItem[]> {
    try {
      const endpoint = contentType === ContentType.MOVIE ? '/search/movie' : '/search/tv';

      const response = await axios.get<TMDBPaginatedResponse<TMDBMovie | TMDBTVShow>>(endpoint, {
        params: {
          query,
          page,
        },
      });

      const results = response.data.results;

      // Fetch genres if not cached
      if (!this.genreCache.has(contentType)) {
        await this.fetchGenres(contentType);
      }
      const genres = this.genreCache.get(contentType) || [];

      // Transform to VideoItem format
      const videoItems: VideoItem[] = [];

      for (const item of results) {
        const trailerKey = await this.getVideoTrailer(item.id, contentType);

        const videoItem: VideoItem = {
          id: item.id,
          title: contentType === ContentType.MOVIE ? (item as TMDBMovie).title : (item as TMDBTVShow).name,
          description: item.overview,
          posterUrl: item.poster_path ? tmdbClient.getImageUrl(item.poster_path) : undefined,
          backdropUrl: item.backdrop_path ? tmdbClient.getImageUrl(item.backdrop_path, 'w780') : undefined,
          releaseDate: contentType === ContentType.MOVIE ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date,
          rating: item.vote_average,
          voteCount: item.vote_count,
          popularity: item.popularity,
          isAdult: item.adult,
          originalLanguage: item.original_language,
          originalTitle: contentType === ContentType.MOVIE ? (item as TMDBMovie).original_title : (item as TMDBTVShow).original_name,
          genreIds: item.genre_ids,
          genres: genres.filter(genre => item.genre_ids.includes(genre.id)),
          contentType,
          videoKey: trailerKey,
          videoType: trailerKey ? 'youtube' : 'direct',
          videoUrl: undefined,
        };

        videoItems.push(videoItem);
      }

      return videoItems;
    } catch (error) {
      console.error(`Error searching ${contentType}:`, error);
      throw new Error(`Failed to search ${contentType}`);
    }
  }
}

export const tmdbVideoService = new TMDBVideoService();