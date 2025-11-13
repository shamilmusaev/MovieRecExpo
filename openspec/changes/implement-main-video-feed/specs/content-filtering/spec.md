# Spec: Content Filtering

## Overview
Defines how users can filter feed content by type and genre, including the filtering logic and UI interactions.

---

## ADDED Requirements

### Requirement: Content type filtering
The system SHALL allow users to filter feed by content type (Movies, TV Shows, Anime).

#### Scenario: Default content type on app load
- **Given** the user opens the app for the first time
- **When** the main feed loads
- **Then** the "Movies" tab is active by default
- **And** the feed displays movie content
- **And** the selected content type is saved for next app open

#### Scenario: Switch to TV Shows
- **Given** the user is viewing Movies
- **When** the user taps the "TV Shows" tab
- **Then** the feed refreshes with TV show content
- **And** TV show trailers are fetched from TMDB `/tv/popular` endpoint
- **And** the feed resets to position 0
- **And** the content type preference is saved

#### Scenario: Switch to Anime
- **Given** the user is viewing any content type
- **When** the user taps the "Anime" tab
- **Then** the feed displays anime content
- **And** anime is fetched by filtering for "Animation" genre and Japanese origin language
- **And** the feed shows both anime movies and series

---

### Requirement: Genre-based filtering
The system SHALL allow users to filter content by genre using clickable genre tags.

#### Scenario: Genre tags display
- **Given** a video is visible in the feed
- **Then** genre tags are displayed below the title
- **And** each genre is shown as a clickable chip/button
- **And** genres are ordered by relevance
- **And** maximum 3 genre tags are shown per video

#### Scenario: User clicks genre tag
- **Given** a video with genre "Sci-Fi" is displayed
- **When** the user taps the "Sci-Fi" genre tag
- **Then** the feed filters to show only Sci-Fi content
- **And** the active genre is visually highlighted
- **And** the content type (Movies/TV/Anime) filter is maintained
- **And** feed resets to the top with filtered content

#### Scenario: Clear genre filter
- **Given** the feed is filtered by "Horror" genre
- **When** the user taps the active "Horror" tag again
- **Then** the genre filter is cleared
- **And** the feed shows all content for the current content type
- **And** the feed resets to the top

---

### Requirement: Combined filter logic
The system SHALL ensure content and genre filters work together correctly.

#### Scenario: Movies filtered by genre
- **Given** "Movies" tab is active and "Action" genre is selected
- **When** the feed loads content
- **Then** only action movies are displayed
- **And** the TMDB request includes both type=movie and genre=28 (Action ID)
- **And** results are sorted by popularity

#### Scenario: Switch content type preserves genre filter
- **Given** "Movies" tab with "Comedy" filter is active
- **When** the user switches to "TV Shows" tab
- **Then** the feed shows comedy TV shows
- **And** the genre filter remains active
- **And** the genre tag remains highlighted

---

### Requirement: User preference-based filtering
The system SHALL incorporate user's genre preferences from onboarding into feed content.

#### Scenario: Apply preferred genres (future)
- **Given** the user selected "Thriller" and "Drama" during onboarding
- **When** the unfiltered feed loads
- **Then** content is weighted towards Thriller and Drama genres
- **And** other genres are still shown but less frequently
- **And** this happens automatically without explicit genre filter

_Note: This scenario is marked as future enhancement. MVP will use simple genre filtering only._

---

### Requirement: Filter state persistence
The system SHALL remember filter selections across app sessions.

#### Scenario: Restore content type on app restart
- **Given** the user last viewed "Anime" tab
- **When** the user closes and reopens the app
- **Then** the feed loads with "Anime" tab active
- **And** the saved preference is loaded from AsyncStorage

#### Scenario: Genre filter is not persisted
- **Given** the user has a genre filter active
- **When** the user closes and reopens the app
- **Then** the genre filter is cleared
- **And** the feed shows all content for the saved content type
- **And** no genre tags are highlighted

---

### Requirement: Filtering performance
The system SHALL perform content filtering efficiently without blocking UI.

#### Scenario: Fast filter switching
- **Given** the user rapidly switches between content types
- **When** each tab is tapped
- **Then** the UI responds within 100ms
- **And** loading indicator is shown while fetching
- **And** previous fetch requests are cancelled
- **And** only the most recent filter request completes

#### Scenario: Cached filter results
- **Given** the user has previously loaded "Horror" movies
- **When** the user switches to "Horror" filter again within 5 minutes
- **Then** cached results are displayed instantly
- **And** a background refresh checks for new content
- **And** feed updates if new content is available

---

## MODIFIED Requirements

_No existing requirements are modified by this spec._

---

## REMOVED Requirements

_No existing requirements are removed by this spec._
