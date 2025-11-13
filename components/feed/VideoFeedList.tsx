// Video Feed List Component
// Vertical scrollable list managing video cards

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ViewToken,
  Text,
} from 'react-native';
import { VideoFeedListProps, ViewableItemsChanged } from '../../types/feed';
import VideoFeedItem from './VideoFeedItem';
import { useViewportDetection } from '../../hooks/useViewportDetection';
import { useVideoCache } from '../../hooks/useVideoCache';
import { VideoItem } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoFeedList: React.FC<VideoFeedListProps> = ({
  videos,
  loading,
  hasMore,
  onEndReached,
  onViewableItemsChanged,
  onVideoPress,
  onRefresh,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Enhanced viewport detection with custom callback
  const {
    viewabilityConfig,
    handleViewableItemsChanged: handleViewportChange,
    activeIndex,
  } = useViewportDetection({
    onViewableItemsChanged: useCallback((info: ViewableItemsChanged) => {
      onViewableItemsChanged?.(info);
    }, [onViewableItemsChanged]),
    viewabilityConfig: {
      itemVisiblePercentThreshold: 60, // Consider item viewable at 60%
      minimumViewTime: 200, // Minimum 200ms before considering viewable
    },
  });

  // Video caching for smooth playback
  const videoCache = useVideoCache({
    currentIndex: activeIndex ?? 0,
    videos,
    preloadCount: 2,
    maxCacheSize: 5,
  });

  // For now, we don't have active genre filtering in VideoFeedList
  // This would be implemented when we connect genre filtering to the feed
  const activeGenreIds: number[] = [];

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  // Handle end reached (infinite scroll)
  const handleEndReached = useCallback(() => {
    if (!loading && hasMore) {
      onEndReached?.();
    }
  }, [loading, hasMore, onEndReached]);

  // Handle video interactions
  const handleLike = useCallback((videoId: number, isLiked: boolean) => {
    console.log(`Video ${videoId} ${isLiked ? 'liked' : 'unliked'}`);
    // TODO: Connect to interactions service
  }, []);

  const handleFavorite = useCallback((videoId: number, isFavorited: boolean) => {
    console.log(`Video ${videoId} ${isFavorited ? 'favorited' : 'unfavorited'}`);
    // TODO: Connect to interactions service
  }, []);

  const handleShare = useCallback((video: VideoItem) => {
    console.log(`Sharing video: ${video.title}`);
    // TODO: Implement native share functionality
  }, []);

  const handleGenreClick = useCallback((genreId: number) => {
    console.log(`Genre clicked: ${genreId}`);
    // TODO: Implement genre filtering
  }, []);

  const handleProgress = useCallback((videoId: number, progress: number) => {
    // TODO: Track watch progress
    if (progress % 25 === 0) { // Log at 25%, 50%, 75%, 100%
      console.log(`Video ${videoId} progress: ${progress}%`);
    }
  }, []);

  const handleVideoError = useCallback((videoId: number, error: string) => {
    console.error(`Video ${videoId} error: ${error}`);
    // TODO: Handle video errors (e.g., show fallback UI)
  }, []);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Handle video press (for potential detailed view)
  const handleVideoItemPress = useCallback((video: VideoItem) => {
    onVideoPress?.(video);
  }, [onVideoPress]);

  // Render individual video item
  const renderVideoItem = useCallback(({ item, index }: { item: VideoItem; index: number }) => {
    const isActive = activeIndex === index;

    return (
      <VideoFeedItem
        key={item.id}
        video={item}
        isActive={isActive}
        isMuted={isMuted}
        activeGenreIds={[]} // TODO: Pass actual active genre IDs when filtering is implemented
        onLike={handleLike}
        onFavorite={handleFavorite}
        onShare={handleShare}
        onGenreClick={handleGenreClick}
        onProgress={handleProgress}
        onVideoError={handleVideoError}
        onMuteToggle={handleMuteToggle}
      />
    );
  }, [
    activeIndex,
    isMuted,
    handleLike,
    handleFavorite,
    handleShare,
    handleGenreClick,
    handleProgress,
    handleVideoError,
    handleMuteToggle,
  ]);

  // Render footer loading indicator
  const renderFooter = useCallback(() => {
    if (!loading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }, [loading]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (loading && videos.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No videos found</Text>
        <Text style={styles.emptySubtext}>Pull down to refresh</Text>
      </View>
    );
  }, [loading, videos.length]);

  // Memoized key extractor
  const keyExtractor = useCallback((item: VideoItem) => `video-${item.id}`, []);

  // Optimized FlatList configuration
  const flatListProps = useMemo(() => ({
    ref: flatListRef,
    style: styles.container,
    data: videos,
    renderItem: renderVideoItem,
    keyExtractor: keyExtractor,
    ListFooterComponent: renderFooter,
    ListEmptyComponent: renderEmptyState,
    refreshControl: (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        tintColor="#FFFFFF"
        colors={['#FFFFFF']}
      />
    ),
    onEndReached: handleEndReached,
    onEndReachedThreshold: 0.5, // Trigger when 50% from the end
    viewabilityConfig: viewabilityConfig,
    onViewableItemsChanged: handleViewportChange as any,
    windowSize: 3, // Render 3 screens worth of items
    maxToRenderPerBatch: 2, // Render 2 items per batch
    initialNumToRender: 1, // Start with 1 item
    updateCellsBatchingPeriod: 50, // Batch updates every 50ms
    removeClippedSubviews: true, // Remove off-screen items
    pagingEnabled: true, // Enable page snapping
    decelerationRate: 'fast' as any, // Fast deceleration for snappy feel
    snapToInterval: SCREEN_HEIGHT, // Snap to full screen height
    snapToAlignment: 'start' as any, // Align snaps to start
    showsVerticalScrollIndicator: false,
    bounces: false, // Prevent over-scroll for better UX
  }), [
    videos,
    renderVideoItem,
    keyExtractor,
    renderFooter,
    renderEmptyState,
    refreshing,
    handleRefresh,
    handleEndReached,
    viewabilityConfig,
    handleViewportChange,
  ]);

  return (
    <FlatList {...flatListProps} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: SCREEN_HEIGHT,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default VideoFeedList;