# Tasks: Implement Main Video Feed

## Task Breakdown

This change is broken into incremental, verifiable tasks that deliver user-visible progress. Tasks are ordered to build foundational components first, then integrate them into complete features.

---

### Phase 1: Foundation & Data Layer

#### Task 1: Set up video data models and types ✅
- **Deliverable**: TypeScript types and interfaces for video feed data
- **Files**: `types/video.ts`, `types/feed.ts`
- **Validation**: Types compile without errors
- **Dependencies**: None
- **Estimated time**: 2 hours
- **Status**: Completed
- **Notes**: Created comprehensive type definitions for video items, feed state, component props, and user interactions

Define:
- `VideoItem` interface (id, title, videoUrl, posterUrl, genres, etc.)
- `ContentType` enum (Movie, TV, Anime)
- `UserSignal` type for tracking interactions
- `FeedState` interface for component state

---

#### Task 2: Extend TMDB service with video fetching ✅
- **Deliverable**: TMDB service methods for fetching videos with YouTube keys
- **Files**: `services/tmdb/client.ts`, `services/tmdb/videos.ts`
- **Validation**: Test API calls return VideoItem[] with YouTube video keys
- **Dependencies**: Task 1
- **Estimated time**: 3 hours
- **Status**: Completed
- **Notes**: Implemented TMDBVideoService with methods for movies, TV shows, anime, and YouTube trailer fetching

Implement:
- `getTrendingMovies(page, genreId?)` → VideoItem[]
- `getPopularTVShows(page, genreId?)` → VideoItem[]
- `getAnimeContent(page, genreId?)` → VideoItem[]
- `getVideoTrailer(contentId, contentType)` → Extract YouTube key from TMDB `/movie/{id}/videos` endpoint
- Error handling and response transformation

**Important**:
- Return YouTube video keys (e.g., "dQw4w9WgXcQ") from TMDB API
- Do NOT attempt to extract direct stream URLs (violates YouTube ToS)
- Video player will use `react-native-youtube-iframe` for playback

---

#### Task 3: Create user interaction storage service ✅
- **Deliverable**: Service for storing and retrieving user interactions
- **Files**: `services/storage/interactions.ts`
- **Validation**: Write and read interactions successfully
- **Dependencies**: Task 1
- **Estimated time**: 2 hours
- **Parallel**: Can run in parallel with Task 2
- **Status**: Completed
- **Notes**: Implemented comprehensive interaction tracking for likes, favorites, shares, watch time, and user signals

Implement:
- `saveLike(videoId, isLiked)` → Promise<void>
- `saveFavorite(videoId, isFavorited)` → Promise<void>
- `getLikedVideos()` → Promise<string[]>
- `getFavoriteVideos()` → Promise<string[]>
- `saveSignal(signal)` → Promise<void>
- `getSignals(limit?)` → Promise<UserSignal[]>
- Use AsyncStorage with proper error handling

---

### Phase 2: Video Player Component

#### Task 4: Build basic VideoPlayer component ✅
- **Deliverable**: Video player component supporting YouTube content
- **Files**: `components/video/VideoPlayer.tsx`
- **Validation**: Video plays reliably with proper controls
- **Dependencies**: Install `react-native-youtube-iframe` dependency
- **Estimated time**: 4 hours
- **Status**: Completed
- **Notes**: Implemented YouTube iframe player with autoplay, mute controls, and state management

**Recommended Approach (YouTube videos from TMDB)**:
- Install: `npx expo install react-native-youtube-iframe react-native-webview`
- Use `react-native-youtube-iframe` for YouTube videos
- Props: `videoId` (YouTube key), `isActive`, `isMuted`, `onProgress`, `onError`

Features:
- Play/pause on active state change
- Mute/unmute toggle
- Progress tracking via `onChangeState` callback
- Error handling for blocked/unavailable videos
- Clean up resources on unmount

**Alternative Approach (Direct video URLs - if switching from YouTube)**:
- Use `expo-video` (modern, SDK 52+) or `expo-av` (legacy)
- Requires alternative video sources (Vimeo, direct MP4 URLs)
- Full UI control, no YouTube restrictions

Example implementation:
```tsx
import YoutubePlayer from 'react-native-youtube-iframe';

<YoutubePlayer
  height={400}
  videoId={youtubeVideoKey}
  play={isActive}
  mute={isMuted}
  onChangeState={handleStateChange}
  onError={handleError}
/>
```

---

#### Task 5: Implement video preloading logic ✅
- **Deliverable**: Optimized video loading strategy
- **Files**: `components/video/VideoPlayer.tsx`, `hooks/useVideoCache.ts`
- **Validation**: Smooth transitions between videos, efficient memory usage
- **Dependencies**: Task 4
- **Estimated time**: 2 hours
- **Status**: Completed
- **Notes**: Created useVideoCache hook with smart preloading and memory management for YouTube videos

