// Video Error Boundary Component
// Specialized error boundary for video components with video-specific fallbacks

import React, { Component, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ErrorBoundary from './ErrorBoundary';
import { VideoItem } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  children: ReactNode;
  video?: VideoItem;
  onRetry?: () => void;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class VideoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Video Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.overlay} />

          <View style={styles.content}>
            <Ionicons
              name="play-circle-outline"
              size={48}
              color="#FFFFFF"
              style={styles.icon}
            />

            <Text style={styles.title}>Video Error</Text>

            <Text style={styles.message}>
              Sorry, we couldn't play this video.
            </Text>

            {this.props.video && (
              <Text style={styles.videoTitle}>
                {this.props.video.title}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={this.handleRetry}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="refresh-outline"
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.buttonText}>Retry</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.skipButton]}
                onPress={() => {
                  // This would be handled by parent component
                  console.log('Skip to next video');
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: Dimensions.get('window').height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  retryButton: {
    backgroundColor: '#007AFF',
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default VideoErrorBoundary;