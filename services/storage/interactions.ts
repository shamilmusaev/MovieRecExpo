// User Interactions Storage Service
// Manages likes, favorites, shares, and user behavior signals

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSignal, ContentType } from '../../types';
import { STORAGE_KEYS } from '../../types/storage';

interface StoredInteraction {
  videoId: number;
  contentType: ContentType;
  isLiked: boolean;
  isFavorited: boolean;
  timestamp: string;
}

interface StoredSignal {
  id: string;
  videoId: number;
  contentType: ContentType;
  signalType: string;
  value: number;
  timestamp: string;
  metadata?: string; // JSON string
}

class InteractionsService {
  private readonly interactionsKey = STORAGE_KEYS.USER_ACTIVITY;
  private readonly likesKey = 'user_likes';
  private readonly favoritesKey = 'user_favorites';
  private readonly signalsKey = 'user_signals';

  /**
   * Save like interaction for a video
   */
  async saveLike(videoId: number, isLiked: boolean): Promise<void> {
    try {
      const likes = await this.getLikedVideos();
      const likesSet = new Set(likes);

      if (isLiked) {
        likesSet.add(videoId);
      } else {
        likesSet.delete(videoId);
      }

      await AsyncStorage.setItem(this.likesKey, JSON.stringify([...likesSet]));

      // Also save as a signal for future recommendations
      await this.saveSignal({
        id: `like_${videoId}_${Date.now()}`,
        videoId,
        contentType: ContentType.MOVIE, // Will be updated when we have content type info
        signalType: 'like',
        value: isLiked ? 1 : -1,
        timestamp: new Date().toISOString(),
        metadata: { action: isLiked ? 'liked' : 'unliked' }
      });
    } catch (error) {
      console.error('Error saving like:', error);
      throw new Error('Failed to save like');
    }
  }

  /**
   * Save favorite interaction for a video
   */
  async saveFavorite(videoId: number, isFavorited: boolean): Promise<void> {
    try {
      const favorites = await this.getFavoriteVideos();
      const favoritesSet = new Set(favorites);

      if (isFavorited) {
        favoritesSet.add(videoId);
      } else {
        favoritesSet.delete(videoId);
      }

      await AsyncStorage.setItem(this.favoritesKey, JSON.stringify([...favoritesSet]));

      // Also save as a signal for future recommendations
      await this.saveSignal({
        id: `favorite_${videoId}_${Date.now()}`,
        videoId,
        contentType: ContentType.MOVIE, // Will be updated when we have content type info
        signalType: 'favorite',
        value: isFavorited ? 2 : -1, // Favorites have higher weight
        timestamp: new Date().toISOString(),
        metadata: { action: isFavorited ? 'favorited' : 'unfavorited' }
      });
    } catch (error) {
      console.error('Error saving favorite:', error);
      throw new Error('Failed to save favorite');
    }
  }

  /**
   * Get list of liked video IDs
   */
  async getLikedVideos(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(this.likesKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting liked videos:', error);
      return [];
    }
  }

  /**
   * Get list of favorite video IDs
   */
  async getFavoriteVideos(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(this.favoritesKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorite videos:', error);
      return [];
    }
  }

  /**
   * Check if a video is liked
   */
  async isVideoLiked(videoId: number): Promise<boolean> {
    const likedVideos = await this.getLikedVideos();
    return likedVideos.includes(videoId);
  }

  /**
   * Check if a video is favorited
   */
  async isVideoFavorited(videoId: number): Promise<boolean> {
    const favoriteVideos = await this.getFavoriteVideos();
    return favoriteVideos.includes(videoId);
  }

  /**
   * Save a user signal for tracking and recommendations
   */
  async saveSignal(signal: UserSignal): Promise<void> {
    try {
      const storedSignals: StoredSignal[] = await this.getRawSignals();
      const newSignal: StoredSignal = {
        ...signal,
        signalType: signal.signalType,
        metadata: signal.metadata ? JSON.stringify(signal.metadata) : undefined
      };

      storedSignals.unshift(newSignal); // Add to beginning (most recent first)

      // Keep only last 1000 signals to prevent storage bloat
      if (storedSignals.length > 1000) {
        storedSignals.splice(1000);
      }

      await AsyncStorage.setItem(this.signalsKey, JSON.stringify(storedSignals));
    } catch (error) {
      console.error('Error saving signal:', error);
      // Don't throw error for signals - they're not critical for user experience
    }
  }

