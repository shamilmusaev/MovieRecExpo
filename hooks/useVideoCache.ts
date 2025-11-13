// Video Cache Hook
// Manages video preloading and memory optimization

import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoItem } from '../types';

interface UseVideoCacheProps {
  currentIndex: number;
  videos: VideoItem[];
  preloadCount?: number;
  maxCacheSize?: number;
}

interface CachedVideo {
  video: VideoItem;
  metadata?: {
    thumbnail?: string;
    title: string;
    duration?: number;
  };
  preloadedAt: number;
}

export const useVideoCache = ({
  currentIndex,
  videos,
  preloadCount = 2,
  maxCacheSize = 5,
}: UseVideoCacheProps) => {
  const [cache] = useState<Map<number, CachedVideo>>(new Map());
  const [preloadingIndices, setPreloadingIndices] = useState<Set<number>>(new Set());
  const preloadTimeoutRef = useRef<any>(null);

  // Get cached video by index
  const getCachedVideo = useCallback((index: number): CachedVideo | null => {
    return cache.get(index) || null;
  }, [cache]);

  // Check if video is preloaded
  const isVideoPreloaded = useCallback((index: number): boolean => {
    return cache.has(index);
  }, [cache]);

  // Preload video metadata (not the actual video for YouTube)
  const preloadVideo = useCallback(async (index: number) => {
    if (index < 0 || index >= videos.length) return;
    if (cache.has(index)) return; // Already cached
    if (preloadingIndices.has(index)) return; // Already preloading

    const video = videos[index];
    if (!video.videoKey) return; // No video to preload

    setPreloadingIndices(prev => new Set(prev).add(index));

    try {
      // For YouTube videos, we can't truly preload the video
      // But we can preload metadata and prepare the player
      const cachedVideo: CachedVideo = {
        video,
        metadata: {
          title: video.title,
          thumbnail: video.posterUrl,
        },
        preloadedAt: Date.now(),
      };

      cache.set(index, cachedVideo);

      // Clean up old cached videos if we exceed max size
      if (cache.size > maxCacheSize) {
        const entries = Array.from(cache.entries());
        entries.sort((a, b) => a[1].preloadedAt - b[1].preloadedAt);

        // Remove oldest entries that are too far from current index
        const toRemove = entries.filter(([idx]) =>
          Math.abs(idx - currentIndex) > preloadCount + 1
        );

        toRemove.forEach(([idx]) => cache.delete(idx));
      }
    } catch (error) {
      console.error('Error preloading video:', error);
    } finally {
      setPreloadingIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  }, [videos, cache, currentIndex, maxCacheSize, preloadCount, preloadingIndices]);

  // Smart preloading based on current index
  const smartPreload = useCallback(() => {
    // Clear existing timeout
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }

    // Preload next videos after a short delay
    preloadTimeoutRef.current = setTimeout(() => {
      // Preload next videos
      for (let i = 1; i <= preloadCount; i++) {
        const nextIndex = currentIndex + i;
        if (nextIndex < videos.length) {
          preloadVideo(nextIndex);
        }
      }

      // Preload previous video (1 only)
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        preloadVideo(prevIndex);
      }
    }, 1000); // 1 second delay
  }, [currentIndex, preloadCount, videos.length, preloadVideo]);

  // Clear cache
  const clearCache = useCallback(() => {
    cache.clear();
    setPreloadingIndices(new Set());
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }
  }, [cache]);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return {
      size: cache.size,
      maxSize: maxCacheSize,
      preloading: preloadingIndices.size,
      cachedIndices: Array.from(cache.keys()),
    };
  }, [cache, maxCacheSize, preloadingIndices]);

  // Auto-preload when current index changes
  useEffect(() => {
    smartPreload();

    // Cleanup timeout on unmount
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, [smartPreload]);

  return {
    getCachedVideo,
    preloadVideo,
    isVideoPreloaded,
    clearCache,
    getCacheStats,
    smartPreload,
  };
};