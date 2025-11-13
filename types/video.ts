// Video Feed Types

import { TMDBGenre } from './tmdb';

export enum ContentType {
  MOVIE = 'movie',
  TV = 'tv',
  ANIME = 'anime',
}

export interface VideoItem {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
  popularity: number;
  isAdult: boolean;
  originalLanguage: string;
  originalTitle: string;
  genreIds: number[];
  genres: TMDBGenre[]; // Populated from genreIds
  contentType: ContentType;
  videoKey?: string; // YouTube video key from TMDB
  videoType: 'youtube' | 'direct'; // Type of video source
  videoUrl?: string; // Direct video URL (if not YouTube)
  duration?: number; // Video duration in seconds (if available)
}

export interface UserSignal {
  id: string;
  videoId: number;
  contentType: ContentType;
  signalType: 'watch_time' | 'like' | 'favorite' | 'share' | 'swipe_up' | 'swipe_down' | 'genre_click';
  value: number; // Signal weight/strength
  timestamp: string; // ISO timestamp
  metadata?: Record<string, any>;
}

export interface FeedState {
  videos: VideoItem[];
  isLoading: boolean;
  isError: boolean;
  error?: string;
  currentPage: number;
  hasMore: boolean;
  contentType: ContentType;
  selectedGenreIds: number[];
  activeVideoIndex: number;
}

export interface VideoPlaybackState {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number; // 0-100
  duration: number; // seconds
  currentTime: number; // seconds
  hasError: boolean;
  error?: string;
}

export interface VideoInteractionState {
  isLiked: boolean;
  isFavorited: boolean;
  likeCount: number;
  shareCount: number;
}

// Video player configuration
export interface VideoPlayerConfig {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  showControls: boolean;
  preload: 'none' | 'metadata' | 'auto';
  quality: 'auto' | 'low' | 'medium' | 'high';
}

// Video loading strategy
export interface VideoLoadingStrategy {
  preloadCount: number; // Number of videos to preload ahead
  cacheSize: number; // Max videos to keep in memory
  preloadThreshold: number; // Seconds before preloading next video
}