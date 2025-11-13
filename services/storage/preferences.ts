// User Preferences Storage Service
// Manages user preferences with AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../../types';
import { STORAGE_KEYS } from '../../types/storage';
import { ContentType } from '../../types';
import { safeLog } from '../../utils/validation';

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
   * Validate user preferences object
   */
  private validatePreferences(preferences: any): UserPreferences {
    const errors: string[] = [];

    if (!preferences || typeof preferences !== 'object') {
      safeLog('error', 'Invalid preferences object', preferences);
      return this.defaultPreferences;
    }

    // Validate favoriteGenres
    if (!Array.isArray(preferences.favoriteGenres)) {
      errors.push('favoriteGenres must be an array');
    } else if (!preferences.favoriteGenres.every((id: any) => typeof id === 'number' && id > 0)) {
      errors.push('All favoriteGenres must be positive numbers');
    }

    // Validate preferredContentType
    const validContentTypes = ['movie', 'tv', 'both'];
    if (!validContentTypes.includes(preferences.preferredContentType)) {
      errors.push(`preferredContentType must be one of: ${validContentTypes.join(', ')}`);
    }

    // Validate language (ISO 639-1)
    if (typeof preferences.language !== 'string' || preferences.language.length !== 2) {
      errors.push('language must be a 2-character ISO 639-1 code');
    }

    // Validate region (ISO 3166-1)
    if (typeof preferences.region !== 'string' || preferences.region.length !== 2) {
      errors.push('region must be a 2-character ISO 3166-1 code');
    }

    // Validate boolean fields
    const booleanFields = ['notificationsEnabled', 'autoplayEnabled', 'dataSaverMode'];
    booleanFields.forEach(field => {
      if (typeof preferences[field] !== 'boolean') {
        errors.push(`${field} must be a boolean`);
      }
    });

    // Validate videoQuality
    const validQualities = ['low', 'medium', 'high'];
    if (!validQualities.includes(preferences.videoQuality)) {
      errors.push(`videoQuality must be one of: ${validQualities.join(', ')}`);
    }

    // Log validation errors
    if (errors.length > 0) {
      safeLog('warn', 'Preferences validation failed', { errors, preferences });
    }

    // Return merged preferences with defaults for invalid fields
    return {
      ...this.defaultPreferences,
      ...preferences,
      // Ensure specific fields are properly typed
      favoriteGenres: Array.isArray(preferences.favoriteGenres)
        ? preferences.favoriteGenres.filter((id: any) => typeof id === 'number' && id > 0)
        : this.defaultPreferences.favoriteGenres,
      preferredContentType: validContentTypes.includes(preferences.preferredContentType)
        ? preferences.preferredContentType
        : this.defaultPreferences.preferredContentType,
      language: typeof preferences.language === 'string' && preferences.language.length === 2
        ? preferences.language
        : this.defaultPreferences.language,
      region: typeof preferences.region === 'string' && preferences.region.length === 2
        ? preferences.region
        : this.defaultPreferences.region,
      notificationsEnabled: typeof preferences.notificationsEnabled === 'boolean'
        ? preferences.notificationsEnabled
        : this.defaultPreferences.notificationsEnabled,
      autoplayEnabled: typeof preferences.autoplayEnabled === 'boolean'
        ? preferences.autoplayEnabled
        : this.defaultPreferences.autoplayEnabled,
      videoQuality: validQualities.includes(preferences.videoQuality)
        ? preferences.videoQuality
        : this.defaultPreferences.videoQuality,
      dataSaverMode: typeof preferences.dataSaverMode === 'boolean'
        ? preferences.dataSaverMode
        : this.defaultPreferences.dataSaverMode,
    };
  }

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

      // Validate and merge with defaults
      return this.validatePreferences(preferences);
    } catch (error) {
      safeLog('error', 'Error getting preferences', error);
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

      // Validate the updated preferences
      const validatedPreferences = this.validatePreferences(updatedPreferences);

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(validatedPreferences)
      );

      return validatedPreferences;
    } catch (error) {
      safeLog('error', 'Error updating preferences', error);
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