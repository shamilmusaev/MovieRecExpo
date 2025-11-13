// Feed Empty State Component
// Empty states for different scenarios

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeedEmptyStateProps {
  type: 'no_results' | 'no_internet' | 'error' | 'loading';
  title?: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const FeedEmptyState: React.FC<FeedEmptyStateProps> = ({
  type,
  title,
  message,
  action,
}) => {
  const renderContent = () => {
    switch (type) {
      case 'no_results':
        return {
          icon: 'search-outline' as const,
          defaultTitle: 'No Results Found',
          defaultMessage: 'Try adjusting your filters or search terms',
          color: '#FF9500',
        };

      case 'no_internet':
        return {
          icon: 'wifi-outline' as const,
          defaultTitle: 'No Internet Connection',
          defaultMessage: 'Check your connection and try again',
          color: '#FF3B30',
        };

      case 'error':
        return {
          icon: 'alert-circle-outline' as const,
          defaultTitle: 'Something Went Wrong',
          defaultMessage: 'We encountered an error loading content',
          color: '#FF3B30',
        };

      case 'loading':
        return {
          icon: 'ellipsis-horizontal-circle-outline' as const,
          defaultTitle: 'Loading...',
          defaultMessage: 'Please wait while we fetch content',
          color: '#007AFF',
        };

      default:
        return {
          icon: 'film-outline' as const,
          defaultTitle: 'No Content Available',
          defaultMessage: 'Check back later for new content',
          color: '#8E8E93',
        };
    }
  };

  const config = renderContent();

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
        <Ionicons
          name={config.icon}
          size={48}
          color={config.color}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        {title || config.defaultTitle}
      </Text>

      {/* Message */}
      <Text style={styles.message}>
        {message || config.defaultMessage}
      </Text>

      {/* Action button */}
      {action && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: config.color }]}
          onPress={action.onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}

      {/* Decorative elements */}
      <View style={styles.decorations}>
        <View style={[styles.decoration, styles.decoration1]} />
        <View style={[styles.decoration, styles.decoration2]} />
        <View style={[styles.decoration, styles.decoration3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: SCREEN_HEIGHT,
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    minWidth: 140,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  decoration: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decoration1: {
    width: 100,
    height: 100,
    top: '15%',
    left: '10%',
  },
  decoration2: {
    width: 60,
    height: 60,
    top: '25%',
    right: '15%',
  },
  decoration3: {
    width: 80,
    height: 80,
    bottom: '20%',
    left: '20%',
  },
});

export default FeedEmptyState;