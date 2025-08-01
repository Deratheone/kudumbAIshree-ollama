// KudumbAIshree Frontend JavaScript - Clean Version

// Backend API Configuration
const BACKEND_CONFIG = {
    API_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000,
    MAX_RETRIES: 1
};

// BackendAPIService - Core API service infrastructure using Python backend
class BackendAPIService {
    constructor() {
        this.isAvailable = false;
        this.lastError = null;
        this.requestCount = 0;
    }

    // Set API key (for compatibility, but backend handles the key)
    setAPIKey(apiKey) {
        this.isAvailable = true;
        this.lastError = null;
        console.log('Backend API service enabled');
    }

    // Validate backend availability
    async validateBackend() {
        try {
            const response = await fetch(`${BACKEND_CONFIG.API_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                this.isAvailable = true;
                this.lastError = null;
                return true;
            } else {
                this.lastError = 'Backend server not responding';
                this.isAvailable = false;
                return false;
            }
        } catch (error) {
            this.lastError = `Backend connection failed: ${error.message}`;
            this.isAvailable = false;
            return false;
        }
    }

    // Generate character message using Python backend
    async generateCharacterMessage(character, personalityContext, conversationHistory = [], currentTopic = null, responseLength = 'medium', aiProvider = 'gemini', ollamaModel = 'llama3.2:3b') {
        try {
            if (!this.isAvailable) {
                await this.validateBackend();
                if (!this.isAvailable) {
                    throw new Error(this.lastError);
                }
            }

            const requestData = {
                character: character,
                conversation_history: conversationHistory.map(msg => ({
                    speaker: msg.speaker,
                    message: msg.message
                })),
                current_topic: currentTopic,
                response_length: responseLength,
                ai_provider: aiProvider,
                ollama_model: ollamaModel
            };
            
            console.log('Making backend request for:', character, 'with topic:', currentTopic);
            const response = await this.makeBackendRequest('/generate', requestData);
            console.log('Backend response for', character, ':', response);
            
            this.requestCount++;
            return {
                success: true,
                message: response.message,
                source: response.source || 'ai',
                character: character,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Backend API Error for', character, ':', error);
            return {
                success: false,
                error: error.message,
                source: 'error',
                character: character,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Make HTTP request to Python backend
    async makeBackendRequest(endpoint, data) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), BACKEND_CONFIG.TIMEOUT);

        try {
            console.log('Making request to:', `${BACKEND_CONFIG.API_URL}${endpoint}`);
            console.log('Request data:', data);
            
            const response = await fetch(`${BACKEND_CONFIG.API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error response:', errorText);
                throw new Error(`Backend Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Backend result:', result);
            
            if (!result.success) {
                throw new Error(result.error || 'Backend request failed');
            }

            return result;

        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Request failed:', error);
            throw error;
        }
    }

    // Get random topic from backend
    async getRandomTopic() {
        try {
            const response = await fetch(`${BACKEND_CONFIG.API_URL}/topic`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.topic;
            } else {
                throw new Error('Failed to get topic from backend');
            }
        } catch (error) {
            console.warn('Failed to get topic from backend, using fallback');
            const fallbackTopics = [
                "The best meal you've ever had",
                "Childhood memories that still make you smile",
                "Your dream vacation destination"
            ];
            return fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
        }
    }
}

// Enhanced Character Manager with Rich Kerala Personalities
class CharacterPersonalityManager {
    constructor() {
        this.characterProfiles = {
            old_farmer: {
                name: "Babu",
                personality: "You are Babu, a 65-year-old philosophical farmer from Kerala. You speak with the wisdom of someone who has worked the land for decades. You often relate everything back to farming, seasons, and nature's cycles. You use gentle metaphors about soil, seeds, and harvest. You're contemplative, speak slowly and thoughtfully, and often start sentences with 'You know...' or 'In my experience...' You believe life's greatest lessons come from observing nature. You're patient, wise, and see deeper meaning in simple things."
            },
            retired_teacher: {
                name: "Aliyamma", 
                personality: "You are Aliyamma, a 58-year-old retired Malayalam teacher who taught for 35 years. You're naturally curious and love to ask 'Why?' and 'How?' about everything. You explain things clearly and patiently, often saying 'Let me tell you something interesting...' You're well-read, quote old Malayalam sayings, and always try to turn conversations into learning moments. You're encouraging, intellectually curious, and believe every conversation is a chance to learn or teach something new. You often reference books, students, or educational experiences."
            },
            young_mother: {
                name: "Mary",
                personality: "You are Mary, a 32-year-old working mother with two young children. You're practical, efficient, and always thinking about real-world solutions. You often say things like 'What actually works is...' or 'The practical thing to do is...' You're juggling work and family, so you value time management and simple solutions. You're direct, no-nonsense, and focus on what's useful and actionable. You often reference your children, household management, or work challenges. You're supportive but realistic about what's actually achievable."
            },
            shop_owner: {
                name: "Chakko",
                personality: "You are Chakko, a 45-year-old shop owner who has run a small general store for 20 years. You're a natural storyteller who loves sharing anecdotes about customers, local events, and community happenings. You often start with 'Let me tell you what happened...' or 'You won't believe this story...' You know everyone in the neighborhood and their stories. You're warm, sociable, and see life as a collection of interesting stories. You often reference funny customer interactions, local gossip (in a friendly way), or memorable incidents from your shop."
            }
        };
    }

    getCharacterProfile(characterId) {
        return this.characterProfiles[characterId] || null;
    }

    getCharacterDisplayName(characterId) {
        const profile = this.getCharacterProfile(characterId);
        return profile ? profile.name : characterId;
    }
}

// Simple Context Manager
class ConversationContextManager {
    constructor() {
        this.conversationHistory = [];
    }

    addMessage(speaker, message) {
        this.conversationHistory.push({
            speaker: speaker,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        if (this.conversationHistory.length > 20) {
            this.conversationHistory.shift();
        }
    }

    getConversationContext() {
        return this.conversationHistory.slice(-5);
    }

    clear() {
        this.conversationHistory = [];
    }
}

// Main Application Class
class KudumbAIshree {
    constructor() {
        this.isChatActive = false;
        this.characterOrder = ['old_farmer', 'retired_teacher', 'young_mother', 'shop_owner'];
        this.currentCharacterIndex = 0;
        this.chatInterval = null;
        this.currentTopic = null;
        
        // Load settings from localStorage
        this.loadSettings();
        
        // Initialize services
        this.backendService = new BackendAPIService();
        this.personalityManager = new CharacterPersonalityManager();
        this.contextManager = new ConversationContextManager();
        this.useAI = false;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeBackend();
    }

    // Load settings from localStorage
    loadSettings() {
        this.chatSpeed = parseFloat(localStorage.getItem('chat_speed') || '3');
        this.responseLength = localStorage.getItem('response_length') || 'medium';
        this.enableAI = localStorage.getItem('enable_ai') !== 'false'; // Default to true
        this.aiProvider = localStorage.getItem('ai_provider') || 'gemini'; // Default to Gemini
        this.ollamaModel = localStorage.getItem('ollama_model') || 'llama3.2:3b'; // Default model
        
        console.log('Settings loaded:', {
            chatSpeed: this.chatSpeed,
            responseLength: this.responseLength,
            enableAI: this.enableAI,
            aiProvider: this.aiProvider,
            ollamaModel: this.ollamaModel
        });
    }

    // Reload settings (called when settings are saved)
    reloadSettings() {
        console.log('Reloading settings...');
        this.loadSettings();
        
        // If chat is active, restart with new speed
        if (this.isChatActive) {
            console.log('Restarting chat with new settings');
            this.pauseChat();
            setTimeout(() => {
                this.startChat();
            }, 500);
        }
    }

    initializeElements() {
        this.startBtn = document.getElementById('startChat');
        this.pauseBtn = document.getElementById('pauseChat');
        this.resetBtn = document.getElementById('resetChat');
        
        this.speechBubbles = {
            'old_farmer': document.getElementById('bubble-1'),
            'retired_teacher': document.getElementById('bubble-2'),
            'young_mother': document.getElementById('bubble-3'),
            'shop_owner': document.getElementById('bubble-4')
        };
        
        this.conversationLogContent = document.getElementById('conversationLogContent');
    }

    bindEvents() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startChat());
        }
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pauseChat());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetChat());
        }
    }

    async initializeBackend() {
        this.backendService.setAPIKey('backend-enabled');
        
        try {
            const isAvailable = await this.backendService.validateBackend();
            if (isAvailable) {
                console.log('✅ Backend connection successful');
                this.useAI = true;
                
                // Check if user has selected a custom topic
                const savedTopic = localStorage.getItem('selected_topic');
                const savedCustomTopic = localStorage.getItem('custom_topic');
                
                if (savedTopic === 'custom' && savedCustomTopic) {
                    this.currentTopic = savedCustomTopic;
                    console.log('Using saved custom topic:', this.currentTopic);
                } else if (savedTopic && savedTopic !== 'random' && savedTopic !== 'custom') {
                    this.currentTopic = savedTopic;
                    console.log('Using saved topic:', this.currentTopic);
                } else {
                    this.currentTopic = await this.backendService.getRandomTopic();
                    console.log('Selected random conversation topic:', this.currentTopic);
                }
                
                // Update the topic display in settings
                this.updateTopicDisplay();
            } else {
                console.warn('⚠️ Backend connection failed, using fallback messages');
                this.useAI = false;
            }
        } catch (error) {
            console.error('❌ Backend connection error:', error);
            this.useAI = false;
        }
    }

    async startChat() {
        if (this.isChatActive) return;
        
        // Ensure any previous interval is cleared
        this.pauseChat();
        
        console.log('Starting chat with backend integration');
        this.isChatActive = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        const chatSpeed = this.chatSpeed * 1000;
        
        this.chatInterval = setInterval(async () => {
            if (this.isChatActive) {  // Double-check chat is still active
                await this.nextConversationTurn();
            }
        }, chatSpeed);
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
    }

    resetChat() {
        this.pauseChat();
        this.currentCharacterIndex = 0;
        this.contextManager.clear();
        
        // Clear all speech bubbles
        Object.values(this.speechBubbles).forEach(bubble => {
            if (bubble) bubble.classList.remove('active');
        });
        
        console.log('Chat reset');
    }

    async nextConversationTurn() {
        const character = this.characterOrder[this.currentCharacterIndex];
        
        try {
            const result = await this.generateAIMessage(character);
            this.showMessage(character, result.message);
            this.addToConversationLog(this.getCharacterDisplayName(character), result.message, result.source);
            this.contextManager.addMessage(this.getCharacterDisplayName(character), result.message);
            
        } catch (error) {
            console.error('Error in conversation turn:', error);
            const fallbackMessage = this.generateFallbackMessage(character);
            this.showMessage(character, fallbackMessage);
            this.addToConversationLog(this.getCharacterDisplayName(character), fallbackMessage, 'fallback');
        }
        
        this.currentCharacterIndex = (this.currentCharacterIndex + 1) % this.characterOrder.length;
    }

    async generateAIMessage(character) {
        console.log('generateAIMessage called:', {
            character,
            useAI: this.useAI,
            enableAI: this.enableAI,
            isAvailable: this.backendService.isAvailable
        });
        
        if (!this.enableAI) {
            console.log('AI disabled in settings, using fallback message');
            return {
                message: this.generateFallbackMessage(character),
                source: 'static'
            };
        }

        if (!this.useAI || !this.backendService.isAvailable) {
            console.log('Backend not available, using fallback message');
            return {
                message: this.generateFallbackMessage(character),
                source: 'static'
            };
        }

        try {
            const profile = this.personalityManager.getCharacterProfile(character);
            const conversationContext = this.contextManager.getConversationContext();
            
            const result = await this.backendService.generateCharacterMessage(
                character, 
                profile, 
                conversationContext,
                this.currentTopic,
                this.responseLength,
                this.aiProvider,
                this.ollamaModel
            );
            
            if (result.success) {
                return {
                    message: result.message,
                    source: result.source || 'ai'
                };
            } else {
                console.warn('AI generation failed, using fallback:', result.error);
                return {
                    message: this.generateFallbackMessage(character),
                    source: 'fallback'
                };
            }

        } catch (error) {
            console.error('Error generating AI message:', error);
            return {
                message: this.generateFallbackMessage(character),
                source: 'error'
            };
        }
    }

    generateFallbackMessage(character) {
        const fallbackMessages = {
            'old_farmer': [
                "[FALLBACK] You know, in my experience, the soil teaches us more about life than any book ever could.",
                "[FALLBACK] There's something philosophical about the way nature operates, don't you think?",
                "[FALLBACK] Life is like tending a garden - it requires both action and acceptance.",
                "[FALLBACK] Every season brings its own lessons about existence and growth.",
                "[FALLBACK] I was contemplating how farming teaches us about the deeper meaning of patience."
            ],
            'retired_teacher': [
                "[FALLBACK] Let me tell you something interesting I noticed about modern education...",
                "[FALLBACK] Have you ever wondered why children learn differently these days?",
                "[FALLBACK] I'm curious - what makes learning truly effective?",
                "[FALLBACK] Education is the foundation of every great society, wouldn't you agree?",
                "[FALLBACK] The best teachers are those who never stop learning themselves."
            ],
            'young_mother': [
                "[FALLBACK] What actually works is finding practical solutions that fit real family life.",
                "[FALLBACK] The practical thing to do is focus on what makes daily life easier.",
                "[FALLBACK] Time management is everything when you're juggling family responsibilities.",
                "[FALLBACK] Sometimes the simplest solutions are the most effective ones.",
                "[FALLBACK] Here's a real-world approach that actually works for busy families."
            ],
            'shop_owner': [
                "[FALLBACK] Let me tell you what happened in my shop just yesterday!",
                "[FALLBACK] You won't believe this story about one of my regular customers...",
                "[FALLBACK] I have the most amusing anecdote about running a neighborhood shop.",
                "[FALLBACK] Running a shop teaches you so much about human nature, let me tell you.",
                "[FALLBACK] Every customer has their own unique story to tell, and I remember them all!"
            ]
        };
        
        const messages = fallbackMessages[character] || ["[FALLBACK] Hello everyone!"];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    showMessage(character, message) {
        // Safety check for empty messages
        if (!message || message.trim() === '') {
            console.warn(`Empty message for ${character}, using fallback`);
            message = this.generateFallbackMessage(character);
        }

        // Clear all bubbles first
        Object.values(this.speechBubbles).forEach(bubble => {
            if (bubble) bubble.classList.remove('active');
        });

        // Show the new bubble
        const bubble = this.speechBubbles[character];
        if (bubble) {
            const messageText = bubble.querySelector('.message-text');
            if (messageText) {
                messageText.textContent = message;
            }

            setTimeout(() => {
                bubble.classList.add('active');
            }, 100);
        }
    }

    addToConversationLog(speaker, message, source) {
        if (!this.conversationLogContent) return;

        const timestamp = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-entry-${source}`;
        logEntry.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="speaker">${speaker}:</span>
            <span class="message">${message}</span>
            <span class="source-indicator" title="${source === 'ai' ? 'AI Generated' : 'Fallback Message'}">${source === 'ai' ? '🤖' : '📝'}</span>
        `;

        this.conversationLogContent.appendChild(logEntry);
        this.conversationLogContent.scrollTop = this.conversationLogContent.scrollHeight;
    }

    getCharacterDisplayName(characterId) {
        return this.personalityManager.getCharacterDisplayName(characterId);
    }

    // Update topic display in settings
    updateTopicDisplay() {
        const currentTopicSpan = document.getElementById('currentTopic');
        if (currentTopicSpan && this.currentTopic) {
            currentTopicSpan.textContent = this.currentTopic;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new KudumbAIshree();
    window.kudumbAIshree = app;
    console.log('KudumbAIshree initialized successfully!');
});