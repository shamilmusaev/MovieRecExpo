# Design: Main Video Feed

## Architecture Overview

The main video feed follows a component-based architecture with clear separation between presentation and logic layers.

```
┌─────────────────────────────────────┐
│      FeedScreen (Container)         │
│  - Manages content type state       │
│  - Handles tab switching            │
│  - Coordinates child components     │
└───────────┬─────────────────────────┘
            │
            ├──────────────────────────┐
            │                          │
┌───────────▼──────────┐   ┌──────────▼────────────┐
│  ContentTypeTabs     │   │  VideoFeedList        │
│  - Movies/TV/Anime   │   │  - Vertical FlatList  │
│  - Active indicator  │   │  - Viewport detection │
└──────────────────────┘   │  - Scroll handling    │
                            └──────────┬────────────┘
                                       │
                            ┌──────────▼────────────┐
                            │  VideoFeedItem        │
                            │  - Single video card  │
                            └──────────┬────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
        ┌───────────▼──────┐  ┌────────▼────────┐  ┌─────▼──────────┐
        │  VideoPlayer     │  │  VideoOverlay   │  │  GenreTagList  │
        │  - Playback      │  │  - Title        │  │  - Tag chips   │
        │  - Controls      │  │  - Actions      │  │  - Click       │
        │  - Preloading    │  │  - Share        │  │    handlers    │
        └──────────────────┘  └─────────────────┘  └────────────────┘
```

## Component Design

### 1. FeedScreen (Container)
**Responsibility**: Main screen container managing content type filtering and layout

**State**:
- `contentType`: 'movie' | 'tv' | 'anime'
- `selectedGenres`: number[] (for genre filtering)
- `feedData`: VideoItem[]
- `isLoading`: boolean

**Key Methods**:
- `handleContentTypeChange(type)`: Switch between movies/TV/anime
- `handleGenreFilter(genreId)`: Filter by genre
- `loadMoreContent()`: Infinite scroll pagination

### 2. VideoFeedList
**Responsibility**: Manages vertical scrolling and viewport detection

**Props**:
- `videos`: VideoItem[]
- `onViewableItemsChanged`: callback for tracking visible video
- `onEndReached`: callback for pagination

**Features**:
- Only one video plays at a time (viewport-based)
- Implements `viewabilityConfig` to detect when video is >50% visible
- Handles memory management (unmount off-screen players)

### 3. VideoFeedItem
**Responsibility**: Individual video card with player and overlay

**Props**:
- `video`: VideoItem
- `isActive`: boolean (is this video in viewport?)
- `onLike`: callback
- `onFavorite`: callback
- `onShare`: callback
- `onGenreClick`: callback
- `onProgressUpdate`: callback

**State**:
- `isMuted`: boolean
- `watchProgress`: number (0-100%)
- `hasError`: boolean

### 4. VideoPlayer
**Responsibility**: Video playback with optimal approach for content source

**Implementation Options**:

#### **Option A: YouTube Videos (Recommended for TMDB trailers)**
- Uses `react-native-youtube-iframe` for YouTube content
- ✅ Compliant with YouTube ToS
- ✅ Reliable playback
- ⚠️ YouTube branding visible (required by YouTube)

#### **Option B: Direct Video URLs (Alternative)**
- Uses `expo-video` (modern API, SDK 52+) or `expo-av` (legacy)
- Requires alternative video sources (not YouTube)
- Full control over UI and playback

**Props**:
- `videoSource`: { type: 'youtube', videoId: string } | { type: 'direct', url: string }
- `isActive`: boolean
- `isMuted`: boolean
- `onProgressUpdate`: (progress: number) => void
- `onError`: () => void

**Features**:
- Auto-play when `isActive` = true
- Pause when `isActive` = false
- Smart preloading based on video source type
- Resource cleanup on unmount
- Native video player for direct URLs (AVPlayer on iOS, ExoPlayer on Android)

**Modern API Example (expo-video)**:
```tsx
import { useVideoPlayer, VideoView } from 'expo-video';

const player = useVideoPlayer(videoSource, player => {
  player.loop = false;
  player.muted = isMuted;
  if (isActive) player.play();
});
```

### 5. VideoOverlay
**Responsibility**: UI overlay with title, actions, and metadata

**Layout**:
```
┌─────────────────────────────┐
│                             │
│  [Content Type Tabs]        │ ← Top
│                             │
│                             │
│         (Video)             │
│                             │
│                             │
│  Movie Title                │ ← Bottom Left
│  [Genre] [Genre] [Genre]    │
│                             │
│  ┌──┐ ┌──┐ ┌──┐            │ ← Right Side
│  │♥ │ │★ │ │⇧ │            │   (Like/Fav/Share)
│  └──┘ └──┘ └──┘            │
└─────────────────────────────┘
```

**Actions**:
- Like button (filled/unfilled heart)
- Favorite button (filled/unfilled star)
- Share button (opens native share sheet)

### 6. GenreTagList
**Responsibility**: Display clickable genre chips

**Props**:
- `genres`: Genre[]
- `onGenreClick`: (genreId: number) => void

**Behavior**:
- Horizontal scrollable list if too many genres
- Click filters feed to that genre
- Visual indicator for active genre filter

## Data Flow

### Video Loading Flow
```
1. User opens app
   ↓
2. FeedScreen requests videos from TMDB service
   ↓
3. TMDBService.getTrendingMovies(page=1)
   ↓
4. For each movie, fetch trailer URL
   ↓
5. Transform to VideoItem format
   ↓
6. Pass to VideoFeedList
   ↓
7. Render first VideoFeedItem (isActive=true)
   ↓
8. VideoPlayer begins playback
   ↓
9. Preload next video in background
```

