// Data Validation Utilities
// Validates API responses and user inputs

import { TMDBMovie, TMDBTVShow, TMDBGenre, TMDBVideo, VideoItem, ContentType } from '../types';

// Base validation result
interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: string[];
}

// Validate TMDB Movie response
export const validateTMDBMovie = (movie: any): ValidationResult<TMDBMovie> => {
  const errors: string[] = [];

  if (!movie || typeof movie !== 'object') {
    errors.push('Movie must be an object');
    return { isValid: false, errors };
  }

  // Required fields
  if (typeof movie.id !== 'number' || movie.id <= 0) {
    errors.push('Movie must have a valid positive id');
  }

  if (typeof movie.title !== 'string' || movie.title.trim().length === 0) {
    errors.push('Movie must have a non-empty title');
  }

  if (typeof movie.overview !== 'string') {
    errors.push('Movie must have an overview (can be empty string)');
  }

  // Optional fields with type validation
  if (movie.poster_path && typeof movie.poster_path !== 'string') {
    errors.push('poster_path must be a string if provided');
  }

  if (movie.backdrop_path && typeof movie.backdrop_path !== 'string') {
    errors.push('backdrop_path must be a string if provided');
  }

  if (movie.release_date && typeof movie.release_date !== 'string') {
    errors.push('release_date must be a string if provided');
  }

  if (typeof movie.vote_average !== 'number' || movie.vote_average < 0 || movie.vote_average > 10) {
    errors.push('vote_average must be a number between 0 and 10');
  }

  if (typeof movie.vote_count !== 'number' || movie.vote_count < 0) {
    errors.push('vote_count must be a non-negative number');
  }

  if (typeof movie.popularity !== 'number' || movie.popularity < 0) {
    errors.push('popularity must be a non-negative number');
  }

  if (typeof movie.adult !== 'boolean') {
    errors.push('adult must be a boolean');
  }

  if (!Array.isArray(movie.genre_ids)) {
    errors.push('genre_ids must be an array');
  } else if (!movie.genre_ids.every((id: any) => typeof id === 'number' && id > 0)) {
    errors.push('All genre_ids must be positive numbers');
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? movie as TMDBMovie : undefined,
    errors,
  };
};

// Validate TMDB TV Show response
export const validateTMDBTVShow = (show: any): ValidationResult<TMDBTVShow> => {
  const errors: string[] = [];

  if (!show || typeof show !== 'object') {
    errors.push('TV show must be an object');
    return { isValid: false, errors };
  }

  // Required fields
  if (typeof show.id !== 'number' || show.id <= 0) {
    errors.push('TV show must have a valid positive id');
  }

  if (typeof show.name !== 'string' || show.name.trim().length === 0) {
    errors.push('TV show must have a non-empty name');
  }

  if (typeof show.overview !== 'string') {
    errors.push('TV show must have an overview (can be empty string)');
  }

  // Optional fields with type validation
  if (show.poster_path && typeof show.poster_path !== 'string') {
    errors.push('poster_path must be a string if provided');
  }

  if (show.backdrop_path && typeof show.backdrop_path !== 'string') {
    errors.push('backdrop_path must be a string if provided');
  }

  if (show.first_air_date && typeof show.first_air_date !== 'string') {
    errors.push('first_air_date must be a string if provided');
  }

  if (typeof show.vote_average !== 'number' || show.vote_average < 0 || show.vote_average > 10) {
    errors.push('vote_average must be a number between 0 and 10');
  }

  if (typeof show.vote_count !== 'number' || show.vote_count < 0) {
    errors.push('vote_count must be a non-negative number');
  }

  if (typeof show.popularity !== 'number' || show.popularity < 0) {
    errors.push('popularity must be a non-negative number');
  }

  if (typeof show.adult !== 'boolean') {
    errors.push('adult must be a boolean');
  }

  if (!Array.isArray(show.genre_ids)) {
    errors.push('genre_ids must be an array');
  } else if (!show.genre_ids.every((id: any) => typeof id === 'number' && id > 0)) {
    errors.push('All genre_ids must be positive numbers');
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? show as TMDBTVShow : undefined,
    errors,
  };
};

// Validate TMDB Genre response
export const validateTMDBGenre = (genre: any): ValidationResult<TMDBGenre> => {
  const errors: string[] = [];

  if (!genre || typeof genre !== 'object') {
    errors.push('Genre must be an object');
    return { isValid: false, errors };
  }

  if (typeof genre.id !== 'number' || genre.id <= 0) {
    errors.push('Genre must have a valid positive id');
  }

  if (typeof genre.name !== 'string' || genre.name.trim().length === 0) {
    errors.push('Genre must have a non-empty name');
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? genre as TMDBGenre : undefined,
    errors,
  };
};

// Validate TMDB Video response
export const validateTMDBVideo = (video: any): ValidationResult<TMDBVideo> => {
  const errors: string[] = [];

  if (!video || typeof video !== 'object') {
    errors.push('Video must be an object');
    return { isValid: false, errors };
  }

  if (typeof video.name !== 'string' || video.name.trim().length === 0) {
    errors.push('Video must have a non-empty name');
  }

  if (typeof video.key !== 'string' || video.key.trim().length === 0) {
    errors.push('Video must have a non-empty key');
  }

  if (typeof video.site !== 'string' || video.site.trim().length === 0) {
    errors.push('Video must have a non-empty site');
  }

  const validTypes = ['Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes', 'Bloopers'];
  if (!validTypes.includes(video.type)) {
    errors.push(`Video type must be one of: ${validTypes.join(', ')}`);
  }

  if (typeof video.official !== 'boolean') {
    errors.push('Video official must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? video as TMDBVideo : undefined,
    errors,
  };
};

// Validate VideoItem (our internal format)
export const validateVideoItem = (video: any): ValidationResult<VideoItem> => {
  const errors: string[] = [];

  if (!video || typeof video !== 'object') {
    errors.push('VideoItem must be an object');
    return { isValid: false, errors };
  }

  if (typeof video.id !== 'number' || video.id <= 0) {
    errors.push('VideoItem must have a valid positive id');
  }

  if (typeof video.title !== 'string' || video.title.trim().length === 0) {
    errors.push('VideoItem must have a non-empty title');
  }

  if (typeof video.description !== 'string') {
    errors.push('VideoItem must have a description (can be empty string)');
  }

  if (!Object.values(ContentType).includes(video.contentType)) {
    errors.push(`VideoItem contentType must be one of: ${Object.values(ContentType).join(', ')}`);
  }

  if (video.videoKey && typeof video.videoKey !== 'string') {
    errors.push('videoKey must be a string if provided');
  }

  if (!Array.isArray(video.genres)) {
    errors.push('genres must be an array');
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? video as VideoItem : undefined,
    errors,
  };
};

// Safe logging function that strips sensitive data
export const safeLog = (level: 'log' | 'error' | 'warn' | 'info', message: string, data?: any) => {
  const sanitizeData = (obj: any): any => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Create a copy to avoid mutating the original
    const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

    // Remove sensitive keys recursively
    const sensitiveKeys = ['api_key', 'apiKey', 'token', 'password', 'secret'];

    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = sanitizeData(sanitized[key]);
      }
    });

    return sanitized;
  };

  const safeData = data ? sanitizeData(data) : undefined;

  switch (level) {
    case 'error':
      console.error(message, safeData);
      break;
    case 'warn':
      console.warn(message, safeData);
      break;
    case 'info':
      console.info(message, safeData);
      break;
    default:
      console.log(message, safeData);
  }
};