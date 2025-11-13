// Feed Data Hook
// Manages video feed fetching, filtering, and state

import { useState, useCallback, useEffect } from 'react';
import { VideoItem, ContentType } from '../types';
import { tmdbVideoService } from '../services';

interface UseFeedDataProps {
  contentType: ContentType;
  selectedGenreIds?: number[];
  pageSize?: number;
}

interface UseFeedDataReturn {
  videos: VideoItem[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  currentPage: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setContentType: (type: ContentType) => void;
  setSelectedGenres: (genreIds: number[]) => void;
  clearError: () => void;
}

export const useFeedData = ({
  contentType: initialContentType = ContentType.MOVIE,
  selectedGenreIds: initialGenreIds = [],
  pageSize = 10,
}: UseFeedDataProps): UseFeedDataReturn => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentType, setContentType] = useState(initialContentType);
  const [selectedGenreIds, setSelectedGenreIds] = useState(initialGenreIds);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  // Load videos based on content type and genre filters
  const loadVideos = useCallback(async (
    page: number = 1,
    append: boolean = false,
    abortSignal?: AbortSignal
  ): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      // Check if request was aborted
      if (abortSignal?.aborted) {
        return;
      }

      let newVideos: VideoItem[] = [];

      // Fetch based on content type
      switch (contentType) {
        case ContentType.MOVIE:
          if (selectedGenreIds.length > 0) {
            // Fetch for each selected genre and merge results
            const genrePromises = selectedGenreIds.map(genreId =>
              tmdbVideoService.getTrendingMovies(page, genreId)
            );
            const genreResults = await Promise.all(genrePromises);
            newVideos = genreResults.flat();
          } else {
            newVideos = await tmdbVideoService.getTrendingMovies(page);
          }
          break;

        case ContentType.TV:
          if (selectedGenreIds.length > 0) {
            const genrePromises = selectedGenreIds.map(genreId =>
              tmdbVideoService.getPopularTVShows(page, genreId)
            );
            const genreResults = await Promise.all(genrePromises);
            newVideos = genreResults.flat();
          } else {
            newVideos = await tmdbVideoService.getPopularTVShows(page);
          }
          break;

        case ContentType.ANIME:
          if (selectedGenreIds.length > 0) {
            const genrePromises = selectedGenreIds.map(genreId =>
              tmdbVideoService.getAnimeContent(page, genreId)
            );
            const genreResults = await Promise.all(genrePromises);
            newVideos = genreResults.flat();
          } else {
            newVideos = await tmdbVideoService.getAnimeContent(page);
          }
          break;

        default:
          throw new Error(`Unknown content type: ${contentType}`);
      }

      // Check if request was aborted after API calls
      if (abortSignal?.aborted) {
        return;
      }

      // Remove duplicates based on ID
      const uniqueVideos = newVideos.filter((video, index, self) =>
        index === self.findIndex(v => v.id === video.id)
      );

      // Sort by popularity
      uniqueVideos.sort((a, b) => b.popularity - a.popularity);

      // Check if request was aborted before state update
      if (abortSignal?.aborted) {
        return;
      }

      // Update state
      if (append) {
        setVideos(prev => [...prev, ...uniqueVideos]);
      } else {
        setVideos(uniqueVideos);
      }

      // Check if there are more videos
      setHasMore(uniqueVideos.length >= pageSize);

    } catch (err) {
      // Don't set error if request was aborted
      if (abortSignal?.aborted) {
        return;
      }
      console.error('Error loading feed data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      // Only set loading to false if not aborted
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  }, [contentType, selectedGenreIds, pageSize, clearError]);

  // Load more videos (infinite scroll)
  const loadMore = useCallback(async (): Promise<void> => {
    if (loading || !hasMore) return;

    const nextPage = currentPage + 1;
    const abortController = new AbortController();

    setCurrentPage(nextPage);
    await loadVideos(nextPage, true, abortController.signal);
  }, [loading, hasMore, currentPage, loadVideos]);

  // Refresh videos
  const refresh = useCallback(async (): Promise<void> => {
    const abortController = new AbortController();

    setCurrentPage(1);
    setHasMore(true);
    await loadVideos(1, false, abortController.signal);
  }, [loadVideos]);

  // Handle content type change
  const handleContentTypeChange = useCallback((newContentType: ContentType) => {
    if (newContentType !== contentType) {
      setContentType(newContentType);
      setCurrentPage(1);
      setHasMore(true);
      setVideos([]);
      clearError();
    }
  }, [contentType, clearError]);

  // Handle genre filter change
  const handleGenreFilterChange = useCallback((newGenreIds: number[]) => {
    if (JSON.stringify(newGenreIds) !== JSON.stringify(selectedGenreIds)) {
      setSelectedGenreIds(newGenreIds);
      setCurrentPage(1);
      setHasMore(true);
      setVideos([]);
      clearError();
    }
  }, [selectedGenreIds, clearError]);

  // Initial load - fix infinite loop by using proper dependencies
  useEffect(() => {
    const abortController = new AbortController();

    loadVideos(1, false, abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []); // Empty dependency array - only run on mount

  // Reload when content type or genre filters change
  useEffect(() => {
    const abortController = new AbortController();

    // Only reload if we have a valid content type
    if (contentType && selectedGenreIds !== undefined) {
      loadVideos(1, false, abortController.signal);
    }

    return () => {
      abortController.abort();
    };
  }, [contentType, JSON.stringify(selectedGenreIds)]); // Stringify for proper comparison

  return {
    videos,
    loading,
    error,
    hasMore,
    currentPage,
    loadMore,
    refresh,
    setContentType: handleContentTypeChange,
    setSelectedGenres: handleGenreFilterChange,
    clearError,
  };
};