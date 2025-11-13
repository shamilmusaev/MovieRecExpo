// User Preferences Storage Service
// Manages user preferences with AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../../types';
import { STORAGE_KEYS } from '../../types/storage';
import { ContentType } from '../../types';

class PreferencesService {
  // Default preferences
  private readonly defaultPreferences: UserPreferences = {
    favoriteGenres: [],
    preferredContentType: 'movie', // Default to movies
    language: 'en',
    region: 'US',
    notificationsEnabled: true,
    autoplayEnabled: true,
    videoQuality: 'medium',
    dataSaverMode: false,
  };

  /**
   * Get all user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (!data) {
        return this.defaultPreferences;
      }

      const preferences = JSON.parse(data);

      // Merge with defaults to ensure all fields exist
      return {
        ...this.defaultPreferences,
        ...preferences,
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return this.defaultPreferences;
    }
  }

  /**
   * Update specific preferences
   */
  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const currentPreferences = await this.getPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        ...updates,
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(updatedPreferences)
      );

      return updatedPreferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update preferences');
    }
  }

  /**
   * Reset preferences to defaults
   */
  async resetPreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(this.defaultPreferences)
      );
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw new Error('Failed to reset preferences');
    }
  }

  /**
   * Set favorite genres
   */
  async setFavoriteGenres(genreIds: number[]): Promise<void> {
    await this.updatePreferences({ favoriteGenres: genreIds });
  }

  /**
   * Get favorite genres
   */
  async getFavoriteGenres(): Promise<number[]> {
    const preferences = await this.getPreferences();
    return preferences.favoriteGenres;
  }

  /**
   * Set preferred content type
   */
  async setPreferredContentType(contentType: 'movie' | 'tv' | 'both'): Promise<void> {
    await this.updatePreferences({ preferredContentType: contentType });
  }

  /**
   * Get preferred content type
   */
  async getPreferredContentType(): Promise<'movie' | 'tv' | 'both'> {
    const preferences = await this.getPreferences();
    return preferences.preferredContentType;
  }

  /**
   * Set content type for feed (maps to our ContentType enum)
   */
  async setFeedContentType(contentType: ContentType): Promise<void> {
    const mappedType = contentType === ContentType.MOVIE ? 'movie' :
                      contentType === ContentType.TV ? 'tv' : 'both';
    await this.setPreferredContentType(mappedType);
  }

  /**
   * Get feed content type (maps from storage to our ContentType enum)
   */
  async getFeedContentType(): Promise<ContentType> {
    const storedType = await this.getPreferredContentType();

    switch (storedType) {
      case 'movie':
        return ContentType.MOVIE;
      case 'tv':
        return ContentType.TV;
      case 'both':
      default:
        return ContentType.MOVIE; // Default to movies for 'both'
    }
  }

  /**
   * Update video settings
   */
  async updateVideoSettings(settings: {
    autoplayEnabled?: boolean;
    videoQuality?: 'low' | 'medium' | 'high';
    dataSaverMode?: boolean;
  }): Promise<void> {
    await this.updatePreferences(settings);
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(enabled: boolean): Promise<void> {
    await this.updatePreferences({ notificationsEnabled: enabled });
  }

  /**
   * Update language and region settings
   */
  async updateLocalizationSettings(settings: {
    language?: string;
    region?: string;
  }): Promise<void> {
    await this.updatePreferences(settings);
  }

  /**
   * Check if data saver mode is enabled
   */
  async isDataSaverMode(): Promise<boolean> {
    const preferences = await this.getPreferences();
    return preferences.dataSaverMode;
  }

  /**
   * Get video quality setting
   */
  async getVideoQuality(): Promise<'low' | 'medium' | 'high'> {
    const preferences = await this.getPreferences();
    return preferences.videoQuality;
  }

  /**
   * Check if autoplay is enabled
   */
  async isAutoplayEnabled(): Promise<boolean> {
    const preferences = await this.getPreferences();
    return preferences.autoplayEnabled;
  }
}

export const preferencesService = new PreferencesService();