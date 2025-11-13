// Content Type Tabs Component
// Tab bar for Movies/TV/Anime filtering

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentTypeTabsProps } from '../../types/feed';
import { ContentType } from '../../types';

const ContentTypeTabs: React.FC<ContentTypeTabsProps> = ({
  activeTab,
  onTabChange,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');

  const tabs = [
    {
      type: ContentType.MOVIE,
      label: 'Movies',
    },
    {
      type: ContentType.TV,
      label: 'TV Shows',
    },
    {
      type: ContentType.ANIME,
      label: 'Anime',
    },
  ];

  const handleTabPress = (contentType: ContentType) => {
    if (contentType !== activeTab) {
      onTabChange(contentType);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        },
        style,
      ]}
    >
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.type === activeTab;

          return (
            <TouchableOpacity
              key={tab.type}
              style={[
                styles.tab,
                isActive && styles.activeTab,
              ]}
              onPress={() => handleTabPress(tab.type)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active indicator */}
      <View style={styles.indicatorContainer}>
        {tabs.map((tab, index) => {
          const isActive = tab.type === activeTab;
          const tabWidth = screenWidth / tabs.length;

          return (
            <View
              key={`indicator-${tab.type}`}
              style={[
                styles.indicator,
                {
                  width: tabWidth - 32,
                  left: index * tabWidth + 16,
                  opacity: isActive ? 1 : 0,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    // Tab styling when active
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  indicatorContainer: {
    position: 'relative',
    height: 2,
    marginTop: 4,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 1,
    // Transition will be handled by Animated API in future
  },
});

export default ContentTypeTabs;