  /**
   * Get raw stored signals (without type conversion)
   */
  private async getRawSignals(): Promise<StoredSignal[]> {
    try {
      const data = await AsyncStorage.getItem(this.signalsKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting raw signals:', error);
      return [];
    }
  }

  /**
   * Get user signals with optional limit
   */
  async getSignals(limit?: number): Promise<UserSignal[]> {
    try {
      const data = await AsyncStorage.getItem(this.signalsKey);
      const storedSignals: StoredSignal[] = data ? JSON.parse(data) : [];

      const signals: UserSignal[] = storedSignals.map(signal => ({
        ...signal,
        signalType: signal.signalType as UserSignal['signalType'],
        metadata: signal.metadata ? JSON.parse(signal.metadata) : undefined
      }));

      return limit ? signals.slice(0, limit) : signals;
    } catch (error) {
      console.error('Error getting signals:', error);
      return [];
    }
  }

  /**
   * Save watch time signal
   */
  async saveWatchTime(videoId: number, contentType: ContentType, watchDuration: number, totalDuration: number): Promise<void> {
    const watchPercentage = totalDuration > 0 ? (watchDuration / totalDuration) * 100 : 0;
    let signalValue = 1;

    // Higher value for longer watch times
    if (watchPercentage > 80) {
      signalValue = 5; // Completed view
    } else if (watchPercentage > 50) {
      signalValue = 3; // Engaged view
    } else if (watchPercentage > 10) {
      signalValue = 2; // Moderate view
    } else {
      signalValue = 0.5; // Quick view
    }

    await this.saveSignal({
      id: `watch_${videoId}_${Date.now()}`,
      videoId,
      contentType,
      signalType: 'watch_time',
      value: signalValue,
      timestamp: new Date().toISOString(),
      metadata: {
        watchDuration,
        totalDuration,
        watchPercentage: Math.round(watchPercentage)
      }
    });
  }

  /**
   * Save swipe interaction
   */
  async saveSwipe(videoId: number, contentType: ContentType, direction: 'up' | 'down'): Promise<void> {
    await this.saveSignal({
      id: `swipe_${videoId}_${Date.now()}`,
      videoId,
      contentType,
      signalType: direction === 'up' ? 'swipe_up' : 'swipe_down',
      value: direction === 'up' ? 1 : -0.5, // Swiping up is positive, down is slightly negative
      timestamp: new Date().toISOString(),
      metadata: { direction }
    });
  }

  /**
   * Save share interaction
   */
  async saveShare(videoId: number, contentType: ContentType): Promise<void> {
    await this.saveSignal({
      id: `share_${videoId}_${Date.now()}`,
      videoId,
      contentType,
      signalType: 'share',
      value: 3, // Sharing is a strong positive signal
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Save genre click interaction
   */
  async saveGenreClick(genreId: number): Promise<void> {
    await this.saveSignal({
      id: `genre_${genreId}_${Date.now()}`,
      videoId: 0, // 0 indicates this is not video-specific
      contentType: ContentType.MOVIE, // Default, will be refined in future
      signalType: 'genre_click',
      value: 1,
      timestamp: new Date().toISOString(),
      metadata: { genreId }
    });
  }

  /**
   * Get signals for a specific video
   */
  async getVideoSignals(videoId: number): Promise<UserSignal[]> {
    const allSignals = await this.getSignals();
    return allSignals.filter(signal => signal.videoId === videoId);
  }

  /**
   * Clear all interaction data (for testing or user reset)
   */
  async clearAllInteractions(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.likesKey,
        this.favoritesKey,
        this.signalsKey
      ]);
    } catch (error) {
      console.error('Error clearing interactions:', error);
      throw new Error('Failed to clear interactions');
    }
  }

  /**
   * Get interaction statistics
   */
  async getInteractionStats(): Promise<{
    totalLikes: number;
    totalFavorites: number;
    totalShares: number;
    totalWatchTime: number;
    averageWatchPercentage: number;
  }> {
    try {
      const [likedVideos, favoriteVideos, signals] = await Promise.all([
        this.getLikedVideos(),
        this.getFavoriteVideos(),
        this.getSignals()
      ]);

      const watchSignals = signals.filter(s => s.signalType === 'watch_time');
      const shareSignals = signals.filter(s => s.signalType === 'share');

      const totalWatchTime = watchSignals.reduce((sum, signal) => {
        const duration = signal.metadata?.watchDuration || 0;
        return sum + duration;
      }, 0);

      const averageWatchPercentage = watchSignals.length > 0
        ? watchSignals.reduce((sum, signal) => sum + (signal.metadata?.watchPercentage || 0), 0) / watchSignals.length
        : 0;

      return {
        totalLikes: likedVideos.length,
        totalFavorites: favoriteVideos.length,
        totalShares: shareSignals.length,
        totalWatchTime,
        averageWatchPercentage: Math.round(averageWatchPercentage)
      };
    } catch (error) {
      console.error('Error getting interaction stats:', error);
      return {
        totalLikes: 0,
        totalFavorites: 0,
        totalShares: 0,
        totalWatchTime: 0,
        averageWatchPercentage: 0
      };
    }
  }
}

export const interactionsService = new InteractionsService();