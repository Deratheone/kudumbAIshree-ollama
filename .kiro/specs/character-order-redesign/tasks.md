# Implementation Plan

- [x] 1. Update character order array in main JavaScript class

  - Modify the `characterOrder` array in the KudumbAIshree constructor to reflect new order: `['old_farmer', 'retired_teacher', 'young_mother', 'shop_owner']`
  - Ensure the array change maintains proper character ID references
  - _Requirements: 3.1, 3.2_

- [x] 2. Update HTML character seat mappings

  - [x] 2.1 Update character seat data attributes

    - Modify `data-character` attributes in HTML to map positions to new character order
    - Update character-1 to map to "old_farmer" (Babu)
    - Update character-2 to map to "retired_teacher" (Aliyamma)
    - Update character-3 to map to "young_mother" (Mary)
    - Update character-4 to map to "shop_owner" (Chakko)
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Update character display names in HTML

    - Update character name displays to show correct names in new positions
    - Ensure character-1 shows "Babu", character-2 shows "Aliyamma", etc.
    - Update any hardcoded character references in HTML
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4_

- [x] 3. Update speech bubble assignments

  - [x] 3.1 Update speech bubble initialization

    - Modify the `speechBubbles` object mapping in JavaScript to assign bubbles to correct characters
    - Ensure bubble-1 maps to old_farmer, bubble-2 to retired_teacher, etc.
    - Update bubble content initialization to reflect new character order
    - _Requirements: 1.2, 3.2_

  - [x] 3.2 Update initial speech bubble content

    - Modify initial speech bubble messages to match new character personalities in correct positions
    - Update speaker names in bubble content to reflect new order
    - Ensure bubble-1 shows Babu's philosophical message, bubble-2 shows Aliyamma's curious message, etc.
    - _Requirements: 1.1, 1.2_

- [x] 4. Update conversation log initialization

  - Modify initial conversation log entry to reflect the first character in new order
  - Update the hardcoded initial log entry to show Babu's welcome message instead of Aliyamma's
  - Ensure conversation log character name mapping reflects new order
  - _Requirements: 1.3, 4.1_

- [x] 5. Update fallback character mappings in HTML script

  - [x] 5.1 Update character names mapping

    - Modify the `characterNames` object in HTML script to reflect new position mappings
    - Ensure position-based character name lookups return correct names for new order
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 5.2 Update fallback message arrays

    - Update the `messages` object arrays to ensure correct messages appear for characters in new positions
    - Verify that character-specific messages align with new character order
    - _Requirements: 1.2, 4.2_

- [x] 6. Update conversation flow initialization

  - Modify the conversation flow startup to begin with Babu (old_farmer) as the first speaker
  - Update any hardcoded references to starting character
  - Ensure conversation rotation follows new order: Babu → Aliyamma → Mary → Chakko
  - _Requirements: 4.1, 4.2_

- [x] 7. Test character order implementation

  - [x] 7.1 Create unit tests for character order validation

    - Write tests to verify character order array contains correct sequence
    - Test character position mapping functions return correct values
    - Verify character index cycling works with new order
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 7.2 Create integration tests for UI element mapping

    - Test that character seats display correct character information
    - Verify speech bubbles appear for correct characters in new positions
    - Test conversation log shows correct character names
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4_

- [x] 8. Verify conversation flow with new order

  - Test complete conversation cycle to ensure characters speak in correct sequence
  - Verify that conversation starts with Babu's philosophical perspective
  - Test that conversation rotation progresses through Aliyamma, Mary, then Chakko
  - Ensure conversation reset maintains new character order
  - _Requirements: 4.1, 4.2, 4.3_
