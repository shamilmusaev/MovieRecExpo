# Spec: Video Playback

## Overview
Defines video playback functionality including autoplay, preloading, error handling, and playback controls.

---

## ADDED Requirements

### Requirement: Automatic video playback
The system SHALL play videos automatically when they become visible in the viewport.

#### Scenario: Video autoplays when visible
- **Given** a video card enters the viewport (>50% visible)
- **When** the video becomes the active item
- **Then** the video begins playing automatically
- **And** the previous video stops playing
- **And** only one video plays at a time

#### Scenario: Video pauses when scrolled away
- **Given** a video is currently playing
- **When** the user swipes to the next video
- **Then** the playing video pauses immediately
- **And** playback position is maintained
- **And** the new video begins playing

---

### Requirement: Video preloading
The system SHALL preload the next video for instant playback.

#### Scenario: Next video preloads in background
- **Given** a video is currently playing
- **When** the video has been playing for at least 2 seconds
- **Then** the next video in the feed starts preloading
- **And** preloading happens in the background without affecting current playback
- **And** preloaded video is ready for instant playback

#### Scenario: Memory management for preloaded videos
- **Given** multiple videos have been preloaded
- **When** a video moves more than 2 positions away from the current video
- **Then** its preloaded data is released from memory
- **And** the app maintains maximum 3 video instances in memory
- **And** memory usage stays below 200MB

---

### Requirement: Mute/unmute control
The system SHALL allow users to toggle audio on/off for videos.

#### Scenario: Videos start muted by default
- **Given** a new video begins playing
- **Then** the video is muted by default
- **And** a mute indicator icon is visible
- **And** the device's Silent mode setting is respected

#### Scenario: User toggles mute state
- **Given** a video is playing muted
- **When** the user taps on the video player area
- **Then** the video unmutes
- **And** the mute indicator icon changes to show unmuted state
- **And** subsequent videos maintain the user's mute preference

---

### Requirement: Video error handling
The system SHALL gracefully handle video loading failures.

#### Scenario: Video fails to load
- **Given** a video URL is unavailable or blocked
- **When** the video player attempts to load it
- **Then** a fallback UI is displayed showing the movie poster
- **And** an error message "Video unavailable" is shown
- **And** a "Watch on YouTube" button is provided
- **And** user can still swipe to next video

#### Scenario: Network timeout during playback
- **Given** a video is buffering
- **When** network request times out after 10 seconds
- **Then** an error state is shown with retry option
- **And** the retry button reloads the video
- **And** if retry succeeds, playback resumes from beginning

#### Scenario: Multiple consecutive failures
- **Given** 3 videos in a row fail to load
- **When** the third failure occurs
- **Then** a generic error message is shown suggesting checking internet connection
- **And** an option to refresh the entire feed is provided
- **And** user can still navigate through other videos

---

### Requirement: Playback performance
The system SHALL ensure video playback is smooth and performant.

#### Scenario: Smooth video transitions
- **Given** the user swipes from one video to another
- **When** the next video begins playing
- **Then** the transition happens within 500ms
- **And** no frame drops or stuttering occur
- **And** the app maintains 60 FPS during transition

#### Scenario: Background audio handling
- **Given** user is listening to music from another app
- **When** a video starts playing unmuted in CineSwipe
- **Then** the background music pauses
- **And** when video is muted again, background music can resume
- **And** phone calls properly interrupt video playback

---

### Requirement: Video player controls
The system SHALL provide basic playback controls accessible to users.

#### Scenario: Pause/resume on tap
- **Given** a video is playing
- **When** the user taps anywhere on the video
- **Then** the video pauses if playing
- **Or** the video resumes if paused
- **And** a play/pause icon briefly appears as feedback
- **And** the icon fades after 1 second

#### Scenario: Video restarts on revisit
- **Given** the user has swiped past a video
- **When** the user swipes back to that video
- **Then** the video restarts from the beginning
- **And** the video plays automatically
- **And** previous watch progress is recorded

---

### Requirement: Video source integration
The system SHALL fetch videos from TMDB API and play them via YouTube.

#### Scenario: Fetch trailer from TMDB
- **Given** a movie/show item from the feed
- **When** the video player needs to load the trailer
- **Then** the app requests video data from TMDB `/movie/{id}/videos` endpoint
- **And** selects the first "Trailer" or "Teaser" type video
- **And** extracts the YouTube video key
- **And** constructs a playable YouTube URL

#### Scenario: Fallback to poster if no trailer
- **Given** a movie has no trailers in TMDB
- **When** the video player attempts to load
- **Then** the fallback UI is shown with the movie poster
- **And** other metadata (title, genres) are still displayed
- **And** user can interact with buttons (like, favorite, share)

---

## MODIFIED Requirements

_No existing requirements are modified by this spec._

---

## REMOVED Requirements

_No existing requirements are removed by this spec._
