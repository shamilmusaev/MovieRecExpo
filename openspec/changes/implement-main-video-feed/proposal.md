# Proposal: Implement Main Video Feed

## Summary

Implement the core vertical video feed functionality for CineSwipe, allowing users to discover movies, TV shows, and anime through short trailers in a TikTok-style interface. This includes video playback with autoplay, swipe navigation, content type filtering, basic interaction buttons (like, favorite, share), genre tags, and watch progress tracking.

## Problem Statement

Currently, the app only has placeholder screens. Users need a functional main feed where they can:
- Watch short trailers/teasers of movies, TV shows, and anime
- Swipe vertically to navigate between videos
- Filter content by type (movies, TV shows, anime)
- Interact with content (like, favorite, share)
- See genre information for each title
- Experience smooth playback with proper preloading and error handling

## Proposed Solution

Build a vertical video feed screen that:
1. Fetches content from TMDB API based on user preferences and content type filters
2. Displays videos in a vertical scrollable list with one active player at a time
3. Provides content type tabs (Movies, TV Shows, Anime) for filtering
4. Shows interactive UI overlay with title, genre tags, and action buttons
5. Implements video preloading for smooth transitions
6. Tracks user behavior (watch time, likes, swipes) for future recommendation improvements
7. Handles video loading errors gracefully with fallback UI

### User Flow

1. User opens app and lands on the main feed (default: Movies tab)
2. Video auto-plays with sound muted by default
3. User can:
   - Swipe up/down to navigate between videos
   - Tap to toggle mute/unmute
   - Switch content type via tabs (Movies/TV Shows/Anime)
   - Click genre tags to filter by genre
   - Like the current video
   - Add to favorites
   - Share the title
   - Click on title to open detailed movie card
4. Next video preloads for instant playback
5. Progress tracking records user interactions for personalization

## Scope

### In Scope
- Vertical video feed UI component
- Video player with autoplay, mute/unmute
- Content type filtering (Movies, TV Shows, Anime)
- Genre tag display and interaction
- Action buttons (like, favorite, share)
- Video preloading mechanism
- Watch progress tracking
- Error handling and fallback UI
- Integration with TMDB API for video data
- Basic genre-based content filtering

### Out of Scope
- Advanced recommendation algorithm (will use simple genre-based filtering)
- User authentication/profiles
- Backend server integration
- Onboarding flow (separate proposal)
- Detailed movie card screen (separate proposal)
- Collections feature
- Search functionality
- Offline playback
- Custom video clips (only official trailers from TMDB)

## Dependencies

### Technical Dependencies
- TMDB API service (already implemented in `services/tmdb/`)
- **Expo AV for native video playback** (AVPlayer on iOS)
  - **Important**: Native player only, NO YouTube iframe embedding
  - Extract direct video stream URLs from YouTube
  - No YouTube UI/branding visible during playback
- YouTube stream extraction utility (e.g., ytdl-core compatible or server proxy)
- React Navigation for tab navigation
- AsyncStorage/MMKV for storing user interactions

### Proposal Dependencies
- None (this is a foundational feature)

### External Dependencies
- TMDB API availability and rate limits
- YouTube video availability (some videos may be region-blocked)

## Success Criteria

- Users can swipe through at least 10 videos without encountering lag or stuttering
- Video transitions happen within 500ms
- No crashes when videos fail to load
- Like, favorite, and share actions persist correctly
- Genre filtering works accurately
- Content type tabs switch smoothly
- Watch time is tracked accurately for future recommendations

## Risks and Mitigation

### Risk: YouTube video blocking/unavailability
**Mitigation**: Implement fallback UI showing poster image with message and option to open on YouTube

### Risk: Performance issues with video preloading
**Mitigation**: Only preload next video, implement resource cleanup on scroll

### Risk: TMDB API rate limiting
**Mitigation**: Implement caching layer, batch requests efficiently

### Risk: Poor UX on slow connections
**Mitigation**: Show loading indicators, allow browsing with delayed playback

## Timeline Estimate

- Video feed UI: 2 days
- Video player integration: 2 days
- Content filtering and tabs: 1 day
- Genre tags and interactions: 1 day
- Progress tracking: 1 day
- Testing and refinement: 2 days

**Total**: ~9 days

## Open Questions

- Should genre tag clicks navigate to a filtered feed or just update current feed?
  - **Decision**: Update current feed with genre filter
- How many videos should we preload ahead?
  - **Decision**: Only 1 video ahead to conserve memory
- What's the default content type on first load?
  - **Decision**: Movies (most universal content type)
