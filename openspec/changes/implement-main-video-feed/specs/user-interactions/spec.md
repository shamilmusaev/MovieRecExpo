# Spec: User Interactions

## Overview
Defines user interaction capabilities including like, favorite, share actions, and navigation to movie details.

---

## ADDED Requirements

### Requirement: Like functionality
The system SHALL allow users to like videos to signal positive interest.

#### Scenario: User likes a video
- **Given** a video is playing in the feed
- **When** the user taps the heart icon
- **Then** the heart icon fills with color (liked state)
- **And** a haptic feedback pulse occurs (iOS)
- **And** the like action is recorded locally
- **And** the like persists if user scrolls away and returns

#### Scenario: User unlikes a video
- **Given** a video is in liked state
- **When** the user taps the heart icon again
- **Then** the heart icon returns to outlined state (unliked)
- **And** the like record is removed
- **And** haptic feedback confirms the action

#### Scenario: Like state persists across sessions
- **Given** the user has liked 5 videos
- **When** the user closes and reopens the app
- **Then** all previously liked videos show filled heart icons
- **And** like data is loaded from AsyncStorage

---

### Requirement: Favorite functionality
The system SHALL allow users to save videos to their favorites list.

#### Scenario: Add to favorites
- **Given** a video is playing in the feed
- **When** the user taps the star icon
- **Then** the star icon fills with color (favorited state)
- **And** a haptic feedback pulse occurs
- **And** the movie is added to the favorites list
- **And** a brief toast notification confirms "Added to favorites"

#### Scenario: Remove from favorites
- **Given** a video is in favorited state
- **When** the user taps the star icon again
- **Then** the star icon returns to outlined state
- **And** the movie is removed from favorites list
- **And** a toast shows "Removed from favorites"

#### Scenario: View favorites list (future)
- **Given** the user has favorited several movies
- **When** the user navigates to Favorites screen
- **Then** all favorited movies are displayed in a list
- **And** user can play videos from favorites
- **And** user can remove items from favorites

_Note: Favorites screen is out of scope for this proposal but interaction is included._

---

### Requirement: Share functionality
The system SHALL allow users to share movie information.

#### Scenario: Share a movie
- **Given** a video is displayed in the feed
- **When** the user taps the share icon
- **Then** the native share sheet opens
- **And** the share content includes movie title and TMDB link
- **And** the share text format is: "{Movie Title} - Check out this movie on TMDB: {url}"

#### Scenario: Share to different platforms
- **Given** the native share sheet is open
- **When** the user selects a platform (Messages, WhatsApp, etc.)
- **Then** the movie link and title are shared correctly
- **And** the share sheet closes after sharing
- **And** the app returns to video feed

---

### Requirement: Navigate to movie details
The system SHALL allow users to view full movie information by tapping the title.

#### Scenario: Open movie detail screen
- **Given** a video is playing with visible title overlay
- **When** the user taps on the movie title
- **Then** the app navigates to the movie detail screen
- **And** the current video pauses
- **And** detailed movie information is displayed
- **And** user can return to feed via back button

#### Scenario: Resume feed after viewing details
- **Given** the user opened movie details from feed
- **When** the user taps back button
- **Then** the feed returns to the same video position
- **And** the video resumes playing
- **And** scroll position is maintained

_Note: Movie detail screen implementation is a separate proposal._

---

### Requirement: Swipe gestures
The system SHALL allow users to navigate the feed using swipe gestures.

#### Scenario: Swipe up to next video
- **Given** a video is currently playing
- **When** the user swipes up on the screen
- **Then** the feed scrolls to the next video
- **And** the next video begins playing
- **And** the previous video pauses
- **And** the transition is smooth and snaps to center

#### Scenario: Swipe down to previous video
- **Given** the user is not on the first video
- **When** the user swipes down
- **Then** the feed scrolls to the previous video
- **And** the previous video restarts from beginning
- **And** the transition animation is smooth

#### Scenario: Quick swipes (skip multiple videos)
- **Given** a video is playing
- **When** the user performs multiple rapid upward swipes
- **Then** each swipe advances to the next video
- **And** intermediate videos are skipped
- **And** only the final video in view plays
- **And** watch time for skipped videos is recorded as <1 second

---

### Requirement: Touch feedback and haptics
The system SHALL provide appropriate visual and haptic feedback for all interactions.

#### Scenario: Button press feedback
- **Given** any action button (like, favorite, share) is visible
- **When** the user taps the button
- **Then** the button scales slightly (press animation)
- **And** haptic feedback occurs immediately on touch
- **And** the animation completes in 150ms

#### Scenario: Mute toggle feedback
- **Given** a video is playing
- **When** the user taps to toggle mute
- **Then** a mute/unmute icon briefly appears at center screen
- **And** light haptic feedback confirms the action
- **And** the icon fades after 800ms

---

### Requirement: Interaction state management
The system SHALL track user interactions and reflect them correctly in UI.

#### Scenario: Multiple interactions on same video
- **Given** a video is playing
- **When** the user likes, favorites, and shares the video
- **Then** all three actions are recorded independently
- **And** each icon shows correct active state
- **And** actions are stored in separate data structures

#### Scenario: Interaction counts (future)
- **Given** a video has been interacted with
- **Then** interaction counts are not displayed (MVP)
- **And** data is collected for future features
- **And** total likes and favorites per video are tracked locally

_Note: Displaying interaction counts is a future enhancement._

---

## MODIFIED Requirements

_No existing requirements are modified by this spec._

---

## REMOVED Requirements

_No existing requirements are removed by this spec._
