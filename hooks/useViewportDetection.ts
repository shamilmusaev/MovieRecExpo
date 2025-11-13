// Viewport Detection Hook
// Detects which video is currently visible in the feed

import { useState, useCallback, useRef } from 'react';
import { ViewableItemsChanged, ViewableItem } from '../types/feed';

interface UseViewportDetectionProps {
  onViewableItemsChanged?: (info: ViewableItemsChanged) => void;
  viewabilityConfig?: {
    itemVisiblePercentThreshold?: number;
    minimumViewTime?: number;
  };
}

interface UseViewportDetectionReturn {
  viewabilityConfig: {
    itemVisiblePercentThreshold?: number;
    minimumViewTime?: number;
  };
  handleViewableItemsChanged: (info: ViewableItemsChanged) => void;
  activeIndex: number | null;
  visibleIndices: number[];
  isIndexActive: (index: number) => boolean;
  isIndexVisible: (index: number) => boolean;
}

export const useViewportDetection = ({
  onViewableItemsChanged,
  viewabilityConfig = {},
}: UseViewportDetectionProps = {}): UseViewportDetectionReturn => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  const lastActiveIndexRef = useRef<number | null>(null);

  // Default viewability configuration
  const defaultViewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Item is considered viewable when 50% visible
    minimumViewTime: 300, // Minimum time before item is considered viewable (ms)
    ...viewabilityConfig,
  };

  // Handle viewable items change
  const handleViewableItemsChanged = useCallback((info: ViewableItemsChanged) => {
    const { viewableItems, changed } = info;

    // Update visible indices
    const newVisibleIndices = viewableItems
      .filter(item => item.index !== null)
      .map(item => item.index!);
    setVisibleIndices(newVisibleIndices);

    // Find the most visible item (highest visibility percentage)
    let mostVisibleIndex: number | null = null;
    let maxVisibility = 0;

    viewableItems.forEach(item => {
      if (item.index === null) return;

      // Calculate visibility based on index position and itemVisiblePercentThreshold
      // This is a simplified approach - in practice, you'd want actual visibility percentages
      const visibility = item.isViewable ? 100 : 0;

      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleIndex = item.index;
      }
    });

    // Update active index if the most visible item has changed
    const newActiveIndex = mostVisibleIndex;

    if (newActiveIndex !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = newActiveIndex;
      setActiveIndex(newActiveIndex);
    }

    // Call external callback if provided
    if (onViewableItemsChanged) {
      onViewableItemsChanged(info);
    }

    // Log for debugging
    if (newActiveIndex !== null && changed.some(item => item.index === newActiveIndex)) {
      console.log(`Active video changed to index: ${newActiveIndex}`);
    }
  }, [onViewableItemsChanged]);

  // Check if a specific index is active
  const isIndexActive = useCallback((index: number): boolean => {
    return activeIndex === index;
  }, [activeIndex]);

  // Check if a specific index is visible
  const isIndexVisible = useCallback((index: number): boolean => {
    return visibleIndices.includes(index);
  }, [visibleIndices]);

  return {
    viewabilityConfig: defaultViewabilityConfig,
    handleViewableItemsChanged,
    activeIndex,
    visibleIndices,
    isIndexActive,
    isIndexVisible,
  };
};