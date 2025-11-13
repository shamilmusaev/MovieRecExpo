# Spec: Progress Tracking

## Overview
Defines watch progress tracking and user behavior signal collection for future recommendation improvements.

---

## ADDED Requirements

### Requirement: Watch time tracking
The system SHALL track how long users watch each video.

#### Scenario: Record video watch duration
- **Given** a video begins playing
- **When** the video plays for any duration
- **Then** the watch time is tracked in milliseconds
- **And** the timer starts when video enters viewport
- **And** the timer stops when video exits viewport or pauses

#### Scenario: Calculate watch percentage
- **Given** a video has a total duration of 120 seconds
- **When** the user watches 60 seconds before swiping away
- **Then** the watch percentage is calculated as 50%
- **And** both absolute time (60s) and percentage (50%) are stored
- **And** the data is saved to local storage

#### Scenario: Track multiple viewing sessions
- **Given** a user previously watched 30% of a video
- **When** the user scrolls back and watches another 20%
- **Then** only the most recent viewing session is recorded
- **And** the previous 30% session is overwritten
- **And** each video has one watch record per user

---

### Requirement: Swipe behavior tracking
The system SHALL differentiate between quick swipes and engaged viewing.

#### Scenario: Quick swipe detected
- **Given** a video enters the viewport
- **When** the user swipes away in less than 2 seconds
- **Then** the interaction is classified as "quick_swipe"
- **And** a negative signal weight is assigned (-0.5)
- **And** the video's genres receive lower priority in future recommendations

#### Scenario: Engaged viewing detected
- **Given** a video is playing
- **When** the user watches for more than 10 seconds
- **Then** the interaction is classified as "engaged_view"
- **And** a positive signal weight is assigned (+1.0)
- **And** the video's genres receive higher priority

#### Scenario: Complete view detected
- **Given** a video is playing
- **When** the user watches at least 80% of the video
- **Then** the interaction is classified as "complete_view"
- **And** a strong positive signal weight is assigned (+2.0)
- **And** similar movies are prioritized in the feed

---

### Requirement: Interaction signal collection
The system SHALL capture user interactions as recommendation signals.

#### Scenario: Like action signal
- **Given** the user likes a video
- **When** the like is recorded
- **Then** a "like" signal is created with weight +1.5
- **And** the signal includes timestamp, video ID, and genre IDs
- **And** the signal is stored in user behavior history

#### Scenario: Favorite action signal
- **Given** the user adds a video to favorites
- **When** the favorite is saved
- **Then** a "favorite" signal is created with weight +3.0 (strongest signal)
- **And** the signal includes all movie metadata
- **And** the movie's genres are heavily weighted for future recommendations

#### Scenario: Share action signal
- **Given** the user shares a video
- **When** the share action completes
- **Then** a "share" signal is created with weight +2.0
- **And** the signal indicates strong positive interest
- **And** similar content is prioritized

---

### Requirement: Recommendation signal aggregation
The system SHALL aggregate signals to influence future content recommendations.

#### Scenario: Calculate genre preferences
- **Given** the user has watched 20 videos over time
- **When** recommendation logic runs
- **Then** genre preference scores are calculated by summing signal weights per genre
- **And** genres with highest scores are prioritized in feed
- **And** scores decay over time (older signals have less weight)

#### Scenario: Avoid repetition based on signals
- **Given** the user has completed or favorited a video
- **When** the feed fetches new content
- **Then** that specific video is excluded from future feed results
- **And** the video ID is added to "seen" list
- **And** the seen list persists in local storage

---

### Requirement: Signal data storage
The system SHALL persist all tracking data locally for future use.

#### Scenario: Store signals in AsyncStorage
- **Given** any user interaction signal is created
- **When** the signal is recorded
- **Then** the signal is serialized to JSON
- **And** the signal is appended to the signals array in AsyncStorage
- **And** storage is updated asynchronously without blocking UI

#### Scenario: Retrieve signal history
- **Given** signals have been stored over multiple sessions
- **When** the recommendation system needs signal data
- **Then** all signals are loaded from AsyncStorage
- **And** signals are parsed from JSON
- **And** invalid or corrupted signals are filtered out

#### Scenario: Signal data structure
- **Given** any signal is created
- **Then** it contains the following fields:
  - `type`: 'like' | 'favorite' | 'share' | 'quick_swipe' | 'engaged_view' | 'complete_view'
  - `weight`: number (signal strength)
  - `timestamp`: ISO timestamp
  - `videoId`: TMDB movie/show ID
  - `genreIds`: array of genre IDs
  - `contentType`: 'movie' | 'tv' | 'anime'
  - `watchTime`: number (seconds watched)
  - `watchPercentage`: number (0-100)

---

### Requirement: Privacy and data management
The system SHALL respect privacy and allow user control over tracking data.

#### Scenario: Data stays local (MVP)
- **Given** the app is in MVP phase without backend
- **When** any tracking data is collected
- **Then** all data is stored only on the device
- **And** no data is transmitted to external servers
- **And** data is cleared when app is uninstalled

#### Scenario: Future: Clear history option
- **Given** user wants to reset recommendations
- **When** user triggers "Clear watch history" (future feature)
- **Then** all signal data is deleted from storage
- **And** genre preferences reset to onboarding selections
- **And** seen video list is cleared

_Note: User control features are planned post-MVP._

---

### Requirement: Performance of tracking
The system SHALL ensure tracking does not impact video playback performance.

#### Scenario: Asynchronous signal storage
- **Given** a user performs an interaction (like, swipe, etc.)
- **When** the signal is recorded
- **Then** storage operations happen asynchronously
- **And** the UI responds immediately without waiting
- **And** no frame drops occur during signal recording

#### Scenario: Efficient signal queries
- **Given** the feed needs to calculate recommendations
- **When** signal data is queried
- **Then** only relevant signals from the last 30 days are loaded
- **And** query completes in less than 100ms
- **And** feed rendering is not blocked

---

## MODIFIED Requirements

_No existing requirements are modified by this spec._

---

## REMOVED Requirements

_No existing requirements are removed by this spec._
