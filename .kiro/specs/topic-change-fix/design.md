# Design Document

## Overview

The topic change functionality needs to be enhanced to allow real-time topic switching during active chat sessions. Currently, the topic is only loaded during application initialization and doesn't update when users change it in settings. This design implements a reactive topic management system that immediately applies topic changes without requiring a full chat reset.

## Architecture

The solution involves three main components:

1. **Topic Manager**: A centralized service to handle topic state and changes
2. **Settings Integration**: Enhanced settings interface that communicates topic changes to the main app
3. **Chat Integration**: Modified chat flow to use the current topic dynamically

## Components and Interfaces

### 1. Topic Manager Class

A new `TopicManager` class will be added to handle all topic-related operations:

```javascript
class TopicManager {
    constructor(backendService) {
        this.currentTopic = null;
        this.backendService = backendService;
        this.listeners = [];
    }

    // Load topic from localStorage or fetch random
    async loadTopic()

    // Change topic and notify listeners
    async changeTopic(newTopicType, customTopicText)

    // Add listener for topic changes
    addTopicChangeListener(callback)

    // Get current topic
    getCurrentTopic()
}
```

### 2. Enhanced KudumbAIshree Class

The main application class will be modified to:

- Use the TopicManager instead of managing topic directly
- Listen for topic changes and update the UI accordingly
- Continue chat flow without reset when topic changes

Key modifications:

- Replace `this.currentTopic` with `this.topicManager.getCurrentTopic()`
- Add topic change listener in constructor
- Update `updateTopicDisplay()` method to be called on topic changes

### 3. Settings Integration

The settings JavaScript will be enhanced to:

- Communicate directly with the main app's TopicManager
- Provide immediate feedback when topics change
- Update the topic display in real-time

## Data Models

### Topic Change Event

```javascript
{
    oldTopic: string,
    newTopic: string,
    topicType: 'random' | 'custom' | 'predefined',
    timestamp: string
}
```

### Topic State

```javascript
{
    currentTopic: string,
    topicType: 'random' | 'custom' | 'predefined',
    customTopicText: string | null,
    lastChanged: string
}
```

## Error Handling

1. **Backend Unavailable**: If backend is unavailable when fetching random topics, fall back to predefined random topics
2. **Empty Custom Topic**: Validate custom topic input and show user-friendly error messages
3. **Topic Change During Generation**: If a topic change occurs while an AI message is being generated, the next message will use the new topic
4. **localStorage Errors**: Handle cases where localStorage is unavailable or corrupted

## Testing Strategy

### Unit Tests

- TopicManager class methods
- Topic validation functions
- Event listener registration/removal

### Integration Tests

- Topic change during active chat
- Settings modal topic selection
- Backend topic fetching
- localStorage persistence

### User Acceptance Tests

- Change topic during active chat and verify characters discuss new topic
- Switch between custom and predefined topics
- Verify topic display updates immediately
- Test with backend unavailable scenarios

## Implementation Flow

1. **Initialization**:

   - Create TopicManager instance
   - Load initial topic from localStorage or fetch random
   - Register topic change listeners

2. **Topic Change Process**:

   - User selects new topic in settings
   - Settings calls `topicManager.changeTopic()`
   - TopicManager updates internal state
   - TopicManager notifies all listeners
   - Main app updates UI and continues chat with new topic

3. **Chat Integration**:
   - Each AI message generation uses `topicManager.getCurrentTopic()`
   - No chat reset required for topic changes
   - Conversation history preserved

## Key Design Decisions

1. **No Chat Reset**: Topic changes preserve conversation history to maintain flow
2. **Event-Driven Architecture**: Use listeners to decouple topic management from UI updates
3. **Centralized Topic State**: Single source of truth for current topic
4. **Graceful Degradation**: Fallback mechanisms when backend is unavailable
5. **Immediate UI Updates**: Topic display updates instantly when changed