**Note**: YouTube iframe players have limited preloading capabilities compared to native video.

Features:
- Cache YouTube video IDs for next 3 videos
- Prefetch video metadata (thumbnail, title) for smooth UI
- For YouTube: Player initializes on viewport entry (cannot truly preload)
- For direct URLs (if using expo-video): Implement true preloading
- Memory management: Release off-screen players
- Strategy: Prioritize smooth UX over aggressive preloading

Implementation:
```tsx
const useVideoCache = (currentIndex: number, videos: VideoItem[]) => {
  // Cache next 2-3 video IDs and metadata
  // YouTube players can't be preloaded, but metadata can
  // Initialize player when video enters viewport
};
```

---

#### Task 6: Add video error handling and fallback UI ✅
- **Deliverable**: Error states for video loading failures
- **Files**: `components/video/VideoPlayer.tsx`, `components/video/VideoErrorFallback.tsx`
- **Validation**: Graceful degradation when video fails to load
- **Dependencies**: Task 4
- **Estimated time**: 2 hours
- **Status**: Completed
- **Notes**: Implemented comprehensive error handling with fallback UI showing poster and retry options

Features:
- Detect load failures (timeout, 404, blocked)
- Show fallback UI with poster image
- "Video unavailable" message
- "Watch on YouTube" button
- Allow continuing to next video

---

### Phase 3: Feed UI Components

#### Task 7: Create VideoFeedItem component ✅
- **Deliverable**: Individual video card with overlay UI
- **Files**: `components/feed/VideoFeedItem.tsx`
- **Validation**: Card displays video, title, and action buttons correctly
- **Dependencies**: Task 4, Task 6
- **Estimated time**: 4 hours
- **Status**: Completed
- **Notes**: Complete video card with player integration, overlay UI, and interaction buttons

Features:
- Integrate VideoPlayer
- Overlay with title, genre tags, action buttons
- Handle isActive prop to control playback
- Emit interaction events (like, favorite, share)
- Proper z-index layering for overlay elements

---

#### Task 8: Build GenreTagList component ✅
- **Deliverable**: Horizontal scrollable genre tag chips
- **Files**: `components/feed/GenreTagList.tsx`
- **Validation**: Tags display correctly and emit click events
- **Dependencies**: Task 1
- **Estimated time**: 2 hours
- **Parallel**: Can run in parallel with Task 7
- **Status**: Completed
- **Notes**: Horizontal scrollable tags with active state styling and click handling

Features:
- Render genre tags as chips
- Horizontal scroll if too many tags
- Handle onGenreClick event
- Visual highlight for active genre
- Maximum 3 tags displayed per video

---

#### Task 9: Implement ContentTypeTabs component ✅
- **Deliverable**: Tab bar for Movies/TV/Anime filtering
- **Files**: `components/feed/ContentTypeTabs.tsx`
- **Validation**: Tabs switch correctly, active state updates
- **Dependencies**: Task 1
- **Estimated time**: 2 hours
- **Parallel**: Can run in parallel with Tasks 7-8
- **Status**: Completed
- **Notes**: Tab bar with safe area support and animated indicator

Features:
- Three tabs: Movies, TV Shows, Anime
- Active tab visual indicator
- Handle tab press events
- Sticky positioning at top of screen
- Respect safe area insets

---

#### Task 10: Create VideoFeedList component ✅
- **Deliverable**: Vertical scrollable list managing video cards
- **Files**: `components/feed/VideoFeedList.tsx`, `hooks/useViewportDetection.ts`
- **Validation**: Smooth scrolling, only one video plays at a time
- **Dependencies**: Task 7
- **Estimated time**: 5 hours
- **Status**: Completed
- **Notes**: Complete FlatList implementation with viewport detection and infinite scroll

Features:
- FlatList with vertical paging
- Viewport detection (viewabilityConfig)
- Track which video is active (>50% visible)
- Snap to center after scroll
- Infinite scroll with onEndReached
- Performance optimizations (windowSize, removeClippedSubviews)
- Pass isActive prop to correct VideoFeedItem

---

### Phase 4: Main Screen Integration

#### Task 11: Build FeedScreen container
- **Deliverable**: Main feed screen coordinating all components
- **Files**: `app/(tabs)/index.tsx`, `hooks/useFeedData.ts`
- **Validation**: Full feed works end-to-end
- **Dependencies**: Tasks 2, 9, 10
- **Estimated time**: 4 hours

Features:
- State management for contentType, selectedGenre, videos
- Custom hook `useFeedData(contentType, genre)` to fetch videos
- Render ContentTypeTabs
- Render VideoFeedList
- Handle tab switching (reset feed to top)
- Handle genre filtering
- Loading and error states

---

#### Task 12: Wire up user interactions (like, favorite, share)
- **Deliverable**: Functional interaction buttons
- **Files**: `app/(tabs)/index.tsx`, update existing components
- **Validation**: Interactions persist, UI updates correctly
- **Dependencies**: Task 3, Task 11
- **Estimated time**: 3 hours

