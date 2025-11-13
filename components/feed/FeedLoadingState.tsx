// Feed Loading State Component
// Loading indicators for different loading scenarios

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeedLoadingStateProps {
  type: 'initial' | 'refreshing' | 'loadingMore' | 'preloading';
  message?: string;
}

const FeedLoadingState: React.FC<FeedLoadingStateProps> = ({
  type,
  message,
}) => {
  const renderContent = () => {
    switch (type) {
      case 'initial':
        return (
          <>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.message}>
              {message || 'Loading amazing content...'}
            </Text>
          </>
        );

      case 'refreshing':
        return (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.message}>
              {message || 'Refreshing...'}
            </Text>
          </>
        );

      case 'loadingMore':
        return (
          <View style={styles.footerLoading}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.footerMessage}>
              {message || 'Loading more...'}
            </Text>
          </View>
        );

      case 'preloading':
        return (
          <View style={styles.preloading}>
            <View style={styles.preloadingIndicator} />
            <Text style={styles.preloadingText}>
              {message || 'Preparing next video...'}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  if (type === 'loadingMore') {
    return (
      <View style={styles.footerContainer}>
        {renderContent()}
      </View>
    );
  }

  if (type === 'preloading') {
    return (
      <View style={styles.preloadingContainer}>
        {renderContent()}
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  footerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  footerLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preloadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  preloading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preloadingIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    // In a real implementation, you'd use Animated for rotation
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  footerMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  preloadingText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default FeedLoadingState;