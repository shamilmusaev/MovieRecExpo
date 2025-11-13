// Feed Component Types

import { ContentType, VideoItem, VideoPlaybackState, VideoInteractionState } from './video';
import { TMDBGenre } from './tmdb';

// Feed component props
export interface VideoFeedItemProps {
  video: VideoItem;
  isActive: boolean;
  isMuted: boolean;
  onLike?: (videoId: number, isLiked: boolean) => void;
  onFavorite?: (videoId: number, isFavorited: boolean) => void;
  onShare?: (video: VideoItem) => void;
  onGenreClick?: (genreId: number) => void;
  onProgress?: (videoId: number, progress: number) => void;
  onVideoError?: (videoId: number, error: string) => void;
  onMuteToggle?: () => void;
}

export interface VideoPlayerProps {
  videoSource: {
    type: 'youtube';
    videoId: string;
  } | {
    type: 'direct';
    url: string;
  };
  isActive: boolean;
  isMuted: boolean;
  onProgressUpdate?: (progress: number) => void;
  onError?: (error: string) => void;
  onReady?: () => void;
  height?: number;
  width?: number;
}

export interface GenreTagListProps {
  genres: TMDBGenre[];
  activeGenreIds?: number[];
  maxVisible?: number;
  onGenreClick?: (genreId: number) => void;
  style?: any;
}

export interface ContentTypeTabsProps {
  activeTab: ContentType;
  onTabChange: (contentType: ContentType) => void;
  style?: any;
}

export interface VideoFeedListProps {
  videos: VideoItem[];
  loading: boolean;
  hasMore: boolean;
  onEndReached: () => void;
  onViewableItemsChanged: (info: ViewableItemsChanged) => void;
  onVideoPress?: (video: VideoItem) => void;
  onRefresh?: () => void;
}

// Viewability configuration for FlatList
export interface ViewableItemsChanged {
  changed: ViewableItem[];
  viewableItems: ViewableItem[];
}

export interface ViewableItem {
  item: VideoItem;
  key: string;
  index: number;
  isViewable: boolean;
  itemVisiblePercentThreshold?: number;
}

// Feed state management
export interface FeedActions {
  setContentType: (type: ContentType) => void;
  setSelectedGenres: (genreIds: number[]) => void;
  loadMore: () => void;
  refresh: () => void;
  setActiveVideoIndex: (index: number) => void;
  toggleLike: (videoId: number) => void;
  toggleFavorite: (videoId: number) => void;
  shareVideo: (video: VideoItem) => void;
  filterByGenre: (genreId: number) => void;
}

// Hook return types
export interface UseFeedDataReturn {
  videos: VideoItem[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export interface UseVideoCacheReturn {
  getCachedVideo: (index: number) => VideoItem | null;
  preloadVideo: (index: number) => void;
  clearCache: () => void;
  isVideoPreloaded: (index: number) => boolean;
}

export interface UseProgressTrackingReturn {
  startTracking: (videoId: number) => void;
  stopTracking: (videoId: number) => void;
  pauseTracking: (videoId: number) => void;
  resumeTracking: (videoId: number) => void;
  getWatchTime: (videoId: number) => number;
}

// Error handling
export interface VideoFeedError {
  type: 'network' | 'api' | 'video_load' | 'storage';
  message: string;
  videoId?: number;
  retryable: boolean;
}

// Loading states
export interface FeedLoadingState {
  initial: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  preloading: boolean;
}

// Empty states
export interface FeedEmptyState {
  type: 'no_results' | 'no_internet' | 'error' | 'loading';
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}