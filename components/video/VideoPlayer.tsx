// Video Player Component
// Uses react-native-youtube-iframe for YouTube video playback

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { VideoPlayerProps } from '../../types/feed';
import VideoErrorFallback from './VideoErrorFallback';
import { VideoItem } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSource,
  isActive,
  isMuted,
  onProgressUpdate,
  onError,
  onReady,
  height = SCREEN_HEIGHT,
  width = Dimensions.get('window').width,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const playerRef = useRef<any>(null);

  // Handle player state changes
  const handleStateChange = useCallback((state: string) => {
    console.log('Video player state changed:', state, 'videoId:', videoSource?.type === 'youtube' ? videoSource.videoId : 'N/A');

    switch (state) {
      case 'playing':
        setIsPlaying(true);
        if (!playerReady) {
          setPlayerReady(true);
          onReady?.();
        }
        break;
      case 'paused':
        setIsPlaying(false);
        break;
      case 'ended':
        setIsPlaying(false);
        // Video ended - could trigger next video
        break;
      case 'unstarted':
      case 'buffering':
        setIsPlaying(false);
        break;
      default:
        break;
    }
  }, [playerReady, onReady, videoSource]);

  // Handle playback errors
  const handleError = useCallback((error: string) => {
    console.error('Video player error:', error);
    setHasError(true);
    setErrorMessage(error);
    onError?.(error);
  }, [onError]);

  // Retry loading video
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    setPlayerReady(false);
    // Force re-render of YouTube player
  }, []);

  // Mock video item for fallback (would be passed as prop in real implementation)
  const mockVideoItem: VideoItem = {
    id: 0,
    title: 'Video',
    description: '',
    contentType: videoSource?.type === 'youtube' ? 'movie' as any : 'movie',
    genres: [],
    genreIds: [],
    videoKey: videoSource?.type === 'youtube' ? videoSource.videoId : undefined,
    videoType: videoSource?.type || 'youtube',
    rating: 0,
    voteCount: 0,
    popularity: 0,
    isAdult: false,
    originalLanguage: '',
    originalTitle: '',
    releaseDate: '',
  };

  // Handle player ready
  const handleReady = useCallback(() => {
    console.log('Video player ready');
    setPlayerReady(true);
    onReady?.();
  }, [onReady]);

  // Control playback based on isActive prop
  useEffect(() => {
    console.log('isActive changed:', isActive, 'playerReady:', playerReady);
    if (isActive) {
      // Start playing immediately when video becomes active
      setIsPlaying(true);
    } else {
      // Pause when video is not active
      setIsPlaying(false);
    }
  }, [isActive, playerReady]);

  // Note: Mute/unmute is handled via the mute prop on YoutubePlayer component (line 145)
  // No need for imperative mute/unMute calls

  // If no video source, show message
  if (!videoSource) {
    console.warn('VideoPlayer: No videoSource provided');
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>
          No video available
        </Text>
      </View>
    );
  }

  // Show error fallback if there's an error
  if (hasError) {
    return (
      <VideoErrorFallback
        video={mockVideoItem}
        error={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

  // YouTube video player
  if (videoSource.type === 'youtube') {
    console.log('Rendering YouTube player with videoId:', videoSource.videoId, 'isActive:', isActive, 'isPlaying:', isPlaying);

    return (
      <View style={[styles.container, { height, width }]}>
        <YoutubePlayer
          ref={playerRef}
          height={height}
          videoId={videoSource.videoId}
          play={isActive && isPlaying}
          mute={isMuted}
          onChangeState={handleStateChange}
          onReady={handleReady}
          onError={handleError}
          initialPlayerParams={{
            preventFullScreen: true,
            controls: false, // Hide default controls for custom UI
            modestbranding: true,
            rel: false, // Don't show related videos
            showinfo: false,
            iv_load_policy: 3, // Hide annotations
            cc_load_policy: 0, // Hide closed captions
            hl: 'en', // Language
            autoplay: 0, // We control autoplay ourselves
          }}
          webViewStyle={{
            opacity: 0.99, // Fix for black screen on iOS
          }}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
            allowsFullscreenVideo: false,
          }}
        />
      </View>
    );
  }

  // Direct video URL player (placeholder for future implementation with expo-video)
  if (videoSource.type === 'direct') {
    // TODO: Implement expo-video player for direct URLs
    console.warn('Direct video URL player not yet implemented');
    return (
      <View style={[styles.container, { height, width }]}>
        {/* Will be implemented with expo-video */}
      </View>
    );
  }

  return (
    <View style={[styles.container, { height, width }]} />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;