// Genre Filter Hook
// Manages genre filtering logic and state

import { useState, useCallback } from 'react';
import { ContentType } from '../types';

interface UseGenreFilterProps {
  onFilterChange?: (genreIds: number[]) => void;
}

interface UseGenreFilterReturn {
  selectedGenreIds: number[];
  toggleGenre: (genreId: number) => void;
  setGenreFilter: (genreIds: number[]) => void;
  clearGenreFilter: () => void;
  isGenreSelected: (genreId: number) => boolean;
  hasActiveFilter: boolean;
  selectedGenreCount: number;
}

export const useGenreFilter = ({
  onFilterChange,
}: UseGenreFilterProps = {}): UseGenreFilterReturn => {
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  // Toggle a genre filter
  const toggleGenre = useCallback((genreId: number) => {
    setSelectedGenreIds(prev => {
      let newSelection: number[];

      if (prev.includes(genreId)) {
        // Remove genre if already selected
        newSelection = prev.filter(id => id !== genreId);
      } else {
        // Add genre if not selected
        newSelection = [...prev, genreId];
      }

      // Call external callback
      onFilterChange?.(newSelection);

      return newSelection;
    });
  }, [onFilterChange]);

  // Set multiple genres at once
  const setGenreFilter = useCallback((genreIds: number[]) => {
    setSelectedGenreIds(genreIds);
    onFilterChange?.(genreIds);
  }, [onFilterChange]);

  // Clear all genre filters
  const clearGenreFilter = useCallback(() => {
    setSelectedGenreIds([]);
    onFilterChange?.([]);
  }, [onFilterChange]);

  // Check if a genre is selected
  const isGenreSelected = useCallback((genreId: number) => {
    return selectedGenreIds.includes(genreId);
  }, [selectedGenreIds]);

  // Computed values
  const hasActiveFilter = selectedGenreIds.length > 0;
  const selectedGenreCount = selectedGenreIds.length;

  return {
    selectedGenreIds,
    toggleGenre,
    setGenreFilter,
    clearGenreFilter,
    isGenreSelected,
    hasActiveFilter,
    selectedGenreCount,
  };
};