Features:
- Like button toggles and persists state
- Favorite button toggles and persists state
- Share button opens native share sheet
- Load initial interaction states from storage
- Update UI immediately on interaction
- Haptic feedback (iOS)
- Toast notifications for favorites

---

#### Task 13: Implement watch progress tracking
- **Deliverable**: Background tracking of watch time and user signals
- **Files**: `hooks/useProgressTracking.ts`, update FeedScreen
- **Validation**: Signals are recorded correctly in storage
- **Dependencies**: Task 3, Task 11
- **Estimated time**: 3 hours

Features:
- Track watch time per video
- Calculate watch percentage
- Detect quick swipes (<2s)
- Detect engaged views (>10s)
- Detect complete views (>80%)
- Store signals with appropriate weights
- Asynchronous storage (non-blocking)

---

### Phase 5: Content Filtering & Polish

#### Task 14: Implement genre-based filtering logic ✅
- **Deliverable**: Genre tag clicks filter the feed
- **Files**: `hooks/useFeedData.ts`, `hooks/useGenreFilter.ts`
- **Validation**: Clicking genre filters content correctly
- **Dependencies**: Task 8, Task 11
- **Estimated time**: 2 hours
- **Status**: Completed
- **Notes**: Complete genre filtering system with TMDB API integration

Features:
- Handle genre tag click events
- Update selectedGenre state
- Re-fetch videos with genre filter
- Highlight active genre tag
- Clear filter on second click
- Preserve content type when filtering

---

#### Task 15: Add content type preference persistence ✅
- **Deliverable**: Remember last viewed content type
- **Files**: `services/storage/preferences.ts`
- **Validation**: Content type persists across app restarts
- **Dependencies**: Task 11
- **Estimated time**: 1 hour
- **Parallel**: Can run in parallel with Task 14
- **Status**: Completed
- **Notes**: Complete preferences service with content type persistence

Features:
- Save contentType to AsyncStorage on change
- Load saved contentType on app start
- Default to "Movies" if no saved preference

---

#### Task 16: Implement loading and empty states ✅
- **Deliverable**: Proper UI for loading and no-content scenarios
- **Files**: `components/feed/FeedLoadingState.tsx`, `components/feed/FeedEmptyState.tsx`
- **Validation**: States display correctly in different scenarios
- **Dependencies**: Task 11
- **Estimated time**: 2 hours
- **Parallel**: Can run in parallel with Tasks 14-15
- **Status**: Completed
- **Notes**: Comprehensive loading and empty state components

Features:
- Initial loading spinner
- Infinite scroll loading indicator
- Empty state with message and retry button
- Error state with retry button
- No results for genre filter state

---

### Phase 6: Testing & Optimization

#### Task 17: Performance optimization and testing
- **Deliverable**: Smooth 60 FPS scrolling and quick video transitions
- **Files**: Update VideoFeedList, VideoPlayer as needed
- **Validation**: Performance benchmarks met
- **Dependencies**: All previous tasks
- **Estimated time**: 4 hours

Optimizations:
- Profile FPS during scrolling
- Optimize re-render cycles (React.memo, useMemo)
- Test video transition speed (<500ms)
- Test memory usage (<200MB)
- Fix any performance bottlenecks

---

#### Task 18: Integration testing of user flows
- **Deliverable**: Verified end-to-end user flows work correctly
- **Files**: None (testing task)
- **Validation**: All test scenarios pass
- **Dependencies**: All previous tasks
- **Estimated time**: 3 hours

Test scenarios:
- Open app → watch videos → swipe through 10+ videos
- Like, favorite, share actions
- Switch content types (Movies → TV → Anime)
- Filter by genre
- Video error handling (simulate blocked video)
- App restart preserves favorites and content type

---

#### Task 19: Accessibility and polish
- **Deliverable**: Accessible UI with proper feedback
- **Files**: Update all components
- **Validation**: VoiceOver navigation works, haptics feel good
- **Dependencies**: All previous tasks
- **Estimated time**: 2 hours

Features:
- Add accessibility labels to all buttons
- Test VoiceOver navigation
- Ensure text contrast meets WCAG standards
- Add haptic feedback where missing
- Polish animations and transitions
- Safe area handling for all devices

---

## Summary

**Total estimated time**: ~47 hours (~6 days with 8-hour workdays)

**Parallelizable tasks**: Tasks 2 & 3, Tasks 7 & 8 & 9, Tasks 14 & 15 & 16

**Critical path**: Tasks 1 → 2 → 4 → 7 → 10 → 11 → 17 → 18

**Testing checkpoints**:
- After Task 6: Video player works in isolation
- After Task 10: Feed scrolling works with mock data
- After Task 13: Tracking is recording correctly
- After Task 18: Full integration testing

**Rollback safety**: Each task is independently testable and can be reverted without breaking other completed tasks.
