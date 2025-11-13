// Favorites Storage Service
// TODO: Implement favorites management using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Favorite, Movie, TVShow } from '../../types';

class FavoritesService {
  private readonly storageKey = 'favorites';

  // TODO: Implement methods
  // - addToFavorites(item: Movie | TVShow)
  // - removeFromFavorites(id: number)
  // - getFavorites()
  // - isFavorite(id: number)
  // - clearFavorites()

  async getFavorites(): Promise<Favorite[]> {
    // TODO: Implement getting favorites from AsyncStorage
    throw new Error('Not implemented');
  }

  async addToFavorites(item: Movie | TVShow): Promise<void> {
    // TODO: Implement adding item to favorites
    throw new Error('Not implemented');
  }

  async removeFromFavorites(id: number): Promise<void> {
    // TODO: Implement removing item from favorites
    throw new Error('Not implemented');
  }

  async isFavorite(id: number): Promise<boolean> {
    // TODO: Implement checking if item is favorite
    throw new Error('Not implemented');
  }
}

export const favoritesService = new FavoritesService();