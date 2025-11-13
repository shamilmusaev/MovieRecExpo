// Video Feed Item Component
// Individual video card with player and overlay UI

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  InteractionManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoFeedItemProps } from '../../types/feed';
import VideoPlayer from '../video/VideoPlayer';
import GenreTagList from './GenreTagList';
import { ContentType } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoFeedItem: React.FC<VideoFeedItemProps> = ({
  video,
  isActive,
  isMuted,
  activeGenreIds,
  onLike,
  onFavorite,
  onShare,
  onGenreClick,
  onProgress,
  onVideoError,
  onMuteToggle,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeAnimation] = useState(new Animated.Value(1));
  const [favoriteAnimation] = useState(new Animated.Value(1));

  // Handle like button press
  const handleLikePress = useCallback(() => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    // Animate like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback
    if (newIsLiked) {
      // Haptic feedback for iOS would go here
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onLike?.(video.id, newIsLiked);
  }, [isLiked, likeAnimation, onLike, video.id]);

  // Handle favorite button press
  const handleFavoritePress = useCallback(() => {
    const newIsFavorited = !isFavorited;
    setIsFavorited(newIsFavorited);

    // Animate favorite button
    Animated.sequence([
      Animated.timing(favoriteAnimation, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback
    if (newIsFavorited) {
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onFavorite?.(video.id, newIsFavorited);
  }, [isFavorited, favoriteAnimation, onFavorite, video.id]);

  // Handle share button press
  const handleSharePress = useCallback(() => {
    onShare?.(video);
  }, [onShare, video]);

  // Handle video press (mute toggle)
  const handleVideoPress = useCallback(() => {
    onMuteToggle?.();
  }, [onMuteToggle]);

  // Handle video progress
  const handleVideoProgress = useCallback((progress: number) => {
    onProgress?.(video.id, progress);
  }, [onProgress, video.id]);

  // Handle video error
  const handleVideoError = useCallback((error: string) => {
    onVideoError?.(video.id, error);
  }, [onVideoError, video.id]);

  // Prepare video source
  const videoSource = video.videoKey
    ? {
        type: 'youtube' as const,
        videoId: video.videoKey,
      }
    : undefined;

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}>
      {/* Video Player */}
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handleVideoPress}
      >
        {videoSource && (
          <VideoPlayer
            videoSource={videoSource}
            isActive={isActive}
            isMuted={isMuted}
            onProgressUpdate={handleVideoProgress}
            onError={handleVideoError}
            height={SCREEN_HEIGHT}
            width={SCREEN_WIDTH}
          />
        )}
      </TouchableOpacity>

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Top gradient for text readability */}
        <View style={styles.topGradient} />

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          {/* Left side - Title and genres */}
          <View style={styles.leftContent}>
            <Text style={styles.title} numberOfLines={2}>
              {video.title}
            </Text>

            {/* Genre tags */}
            {video.genres && video.genres.length > 0 && (
              <GenreTagList
                genres={video.genres.slice(0, 3)}
                activeGenreIds={activeGenreIds || []}
                onGenreClick={onGenreClick}
                maxVisible={3}
              />
            )}

            {/* Rating and year */}
            <View style={styles.metadata}>
              {video.rating > 0 && (
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {video.rating.toFixed(1)}
                  </Text>
                </View>
              )}
              {video.releaseDate && (
                <Text style={styles.yearText}>
                  {new Date(video.releaseDate).getFullYear()}
                </Text>
              )}
            </View>
          </View>

          {/* Right side - Action buttons */}
          <View style={styles.rightContent}>
            {/* Like button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikePress}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={isLiked ? "#FF3B30" : "#FFFFFF"}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Favorite button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFavoritePress}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: favoriteAnimation }] }}>
                <Ionicons
                  name={isFavorited ? "star" : "star-outline"}
                  size={28}
                  color={isFavorited ? "#FFD700" : "#FFFFFF"}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Share button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSharePress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="share-outline"
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* Sound indicator */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleVideoPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 40, // Account for safe area
    alignItems: 'flex-end',
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 12,
    lineHeight: 28,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  yearText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
});

export default VideoFeedItem;