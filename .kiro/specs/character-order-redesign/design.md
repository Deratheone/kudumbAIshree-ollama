# Design Document

## Overview

The character reordering feature involves changing the display and interaction sequence of the four Kerala sit-out characters from the current order (Retired Teacher, Young Mother, Shop Owner, Old Farmer) to the new order (Babu, Aliyamma, Mary, Chakko). This change affects both the visual presentation and the conversation flow logic to create a more natural progression from philosophical insights to practical solutions.

The current character mapping is:
- `retired_teacher` → Aliyamma (Curious Teacher)
- `young_mother` → Mary (Practical Problem-Solver)  
- `shop_owner` → Chakko (Enthusiastic Storyteller)
- `old_farmer` → Babu (Philosophical Thinker)

The new desired order is: Babu, Aliyamma, Mary, Chakko, which translates to: `old_farmer`, `retired_teacher`, `young_mother`, `shop_owner`.

## Architecture

The character ordering system consists of several interconnected components:

1. **Character Order Array**: Defines the sequence of character interactions
2. **Character Position Mapping**: Maps character IDs to visual positions
3. **Character Profile System**: Maintains personality and display information
4. **Conversation Flow Manager**: Controls the sequence of character responses
5. **UI Display Components**: Handles visual representation and positioning

## Components and Interfaces

### Character Order Configuration
```javascript
// Current implementation
this.characterOrder = ['retired_teacher', 'young_mother', 'shop_owner', 'old_farmer'];

// New implementation
this.characterOrder = ['old_farmer', 'retired_teacher', 'young_mother', 'shop_owner'];
```

### Character Position Classes
The CSS classes for character positioning need to be remapped:
- `.character-1` → Babu (old_farmer)
- `.character-2` → Aliyamma (retired_teacher)  
- `.character-3` → Mary (young_mother)
- `.character-4` → Chakko (shop_owner)

### Speech Bubble Mapping
Speech bubbles need to be reassigned to match the new character positions:
- `bubble-1` → Babu's messages
- `bubble-2` → Aliyamma's messages
- `bubble-3` → Mary's messages  
- `bubble-4` → Chakko's messages

### Character Data Structure
The character profiles remain the same, but the order of access changes:
```javascript
const characterProfiles = {
    old_farmer: { name: "Babu", ... },      // Position 1
    retired_teacher: { name: "Aliyamma", ... }, // Position 2
    young_mother: { name: "Mary", ... },    // Position 3
    shop_owner: { name: "Chakko", ... }     // Position 4
};
```

## Data Models

### Character Order Model
```javascript
interface CharacterOrder {
    characterOrder: string[];           // Array of character IDs in display order
    currentCharacterIndex: number;      // Current position in the rotation
    characterPositionMap: Map<string, number>; // Maps character ID to position
}
```

### Character Position Model
```javascript
interface CharacterPosition {
    characterId: string;    // Internal character identifier
    displayName: string;    // Character's display name
    position: number;       // Visual position (1-4)
    cssClass: string;       // CSS class for positioning
    bubbleId: string;       // Associated speech bubble ID
}
```

### UI Element Mapping
```javascript
interface UIElementMapping {
    characterSeats: {
        [position: number]: {
            characterId: string;
            element: HTMLElement;
            bubbleElement: HTMLElement;
        }
    };
    speechBubbles: {
        [characterId: string]: HTMLElement;
    };
}
```

## Error Handling

### Character Order Validation
- Validate that all required character IDs are present in the new order
- Ensure no duplicate character IDs in the order array
- Verify that character positions map correctly to UI elements

### UI Element Verification
- Check that all speech bubble elements exist for the new order
- Validate that character seat elements are properly mapped
- Ensure CSS classes correspond to the correct positions

### Fallback Mechanisms
- If character order is invalid, fall back to default order
- If UI elements are missing, log errors but continue with available elements
- Provide graceful degradation if character profiles are incomplete

## Testing Strategy

### Unit Tests
1. **Character Order Array Tests**
   - Test that new order contains all required character IDs
   - Verify order sequence matches requirements
   - Test character index cycling through new order

2. **Character Position Mapping Tests**
   - Test mapping of character IDs to positions
   - Verify CSS class assignments
   - Test speech bubble ID associations

3. **UI Element Integration Tests**
   - Test character seat positioning
   - Verify speech bubble assignments
   - Test conversation log character name display

### Integration Tests
1. **Conversation Flow Tests**
   - Test that characters speak in the new order
   - Verify conversation rotation follows Babu → Aliyamma → Mary → Chakko
   - Test that character index resets properly

2. **Visual Display Tests**
   - Test that character avatars appear in correct positions
   - Verify speech bubbles appear for correct characters
   - Test character name display consistency

3. **User Interaction Tests**
   - Test character seat click events with new order
   - Verify conversation log displays correct character names
   - Test settings and configuration with new order

### End-to-End Tests
1. **Complete Conversation Flow**
   - Start chat and verify Babu speaks first in rotation
   - Continue conversation and verify order progression
   - Test conversation reset maintains new order

2. **UI Consistency Tests**
   - Verify all UI elements reflect new character order
   - Test responsive design with new character positions
   - Verify accessibility features work with new order

## Implementation Considerations

### Code Changes Required
1. **JavaScript Changes**
   - Update `characterOrder` array in main class constructor
   - Modify character position mapping logic
   - Update speech bubble assignment logic
   - Adjust conversation flow initialization

2. **HTML Changes**
   - Update character seat `data-character` attributes
   - Modify speech bubble ID assignments
   - Update character name displays
   - Adjust initial conversation log entry

3. **CSS Changes**
   - Verify character position classes work with new mapping
   - Ensure speech bubble positioning remains correct
   - Test responsive design with new character order

### Performance Impact
- Minimal performance impact expected
- Character order change is a one-time initialization update
- No additional computational overhead for conversation flow
- UI rendering performance remains unchanged

### Backward Compatibility
- No breaking changes to existing API
- Character profiles and personalities remain unchanged
- Conversation history format remains compatible
- Settings and configuration remain functional

### Migration Strategy
- Update character order array as primary change
- Verify UI element mappings work correctly
- Test conversation flow with new order
- Validate all character interactions function properly