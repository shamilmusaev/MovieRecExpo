// Video Error Fallback Component
// Shows when video fails to load or is unavailable

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { VideoItem } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoErrorFallbackProps {
  video: VideoItem;
  error?: string;
  onRetry?: () => void;
  onWatchOnYouTube?: () => void;
  onSwipeToNext?: () => void;
}

const VideoErrorFallback: React.FC<VideoErrorFallbackProps> = ({
  video,
  error,
  onRetry,
  onWatchOnYouTube,
  onSwipeToNext,
}) => {
  const openYouTube = () => {
    if (video.videoKey) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoKey}`;
      onWatchOnYouTube?.();
      // In a real app, you would use Linking.openURL(youtubeUrl)
    }
  };

  return (
    <View style={styles.container}>
      {/* Background poster image */}
      {video.posterUrl && (
        <Image
          source={{ uri: video.posterUrl }}
          style={styles.posterImage}
          resizeMode="cover"
        />
      )}

      {/* Overlay gradient */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>

        {/* Error message */}
        <Text style={styles.errorMessage}>
          {error || 'Video unavailable'}
        </Text>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          {video.videoKey && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={openYouTube}
            >
              <Text style={styles.primaryButtonText}>Watch on YouTube</Text>
            </TouchableOpacity>
          )}

          {onRetry && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onRetry}
            >
              <Text style={styles.secondaryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}

          {onSwipeToNext && (
            <TouchableOpacity
              style={[styles.button, styles.tertiaryButton]}
              onPress={onSwipeToNext}
            >
              <Text style={styles.tertiaryButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Swipe hint */}
      {onSwipeToNext && (
        <View style={styles.swipeHint}>
          <Text style={styles.swipeHintText}>Swipe up for next video</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  errorMessage: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  primaryButton: {
    backgroundColor: '#ff0000', // YouTube red
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  tertiaryButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  swipeHint: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  swipeHintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default VideoErrorFallback;