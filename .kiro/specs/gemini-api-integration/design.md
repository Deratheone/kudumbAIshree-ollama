# Design Document

## Overview

This design outlines the integration of Google's Gemini API into the KudumbAIshree application to replace static character messages with dynamic AI-generated responses. The solution will maintain character personalities while enabling natural conversation flow through contextual prompting and robust error handling.

## Architecture

### High-Level Architecture

```
Frontend (Browser)
├── KudumbAIshree Class (existing)
├── GeminiAPIService (new)
├── CharacterPersonalityManager (new)
├── ConversationContextManager (new)
└── FallbackMessageHandler (enhanced existing)
```

### API Integration Flow

1. **Character Turn Trigger** → Generate personality-based prompt
2. **Context Assembly** → Include recent conversation history
3. **API Call** → Send request to Gemini API with retry logic
4. **Response Processing** → Parse and validate AI response
5. **Fallback Handling** → Use static messages if API fails
6. **UI Update** → Display message in character's speech bubble

## Components and Interfaces

### 1. GeminiAPIService

**Purpose:** Handle all Gemini API communication with proper error handling and retry logic.

**Key Methods:**
- `generateCharacterMessage(character, context, conversationHistory)`
- `validateAPIKey()`
- `handleAPIError(error)`
- `retryRequest(requestConfig, maxRetries = 1)`

**Configuration:**
```javascript
const GEMINI_CONFIG = {
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  TIMEOUT: 10000,
  MAX_RETRIES: 1,
  RATE_LIMIT_DELAY: 1000
};
```

### 2. CharacterPersonalityManager

**Purpose:** Manage character-specific prompts and personality traits.

**Character Profiles:**
```javascript
const CHARACTER_PROFILES = {
  retired_teacher: {
    personality: "Wise, thoughtful, concerned about education and youth",
    topics: ["education", "students", "teaching", "wisdom", "past experiences"],
    speaking_style: "Reflective and advisory",
    kerala_context: "Former government school teacher, respected in community"
  },
  young_mother: {
    personality: "Caring, practical, focused on family welfare",
    topics: ["children", "school", "family", "parenting", "household"],
    speaking_style: "Warm and concerned",
    kerala_context: "Modern mother balancing tradition and progress"
  },
  shop_owner: {
    personality: "Business-minded, practical, community-focused",
    topics: ["business", "customers", "market", "economy", "local trade"],
    speaking_style: "Direct and practical",
    kerala_context: "Local shop owner, knows everyone in neighborhood"
  },
  old_farmer: {
    personality: "Traditional, weather-wise, connected to nature",
    topics: ["farming", "weather", "crops", "seasons", "traditional knowledge"],
    speaking_style: "Simple and grounded",
    kerala_context: "Experienced farmer with deep knowledge of local agriculture"
  }
};
```

### 3. ConversationContextManager

**Purpose:** Manage conversation history and context for natural flow.

**Key Features:**
- Track last 3 messages for immediate context
- Summarize older messages when history exceeds 20 entries
- Identify conversation topics and themes
- Generate appropriate conversation starters

### 4. Enhanced KudumbAIshree Class

**New Methods:**
- `generateAIMessage(character)` - Replace existing `generateMessage()`
- `handleAPIFailure(character)` - Fallback to static messages
- `showAPIStatus(status)` - Display API connection status
- `initializeGeminiIntegration()` - Setup API service

## Data Models

### API Request Structure
```javascript
{
  "contents": [{
    "parts": [{
      "text": `${systemPrompt}\n\nCharacter: ${characterName}\nPersonality: ${personality}\nContext: ${conversationContext}\n\nGenerate a natural response:`
    }]
  }],
  "generationConfig": {
    "maxOutputTokens": 100,
    "temperature": 0.7
  }
}
```

### API Response Structure
```javascript
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Generated character message"
      }]
    }
  }]
}
```

### Internal Message Object
```javascript
{
  character: "retired_teacher",
  message: "AI generated message text",
  timestamp: "2025-01-31T10:30:00Z",
  source: "ai" | "fallback",
  context_used: ["previous_message_1", "previous_message_2"]
}
```

## Error Handling

### Error Types and Responses

1. **API Key Invalid (401)**
   - Show configuration error message
   - Fallback to static messages
   - Provide setup instructions

2. **Rate Limit Exceeded (429)**
   - Implement exponential backoff
   - Show temporary warning
   - Use static messages during cooldown

3. **Network Timeout**
   - Retry once with longer timeout
   - Fallback to static messages
   - Show connectivity status

4. **API Service Unavailable (5xx)**
   - Immediate fallback to static messages
   - Log error for debugging
   - Retry on next character turn

### Fallback Strategy

```javascript
const FALLBACK_HIERARCHY = [
  'ai_generated',      // Primary: Gemini API
  'contextual_static', // Secondary: Context-aware static messages
  'random_static'      // Tertiary: Original random static messages
];
```

## Testing Strategy

### Unit Tests
- GeminiAPIService request/response handling
- CharacterPersonalityManager prompt generation
- ConversationContextManager history management
- Error handling for all failure scenarios

### Integration Tests
- End-to-end API call flow
- Fallback mechanism activation
- Character personality consistency
- Conversation context continuity

### Manual Testing Scenarios
1. **Happy Path**: Normal API responses with character personalities
2. **API Failure**: Network disconnection during conversation
3. **Rate Limiting**: Rapid conversation triggering rate limits
4. **Invalid API Key**: Configuration with wrong credentials
5. **Long Conversations**: Context management with 20+ messages

## Security Considerations

### API Key Management
- Store API key in environment variables or secure configuration
- Never expose API key in client-side code
- Implement key rotation capability
- Add API key validation on startup

### Request Security
- Validate all user inputs before API calls
- Sanitize conversation context
- Implement request size limits
- Add CORS headers for API calls

### Privacy
- Don't log sensitive conversation content
- Implement conversation data retention policies
- Allow users to clear conversation history
- Respect user privacy preferences

## Performance Optimizations

### API Call Efficiency
- Implement request debouncing for rapid clicks
- Cache character personality prompts
- Optimize prompt length for faster responses
- Use streaming responses if available

### Frontend Performance
- Show loading indicators during API calls
- Implement message queuing for multiple rapid requests
- Optimize DOM updates for smooth animations
- Add progressive enhancement for slower connections

### Resource Management
- Limit conversation history size
- Implement memory cleanup for long sessions
- Add request cancellation for component unmounting
- Monitor API usage and costs