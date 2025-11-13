// Main Feed Screen
// Displays the video feed with content type tabs and filtering

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import ErrorBoundary from '../../components/ErrorBoundary';
import VideoFeedList from '../../components/feed/VideoFeedList';
import ContentTypeTabs from '../../components/feed/ContentTypeTabs';
import { ContentType } from '../../types';
import { useFeedData } from '../../hooks/useFeedData';
import { useGenreFilter } from '../../hooks/useGenreFilter';
import { preferencesService } from '../../services';
import { interactionsService } from '../../services';
import FeedLoadingState from '../../components/feed/FeedLoadingState';
import FeedEmptyState from '../../components/feed/FeedEmptyState';

export default function FeedScreen() {
  // Content type state (loaded from preferences)
  const [contentType, setContentType] = useState<ContentType>(ContentType.MOVIE);

  // Feed data management
  const {
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    setContentType: setFeedContentType,
    setSelectedGenres,
    clearError,
  } = useFeedData({
    contentType,
    selectedGenreIds: [],
    pageSize: 10,
  });

  // Genre filter management
  const {
    selectedGenreIds,
    toggleGenre,
    clearGenreFilter,
    hasActiveFilter,
  } = useGenreFilter({
    onFilterChange: setSelectedGenres,
  });

  // Load saved content type preference on mount
  useEffect(() => {
    const loadContentType = async () => {
      try {
        const savedContentType = await preferencesService.getFeedContentType();
        setContentType(savedContentType);
        setFeedContentType(savedContentType);
      } catch (error) {
        console.error('Error loading content type preference:', error);
      }
    };

    loadContentType();
  }, [setFeedContentType]);

  // Handle content type change
  const handleContentTypeChange = async (newContentType: ContentType) => {
    setContentType(newContentType);
    setFeedContentType(newContentType);
    clearGenreFilter(); // Clear genre filter when switching content type

    // Save preference
    try {
      await preferencesService.setFeedContentType(newContentType);
    } catch (error) {
      console.error('Error saving content type preference:', error);
    }
  };

  // Handle genre tag click
  const handleGenreClick = (genreId: number) => {
    // Toggle genre filter
    const currentSelection = selectedGenreIds.includes(genreId);

    if (currentSelection) {
      // Remove from selection if already selected
      toggleGenre(genreId);
    } else {
      // Add to selection (clear others first for single selection)
      clearGenreFilter();
      toggleGenre(genreId);
    }
  };

  // Handle video interactions
  const handleLike = async (videoId: number, isLiked: boolean) => {
    try {
      await interactionsService.saveLike(videoId, isLiked, contentType);
    } catch (error) {
      console.error('Error saving like:', error);
      Alert.alert('Error', 'Could not save like. Please try again.');
    }
  };

  const handleFavorite = async (videoId: number, isFavorited: boolean) => {
    try {
      await interactionsService.saveFavorite(videoId, isFavorited);

      if (isFavorited) {
        // Show success feedback
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
      Alert.alert('Error', 'Could not save favorite. Please try again.');
    }
  };

  const handleShare = async (video: any) => {
    try {
      // TODO: Implement native share functionality
      Alert.alert('Share', `Share "${video.title}" feature coming soon!`);
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Could not share video. Please try again.');
    }
  };

  const handleVideoPress = (video: any) => {
    // TODO: Navigate to detailed video view
    console.log('Video pressed:', video.title);
  };

  // Handle viewable items change (for tracking and performance)
  const handleViewableItemsChanged = (info: any) => {
    // TODO: Implement tracking for engaged views
    const { viewableItems } = info;
    if (viewableItems.length > 0) {
      const activeVideo = viewableItems[0];
      // Track video view for recommendations
      console.log('Active video:', activeVideo.item.title);
    }
  };

  // Handle video errors
  const handleVideoError = (videoId: number, error: string) => {
    console.error(`Video ${videoId} error:`, error);
    // Could show toast notification here
  };

  // Render loading state
  if (loading && videos.length === 0) {
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <ContentTypeTabs
            activeTab={contentType}
            onTabChange={handleContentTypeChange}
          />
          <FeedLoadingState type="initial" message="Loading amazing content..." />
        </View>
      </ErrorBoundary>
    );
  }

  // Render error state
  if (error && videos.length === 0) {
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <ContentTypeTabs
            activeTab={contentType}
            onTabChange={handleContentTypeChange}
          />
          <FeedEmptyState
            type="error"
            title="Something went wrong"
            message="We couldn't load the content. Please check your connection and try again."
            action={{
              label: 'Retry',
              onPress: refresh,
            }}
          />
        </View>
      </ErrorBoundary>
    );
  }

  // Render empty state
  if (!loading && videos.length === 0) {
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <ContentTypeTabs
            activeTab={contentType}
            onTabChange={handleContentTypeChange}
          />
          <FeedEmptyState
            type="no_results"
            title="No videos found"
            message={`No ${contentType.toLowerCase()} content available right now. Try different content type or check back later.`}
            action={{
              label: 'Refresh',
              onPress: refresh,
            }}
          />
        </View>
      </ErrorBoundary>
    );
  }

  // Render main feed
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <ContentTypeTabs
          activeTab={contentType}
          onTabChange={handleContentTypeChange}
        />

        <VideoFeedList
          videos={videos}
          loading={loading}
          hasMore={hasMore}
          onEndReached={loadMore}
          onViewableItemsChanged={handleViewableItemsChanged}
          onVideoPress={handleVideoPress}
          onRefresh={refresh}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 0, // No padding - full screen for video
  },
});