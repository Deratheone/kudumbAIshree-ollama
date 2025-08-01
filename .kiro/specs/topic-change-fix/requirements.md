# Requirements Document

## Introduction

The KudumbAIshree chat application currently has a bug where changing the conversation topic during an active chat session doesn't take effect. The chat continues with the previous topic instead of switching to the newly selected topic. This feature will fix the topic change functionality to ensure that when users change the topic in settings, the chat immediately switches to use the new topic for subsequent AI-generated messages.

## Requirements

### Requirement 1

**User Story:** As a user, I want to change the conversation topic during an active chat session, so that the characters immediately start discussing the new topic instead of continuing with the old one.

#### Acceptance Criteria

1. WHEN a user changes the topic in settings during an active chat THEN the application SHALL immediately load and use the new topic for subsequent AI message generation
2. WHEN a user selects a custom topic during an active chat THEN the application SHALL immediately switch to using the custom topic text
3. WHEN a user switches from custom topic to a predefined topic during an active chat THEN the application SHALL immediately load and use the selected predefined topic
4. WHEN a user switches to random topic during an active chat THEN the application SHALL immediately fetch and use a new random topic from the backend

### Requirement 2

**User Story:** As a user, I want the topic display to update immediately when I change topics, so that I can see which topic is currently active.

#### Acceptance Criteria

1. WHEN a user changes the topic in settings THEN the current topic display SHALL update immediately to show the new topic
2. WHEN a custom topic is entered THEN the topic display SHALL show the custom topic text
3. WHEN a random topic is selected THEN the topic display SHALL show the newly fetched random topic

### Requirement 3

**User Story:** As a user, I want the conversation context to remain intact when changing topics, so that the characters can naturally transition to the new topic while maintaining conversation flow.

#### Acceptance Criteria

1. WHEN a topic is changed during an active chat THEN the conversation history SHALL be preserved
2. WHEN a topic is changed THEN the next character message SHALL incorporate the new topic while maintaining conversational continuity
3. WHEN a topic is changed THEN the application SHALL NOT reset the entire chat session