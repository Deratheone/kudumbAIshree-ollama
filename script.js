// KudumbAIshree Frontend JavaScript

class KudumbAIshree {
    constructor() {
        this.isChatActive = false;
        this.currentSpeaker = null;
        this.conversationHistory = [];
        this.characterOrder = ['retired_teacher', 'young_mother', 'shop_owner', 'old_farmer'];
        this.currentCharacterIndex = 0;
        this.chatInterval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialState();
    }

    initializeElements() {
        // Control buttons
        this.startBtn = document.getElementById('startChat');
        this.pauseBtn = document.getElementById('pauseChat');
        this.resetBtn = document.getElementById('resetChat');
        this.clearLogBtn = document.getElementById('clearLog');
        
        // Speech bubbles
        this.speechBubbles = {
            'retired_teacher': document.getElementById('bubble-1'),
            'young_mother': document.getElementById('bubble-2'),
            'shop_owner': document.getElementById('bubble-3'),
            'old_farmer': document.getElementById('bubble-4')
        };
        
        // Conversation log
        this.conversationLog = document.getElementById('conversationLog');
        
        // Character seats
        this.characterSeats = document.querySelectorAll('.character-seat');
    }

    bindEvents() {
        // Control button events
        this.startBtn.addEventListener('click', () => this.startChat());
        this.pauseBtn.addEventListener('click', () => this.pauseChat());
        this.resetBtn.addEventListener('click', () => this.resetChat());
        this.clearLogBtn.addEventListener('click', () => this.clearConversationLog());
        
        // Character seat click events
        this.characterSeats.forEach(seat => {
            seat.addEventListener('click', (e) => this.onCharacterClick(e));
        });
        
        // Speech bubble click events
        Object.values(this.speechBubbles).forEach(bubble => {
            if (bubble) {
                bubble.addEventListener('click', (e) => this.onBubbleClick(e));
            }
        });
    }

    loadInitialState() {
        // Show initial message
        this.showMessage('retired_teacher', 'Welcome to our sit-out! How is everyone doing today?');
        this.addToConversationLog('Retired Teacher', 'Welcome to our sit-out! How is everyone doing today?');
    }

    startChat() {
        if (this.isChatActive) return;
        
        this.isChatActive = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        // Start the conversation loop
        this.chatInterval = setInterval(() => {
            this.nextConversationTurn();
        }, 3000); // New message every 3 seconds
        
        console.log('Chat started');
    }

    pauseChat() {
        if (!this.isChatActive) return;
        
        this.isChatActive = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
        }
        
        console.log('Chat paused');
    }

    resetChat() {
        this.pauseChat();
        this.conversationHistory = [];
        this.currentCharacterIndex = 0;
        this.clearAllBubbles();
        this.clearConversationLog();
        this.loadInitialState();
        
        console.log('Chat reset');
    }

    nextConversationTurn() {
        const character = this.characterOrder[this.currentCharacterIndex];
        const message = this.generateMessage(character);
        
        this.showMessage(character, message);
        this.addToConversationLog(this.getCharacterDisplayName(character), message);
        
        // Move to next character
        this.currentCharacterIndex = (this.currentCharacterIndex + 1) % this.characterOrder.length;
    }

    generateMessage(character) {
        const messages = {
            'retired_teacher': [
                "The children these days are so different from when I was teaching.",
                "Education has changed so much over the years.",
                "I miss the old days when students were more respectful.",
                "The new curriculum is quite challenging for students.",
                "I hope the schools are maintaining good standards."
            ],
            'young_mother': [
                "My daughter is doing so well in her studies this year.",
                "The school fees have increased again this semester.",
                "I'm worried about the competition these days.",
                "My son wants to join the school football team.",
                "The teachers are really helpful with the children."
            ],
            'shop_owner': [
                "Business has been quite good this month.",
                "The price of vegetables has gone up again.",
                "I'm thinking of expanding my shop.",
                "The new mall nearby is affecting our business.",
                "I need to order more stock for next week."
            ],
            'old_farmer': [
                "The weather has been perfect for the crops this year.",
                "The monsoon season is approaching soon.",
                "I'm worried about the rising cost of fertilizers.",
                "The coconut trees are bearing good fruits.",
                "The soil quality has improved with organic farming."
            ]
        };
        
        const characterMessages = messages[character] || ["Hello everyone!"];
        return characterMessages[Math.floor(Math.random() * characterMessages.length)];
    }

    showMessage(character, message) {
        // Hide all bubbles first
        this.clearAllBubbles();
        
        // Show the new bubble
        const bubble = this.speechBubbles[character];
        if (bubble) {
            const messageText = bubble.querySelector('.message-text');
            if (messageText) {
                messageText.textContent = message;
            }
            
            // Add active class with animation
            setTimeout(() => {
                bubble.classList.add('active');
            }, 100);
        }
        
        this.currentSpeaker = character;
    }

    clearAllBubbles() {
        Object.values(this.speechBubbles).forEach(bubble => {
            if (bubble) {
                bubble.classList.remove('active');
            }
        });
    }

    addToConversationLog(speaker, message) {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="speaker">${speaker}:</span>
            <span class="message">${message}</span>
        `;
        
        this.conversationLog.appendChild(logEntry);
        
        // Auto-scroll to bottom
        this.conversationLog.scrollTop = this.conversationLog.scrollHeight;
        
        // Add to history
        this.conversationHistory.push({
            speaker,
            message,
            timestamp
        });
    }

    clearConversationLog() {
        this.conversationLog.innerHTML = '';
    }

    getCharacterDisplayName(character) {
        const names = {
            'retired_teacher': 'Retired Teacher',
            'young_mother': 'Young Mother',
            'shop_owner': 'Shop Owner',
            'old_farmer': 'Old Farmer'
        };
        return names[character] || character;
    }

    onCharacterClick(event) {
        const seat = event.currentTarget;
        const character = seat.dataset.character;
        
        if (character && this.speechBubbles[character]) {
            const bubble = this.speechBubbles[character];
            if (bubble.classList.contains('active')) {
                // If bubble is active, hide it
                bubble.classList.remove('active');
            } else {
                // Show the bubble with a sample message
                const message = this.generateMessage(character);
                this.showMessage(character, message);
            }
        }
    }

    onBubbleClick(event) {
        // Add click effect
        const bubble = event.currentTarget;
        bubble.style.transform = 'translateX(-50%) scale(0.95)';
        
        setTimeout(() => {
            bubble.style.transform = 'translateX(-50%) scale(1)';
        }, 150);
        
        // Here you could add audio playback functionality
        console.log('Bubble clicked:', bubble.id);
    }

    // Utility method to get current time
    getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new KudumbAIshree();
    
    // Make app globally accessible for debugging
    window.kudumbAIshree = app;
    
    console.log('KudumbAIshree initialized successfully!');
});

// Add some utility functions for future backend integration
window.KudumbAIshreeUtils = {
    // Function to format messages for backend
    formatMessageForBackend: (speaker, message) => {
        return {
            speaker: speaker,
            message: message,
            timestamp: new Date().toISOString(),
            voice_url: null // Will be populated by backend
        };
    },
    
    // Function to handle backend responses
    handleBackendResponse: (response) => {
        if (response && response.speaker && response.message) {
            const app = window.kudumbAIshree;
            if (app) {
                app.showMessage(response.speaker, response.message);
                app.addToConversationLog(app.getCharacterDisplayName(response.speaker), response.message);
            }
        }
    }
}; 