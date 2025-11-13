# Spec: Video Feed UI

## Overview
Defines the user interface and layout for the vertical video feed, including the main container, scrolling behavior, and visual hierarchy.

---

## ADDED Requirements

### Requirement: Vertical scrolling video feed
The system SHALL provide a vertical scrolling interface for browsing video content.

#### Scenario: User views the main feed
- **Given** the user opens the app
- **When** the main feed screen loads
- **Then** a vertical list of video cards is displayed
- **And** the first video is visible and centered on screen
- **And** user can swipe up to see next video or down to see previous video

#### Scenario: User scrolls through multiple videos
- **Given** the user is viewing the main feed
- **When** the user swipes up repeatedly
- **Then** each video transitions smoothly to the next
- **And** videos snap to center of screen after scroll ends
- **And** only one video is fully visible at a time

---

### Requirement: Content type tab navigation
The system SHALL allow users to filter content by type (Movies, TV Shows, Anime).

#### Scenario: User switches content type
- **Given** the user is viewing the Movies feed
- **When** the user taps the "TV Shows" tab
- **Then** the feed refreshes with TV show content
- **And** the active tab indicator moves to "TV Shows"
- **And** the previous scroll position resets to the top

#### Scenario: Content type tabs are visible
- **Given** the user is on the main feed screen
- **Then** three tabs are visible at the top: "Movies", "TV Shows", "Anime"
- **And** the currently active tab is visually highlighted
- **And** tabs are always accessible during scrolling

---

### Requirement: Video card layout
The system SHALL display video cards with essential information in a consistent layout.

#### Scenario: Video card displays metadata
- **Given** a video is visible in the feed
- **Then** the video player occupies the full screen height
- **And** the movie title is overlaid at the bottom-left
- **And** genre tags are displayed below the title
- **And** action buttons (like, favorite, share) are positioned on the right side
- **And** all overlay elements have sufficient contrast for readability

#### Scenario: Smooth visual transitions
- **Given** the user swipes between videos
- **When** transitioning from one card to another
- **Then** the transition animation lasts no more than 300ms
- **And** overlay elements fade in smoothly on the new video
- **And** no visual glitches or flickering occur

---

### Requirement: Loading states
The system SHALL provide visual feedback during content loading.

#### Scenario: Initial feed load
- **Given** the user opens the app for the first time
- **When** video data is being fetched
- **Then** a loading indicator is displayed
- **And** the indicator is centered on screen
- **And** no video cards are shown until data arrives

#### Scenario: Infinite scroll loading
- **Given** the user has scrolled through 8 videos
- **When** the user approaches the end of loaded content
- **Then** more videos are fetched automatically
- **And** a subtle loading indicator appears at the bottom
- **And** scrolling is not interrupted during loading

---

### Requirement: Empty state handling
The system SHALL gracefully handle scenarios with no content.

#### Scenario: No videos available
- **Given** the TMDB API returns no videos for selected filters
- **When** the feed attempts to load
- **Then** an empty state message is displayed
- **And** the message suggests adjusting filters or trying again
- **And** a retry button is provided

#### Scenario: All content filtered out
- **Given** the user has selected a very specific genre filter
- **When** no videos match the criteria
- **Then** an informative message explains why no results are shown
- **And** an option to clear filters is provided

---

### Requirement: Responsive layout
The system SHALL adapt the UI to different screen sizes and orientations.

#### Scenario: Portrait orientation (primary)
- **Given** the device is in portrait mode
- **Then** each video card fills the screen vertically
- **And** the aspect ratio is 9:16 (vertical video format)
- **And** all UI elements are properly positioned

#### Scenario: Safe area handling
- **Given** the device has notches or system UI (like iPhone X+)
- **When** displaying the feed
- **Then** content respects safe area insets
- **And** tab bar is positioned within safe area
- **And** no UI elements are obscured by notch or home indicator

---

## MODIFIED Requirements

_No existing requirements are modified by this spec._

---

## REMOVED Requirements

_No existing requirements are removed by this spec._
