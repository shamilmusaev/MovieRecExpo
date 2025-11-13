// Genre Tag List Component
// Horizontal scrollable genre tag chips

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { GenreTagListProps } from '../../types/feed';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GenreTagList: React.FC<GenreTagListProps> = ({
  genres,
  activeGenreIds = [],
  maxVisible = 3,
  onGenreClick,
  style,
}) => {
  if (!genres || genres.length === 0) {
    return null;
  }

  // Limit genres to maxVisible
  const displayGenres = genres.slice(0, maxVisible);

  const handleGenrePress = (genreId: number) => {
    onGenreClick?.(genreId);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { maxWidth: SCREEN_WIDTH - 100 }, // Leave space for action buttons
        style,
      ]}
    >
      {displayGenres.map((genre) => {
        const isActive = activeGenreIds.includes(genre.id);

        return (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.tag,
              isActive && styles.activeTag,
            ]}
            onPress={() => handleGenrePress(genre.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tagText,
                isActive && styles.activeTagText,
              ]}
              numberOfLines={1}
            >
              {genre.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    minWidth: 40,
    maxWidth: 120,
  },
  activeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activeTagText: {
    color: '#000000',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
});

export default GenreTagList;