// Local Storage Types

export interface Favorite {
  id: number;
  type: 'movie' | 'tv';
  addedAt: string; // ISO timestamp
  title: string;
  posterUrl?: string;
  rating: number;
}

export interface UserPreferences {
  favoriteGenres: number[]; // TMDB genre IDs
  preferredContentType: 'movie' | 'tv' | 'both';
  language: string;
  region: string;
  notificationsEnabled: boolean;
  autoplayEnabled: boolean;
  videoQuality: 'low' | 'medium' | 'high';
  dataSaverMode: boolean;
}

export interface ViewHistory {
  id: number;
  type: 'movie' | 'tv';
  viewedAt: string; // ISO timestamp
  watchDuration: number; // seconds
  totalDuration: number; // seconds
  completed: boolean;
}

export interface UserRating {
  id: number;
  type: 'movie' | 'tv';
  rating: number; // 1-10
  ratedAt: string; // ISO timestamp
}

export interface UserActivity {
  id: string;
  type: 'view' | 'like' | 'share' | 'add_to_favorites' | 'remove_from_favorites';
  contentId: number;
  contentType: 'movie' | 'tv';
  timestamp: string; // ISO timestamp
  metadata?: Record<string, any>;
}

export interface AppCache {
  genres: {
    movie: Array<{ id: number; name: string }>;
    tv: Array<{ id: number; name: string }>;
  };
  lastUpdated: string; // ISO timestamp
  version: string;
}

// Storage keys
export const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  USER_PREFERENCES: 'user_preferences',
  VIEW_HISTORY: 'view_history',
  USER_RATINGS: 'user_ratings',
  USER_ACTIVITY: 'user_activity',
  APP_CACHE: 'app_cache',
} as const;