# Requirements Document

## Introduction

This feature involves reordering the character display and interaction sequence in the Kerala sit-out chatbot application. The current character order needs to be changed to: Babu (philosophical thinker), Aliyamma (curious teacher), Mary (practical problem-solver), and Chakko (enthusiastic storyteller). This reordering will affect both the visual presentation and the conversation flow to create a more logical progression from philosophical to practical discourse.

## Requirements

### Requirement 1

**User Story:** As a user of the Kerala sit-out chatbot, I want the characters to appear in the order Babu, Aliyamma, Mary, Chakko, so that the conversation flows naturally from philosophical insights to practical solutions.

#### Acceptance Criteria

1. WHEN the application loads THEN the character avatars SHALL be displayed in the order: Babu, Aliyamma, Mary, Chakko
2. WHEN characters speak in sequence THEN they SHALL follow the order: Babu first, then Aliyamma, then Mary, then Chakko
3. WHEN the conversation log displays messages THEN the character order SHALL be consistent with the new sequence

### Requirement 2

**User Story:** As a user, I want the character selection interface to reflect the new order, so that I can easily identify and interact with characters in their intended sequence.

#### Acceptance Criteria

1. WHEN viewing the character selection area THEN Babu SHALL appear as the first character option
2. WHEN viewing character avatars THEN Aliyamma SHALL appear as the second character
3. WHEN viewing character avatars THEN Mary SHALL appear as the third character  
4. WHEN viewing character avatars THEN Chakko SHALL appear as the fourth character

### Requirement 3

**User Story:** As a developer, I want the character data structures and arrays to maintain the new order, so that all character-related functionality works consistently.

#### Acceptance Criteria

1. WHEN character arrays are defined THEN they SHALL follow the order: old_farmer (Babu), retired_teacher (Aliyamma), young_mother (Mary), shop_owner (Chakko)
2. WHEN character profiles are initialized THEN they SHALL maintain the correct mapping to the reordered sequence
3. WHEN character names are referenced THEN they SHALL correspond to the correct character in the new order

### Requirement 4

**User Story:** As a user, I want the conversation flow to start with Babu's philosophical perspective, so that discussions begin with deeper thinking before moving to practical applications.

#### Acceptance Criteria

1. WHEN a new conversation starts THEN Babu SHALL have the opportunity to speak first in the rotation
2. WHEN characters respond in sequence THEN the flow SHALL progress from Babu's philosophical insights to Aliyamma's questions to Mary's solutions to Chakko's stories
3. WHEN the initial welcome message is displayed THEN it SHALL come from the first character in the new order (Babu) if the welcome rotation is updated