### Interaction Flow
```
User swipes up
   ↓
FeedList detects viewable item change
   ↓
Update previous VideoFeedItem (isActive=false) → pause
   ↓
Update current VideoFeedItem (isActive=true) → play
   ↓
Track watch time of previous video
   ↓
Preload next video
```

### Genre Filter Flow
```
User clicks genre tag
   ↓
Call onGenreClick(genreId)
   ↓
Update selectedGenres state
   ↓
Fetch new videos filtered by genre
   ↓
Reset feed to page 1
   ↓
Update VideoFeedList data
```

## State Management

### Local State (useState)
- Component-specific UI state (muted, playing)
- Form inputs

### Context API (Future)
- User preferences (onboarding genres)
- Favorites list
- Watch history

### Service Layer
- TMDB API client
- Video caching
- User interaction storage

## Video Preloading Strategy

**Goal**: Next video should be ready to play instantly

**Approach**:
1. When video N becomes active:
   - Play video N
   - Preload video N+1 (download but don't play)
2. When user swipes to video N+1:
   - Video N+1 plays instantly (already loaded)
   - Preload video N+2
3. When scrolling backwards:
   - No preloading needed (already played videos stay in memory)

**Memory Management**:
- Keep max 3 videos in memory (current, next, previous)
- Unload videos that are >2 positions away from current

## Error Handling

### Video Load Failure
```
Try to load video
   ↓
If error
   ↓
Show fallback UI:
  - Movie poster
  - Title
  - "Video unavailable" message
  - "Watch on YouTube" button
   ↓
Allow user to continue swiping
```

### API Failure
```
Try to fetch videos
   ↓
If error
   ↓
Show error state with retry button
   ↓
If retry fails 3 times
   ↓
Show fallback to cached/popular content
```

### No Internet
```
Detect no connection
   ↓
Show offline message
   ↓
Allow browsing cached favorites
   ↓
Disable video playback
```

## Performance Optimizations

1. **FlatList Optimization**
   - `windowSize={3}`: Only render 3 screens worth of items
   - `maxToRenderPerBatch={2}`: Render 2 items per batch
   - `removeClippedSubviews={true}`: Unmount off-screen items

2. **Video Player**
   - Use native player (Expo AV)
   - Implement `shouldComponentUpdate` to prevent unnecessary re-renders
   - Cleanup resources on unmount

3. **Image Loading**
   - Use `expo-image` with caching
   - Load low-res poster while video loads

4. **Memoization**
   - Memoize expensive genre mapping operations
   - Use `React.memo` for pure components

## Accessibility

- VoiceOver support for all buttons
- Proper ARIA labels for video controls
- Keyboard navigation support (for future web version)
- Sufficient color contrast for text overlays
- Haptic feedback on interactions (iOS)

## Platform Considerations

### iOS
- **Native video playback** via AVPlayer (expo-video) or AVFoundation (expo-av)
- Handle audio session interruptions (calls, notifications)
- Respect device Silent mode and audio routing
- Support picture-in-picture (future enhancement)
- Test with various network conditions

### Future Android Support
- Use ExoPlayer for native playback
- Handle back button navigation properly
- Respect system volume controls
- Support Android TV (future)

## Video Source Strategy

### YouTube Videos (TMDB Trailers)

**Reality Check**: Direct YouTube stream extraction is **not recommended**:
- ❌ Violates YouTube Terms of Service
- ❌ Unreliable - URLs expire, extraction methods break frequently
- ❌ No React Native libraries support this reliably
- ❌ Requires constant maintenance

**Recommended Approach**:
1. Get YouTube video key from TMDB API (`/movie/{id}/videos` endpoint)
2. Use `react-native-youtube-iframe` component:
   ```tsx
   import YoutubePlayer from 'react-native-youtube-iframe';

   <YoutubePlayer
     height={300}
     videoId={youtubeVideoKey}
     play={isActive}
     onChangeState={handleStateChange}
   />
   ```
3. Accept YouTube branding as part of the experience (required by ToS)

**Alternative Approach (Non-YouTube Sources)**:
1. Find alternative trailer sources with direct MP4 URLs:
   - Vimeo API (provides direct video URLs)
   - Self-hosted trailers
   - Other video CDNs with direct streaming
2. Use `expo-video` (modern) or `expo-av` (legacy) for full UI control:
   ```tsx
   // Modern expo-video approach
   import { useVideoPlayer, VideoView } from 'expo-video';

   const player = useVideoPlayer(videoUrl, player => {
     player.muted = isMuted;
     if (isActive) player.play();
   });

   return <VideoView player={player} style={styles.video} />;
   ```

**Constraints**:
- If using YouTube: YouTube branding/controls are **required** (ToS compliance)
- If using direct URLs: Full UI control, but need alternative video sources
- Choose based on project priorities: UX control vs. content availability

## Testing Strategy

### Unit Tests
- TMDB service functions
- Data transformation utilities
- Genre filtering logic

### Integration Tests
- Video feed rendering
- Swipe navigation
- Content type switching
- API error handling

### E2E Tests
- Complete user flow: open app → watch videos → like → favorite
- Genre filtering
- Video preloading
- Error recovery

### Performance Tests
- FPS during scrolling (target: 60 FPS)
- Memory usage (should stay <200MB)
- Video load time (<500ms)
