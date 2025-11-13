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
**Responsibility**: Native video playback without YouTube UI

**Implementation**:
- Uses **Expo AV** or **react-native-video** for native playback
- Extracts direct video stream URLs from YouTube (no iframe embedding)
- Custom overlay controls only (no YouTube branding/UI)
- Full-screen native video rendering

**Props**:
- `videoUrl`: string (direct stream URL, not YouTube embed)
- `isActive`: boolean
- `isMuted`: boolean
- `onProgressUpdate`: (progress: number) => void
- `onError`: () => void

**Features**:
- Auto-play when `isActive` = true
- Pause when `isActive` = false
- Preload next video in background
- Resource cleanup on unmount
- Native video player (AVPlayer on iOS)
- No YouTube UI elements visible

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
- **Use native video player (AVPlayer via Expo AV)**
- **NO YouTube iframe embedding** - extract direct stream URLs instead
- Handle audio session interruptions (calls, notifications)
- Respect device Silent mode
- Support picture-in-picture (future)

### Future Android Support
- Use ExoPlayer (native player)
- Handle back button navigation
- Respect system volume controls

### YouTube Stream Extraction

**Critical**: Videos MUST play natively without YouTube UI/branding.

**Approach**:
1. Get YouTube video key from TMDB API
2. Extract direct video stream URL using one of:
   - `ytdl-core` compatible library for React Native
   - `react-native-youtube-iframe` with stream extraction
   - Server-side proxy to extract stream URLs
3. Pass stream URL to Expo Video/AVPlayer
4. Render full-screen native video

**Important constraints**:
- No YouTube logo visible
- No YouTube controls (play/pause/seek bar)
- No "Watch on YouTube" watermark during playback
- Only custom app overlay with title, genres, and action buttons
- Video appears as native app content, not embedded web content

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
