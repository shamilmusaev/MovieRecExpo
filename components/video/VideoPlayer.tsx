// Video Player Component
// Uses react-native-youtube-iframe for YouTube video playback

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
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
  const [showPlayButton, setShowPlayButton] = useState(true);
  const playerRef = useRef<any>(null);
  const currentVideoIdRef = useRef<string>('');
  const playRequestedRef = useRef(false);

  // Handle player state changes
  const handleStateChange = useCallback((state: string) => {
    console.log('Video player state changed:', state, 'videoId:', videoSource?.type === 'youtube' ? videoSource.videoId : 'N/A');

    switch (state) {
      case 'playing':
        setIsPlaying(true);
        setShowPlayButton(false); // Hide play button when video starts
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
        setShowPlayButton(true); // Show play button when video ends
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
    console.log('Video player ready, playRequested:', playRequestedRef.current);
    setPlayerReady(true);
    onReady?.();

    // If playback was requested before player was ready, start now
    if (playRequestedRef.current && isActive) {
      console.log('Auto-starting playback after player ready');
      setTimeout(() => {
        if (playerRef.current) {
          console.log('Calling seekTo(0) to start playback');
          playerRef.current.seekTo(0);
        }
      }, 300); // Small delay to ensure player is fully initialized
    }
  }, [onReady, isActive]);

  // Track videoId changes - reset player state
  useEffect(() => {
    const newVideoId = videoSource?.type === 'youtube' ? videoSource.videoId : '';

    if (newVideoId && newVideoId !== currentVideoIdRef.current) {
      console.log('VideoId changed from', currentVideoIdRef.current, 'to', newVideoId);
      currentVideoIdRef.current = newVideoId;

      // Reset state for new video
      setPlayerReady(false);
      setShowPlayButton(true);
      playRequestedRef.current = false;

      // If this video is active, request playback after player is ready
      if (isActive) {
        playRequestedRef.current = true;
      }
    }
  }, [videoSource, isActive]);

  // Control playback based on isActive prop
  useEffect(() => {
    console.log('isActive changed:', isActive, 'playerReady:', playerReady);
    if (isActive) {
      // Start playing immediately when video becomes active
      setIsPlaying(true);
      playRequestedRef.current = true;

      // If player is ready, try to start playback via ref
      if (playerReady && playerRef.current) {
        console.log('Player ready and active - calling seekTo(0)');
        setTimeout(() => {
          playerRef.current?.seekTo(0);
        }, 100);
      }
    } else {
      // Pause when video is not active
      setIsPlaying(false);
      playRequestedRef.current = false;
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

  // Handle manual play button press
  const handlePlayPress = useCallback(() => {
    console.log('Play button pressed - attempting to start playback');
    setShowPlayButton(false);
    setIsPlaying(true);
    playRequestedRef.current = true;

    // Force player to start via ref (workaround for iOS)
    if (playerRef.current) {
      console.log('Calling seekTo(0) to trigger playback');
      // Seeking to 0 can trigger playback on iOS
      playerRef.current.seekTo(0);
    }
  }, []);

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
          forceAndroidAutoplay={true}
          initialPlayerParams={{
            preventFullScreen: false,
            controls: true, // Enable controls for iOS
            modestbranding: true,
            rel: false,
            showinfo: false,
            iv_load_policy: 3,
            cc_load_policy: 0,
            hl: 'en',
            playsinline: 1, // Important for iOS inline playback
          }}
          webViewStyle={{
            opacity: 1, // Changed from 0.99 - full opacity for visibility
            backgroundColor: 'transparent',
          }}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
            allowsFullscreenVideo: true,
            javaScriptEnabled: true,
            domStorageEnabled: true,
            startInLoadingState: false,
            scalesPageToFit: false, // Changed to false - let video maintain aspect ratio
            scrollEnabled: false, // Disable scrolling
            bounces: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
          }}
        />

        {/* Play Button Overlay for iOS */}
        {isActive && showPlayButton && (
          <View style={styles.playButtonOverlay}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPress}
              activeOpacity={0.8}
            >
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>▶</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
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
    position: 'relative',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playIcon: {
    marginLeft: 4, // Center the triangle visually
  },
  playIconText: {
    fontSize: 32,
    color: '#000',
  },
});

export default VideoPlayer;