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
        // Shared fallback topics to avoid duplication
        this.fallbackTopics = [
            "The best meal you've ever had",
            "Childhood memories that still make you smile",
            "Your dream vacation destination"
        ];
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
            console.log('🔍 Validating backend connection to:', `${BACKEND_CONFIG.API_URL}/health`);
            const response = await fetch(`${BACKEND_CONFIG.API_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('🌐 Backend response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Backend validation successful:', data);
                this.isAvailable = true;
                this.lastError = null;
                return true;
            } else {
                console.error('❌ Backend server not responding, status:', response.status);
                this.lastError = 'Backend server not responding';
                this.isAvailable = false;
                return false;
            }
        } catch (error) {
            console.error('💥 Backend connection error:', error);
            this.lastError = `Backend connection failed: ${error.message}`;
            this.isAvailable = false;
            return false;
        }
    }

    // Generate character message using Python backend
    async generateCharacterMessage(character, personalityContext, conversationHistory = [], currentTopic = null, responseLength = 'medium', aiProvider = 'ollama', ollamaModel = 'llama3.2:3b') {
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

            const response = await this.makeBackendRequest('/generate', requestData);

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
            return this.fallbackTopics[Math.floor(Math.random() * this.fallbackTopics.length)];
        }
    }
}

// Enhanced Character Manager with Rich Kerala Personalities
class CharacterPersonalityManager {
    constructor() {
        this.characterProfiles = {
            old_farmer: {
                name: "Babu",
                personality: "You are a 65-year-old philosophical farmer from Kerala. You speak with the wisdom of someone who has worked the land for decades. You often relate everything back to farming, seasons, and nature's cycles. You're contemplative, speak slowly and thoughtfully. You speak in Manglish (Malayalam using English characters). Use Malayalam words but write them in English letters like 'njan', 'athu', 'engane'. Be natural and conversational. Never mention your own name in conversations."
            },
            retired_teacher: {
                name: "Aliyamma", 
                personality: "You are a 58-year-old retired Malayalam teacher who taught for 35 years. You're naturally curious and love to ask questions about everything. You explain things clearly and patiently. You speak in Manglish (Malayalam using English characters). Use Malayalam words but write them in English letters like 'njan', 'athu', 'engane'. Be natural and conversational. Never mention your own name in conversations."
            },
            young_mother: {
                name: "Mary",
                personality: "You are a 32-year-old working mother with two young children. You're practical, efficient, and always thinking about real-world solutions. You speak in Manglish (Malayalam using English characters). Use Malayalam words but write them in English letters like 'njan', 'athu', 'engane'. Be natural and conversational. Never mention your own name in conversations."
            },
            shop_owner: {
                name: "Chakko",
                personality: "You are a 45-year-old shop owner who has run a small general store for 20 years. You're a natural storyteller who loves sharing anecdotes about customers, local events, and community happenings. You speak in Manglish (Malayalam using English characters). Use Malayalam words but write them in English letters like 'njan', 'athu', 'engane'. Be natural and conversational. Never mention your own name in conversations."
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

// Topic Manager - Handles topic state and changes
class TopicManager {
    constructor(backendService) {
        this.currentTopic = null;
        this.backendService = backendService;
        this.listeners = [];
        this.topicType = 'random';
        this.customTopicText = null;
    }

    // Add listener for topic changes
    addTopicChangeListener(callback) {
        this.listeners.push(callback);
    }

    // Remove listener
    removeTopicChangeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    // Notify all listeners of topic change
    notifyListeners(oldTopic, newTopic) {
        const event = {
            oldTopic: oldTopic,
            newTopic: newTopic,
            topicType: this.topicType,
            timestamp: new Date().toISOString()
        };
        
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in topic change listener:', error);
            }
        });
    }

    // Load topic from localStorage or fetch random
    async loadTopic() {
        try {
            const savedTopic = localStorage.getItem('selected_topic');
            const savedCustomTopic = localStorage.getItem('custom_topic');
            
            if (savedTopic === 'custom' && savedCustomTopic) {
                this.topicType = 'custom';
                this.customTopicText = savedCustomTopic;
                this.currentTopic = savedCustomTopic;
            } else if (savedTopic && savedTopic !== 'random' && savedTopic !== 'custom') {
                this.topicType = 'predefined';
                this.currentTopic = savedTopic;
            } else {
                this.topicType = 'random';
                this.currentTopic = await this.fetchRandomTopic();
            }
            
            return this.currentTopic;
        } catch (error) {
            console.error('Error loading topic:', error);
            // Fallback to a default topic
            this.currentTopic = "The best meal you've ever had";
            this.topicType = 'predefined';
            return this.currentTopic;
        }
    }

    // Fetch random topic from backend or use fallback
    async fetchRandomTopic() {
        try {
            if (this.backendService && this.backendService.isAvailable) {
                return await this.backendService.getRandomTopic();
            } else {
                // Use fallback topics from backend service
                return this.backendService.fallbackTopics[Math.floor(Math.random() * this.backendService.fallbackTopics.length)];
            }
        } catch (error) {
            console.error('Error fetching random topic:', error);
            return "The best meal you've ever had";
        }
    }

    // Change topic and notify listeners
    async changeTopic(newTopicType, customTopicText = null) {
        const oldTopic = this.currentTopic;
        
        try {
            // Validate custom topic
            if (newTopicType === 'custom') {
                if (!customTopicText || customTopicText.trim() === '') {
                    throw new Error('Custom topic cannot be empty');
                }
                if (customTopicText.length > 100) {
                    throw new Error('Custom topic must be 100 characters or less');
                }
                this.topicType = 'custom';
                this.customTopicText = customTopicText.trim();
                this.currentTopic = this.customTopicText;
                localStorage.setItem('custom_topic', this.customTopicText);
                localStorage.setItem('selected_topic', 'custom');
            } else if (newTopicType === 'random') {
                this.topicType = 'random';
                this.customTopicText = null;
                this.currentTopic = await this.fetchRandomTopic();
                localStorage.setItem('selected_topic', 'random');
            } else {
                // Predefined topic
                this.topicType = 'predefined';
                this.customTopicText = null;
                this.currentTopic = newTopicType;
                localStorage.setItem('selected_topic', newTopicType);
            }
            
            // Notify listeners of the change
            this.notifyListeners(oldTopic, this.currentTopic);
            
            return {
                success: true,
                oldTopic: oldTopic,
                newTopic: this.currentTopic,
                topicType: this.topicType
            };
            
        } catch (error) {
            console.error('Error changing topic:', error);
            return {
                success: false,
                error: error.message,
                oldTopic: oldTopic,
                newTopic: this.currentTopic
            };
        }
    }

    // Get current topic
    getCurrentTopic() {
        return this.currentTopic;
    }

    // Get topic state
    getTopicState() {
        return {
            currentTopic: this.currentTopic,
            topicType: this.topicType,
            customTopicText: this.customTopicText,
            lastChanged: new Date().toISOString()
        };
    }
}

// Simple Context Manager
class ConversationContextManager {
    constructor() {
        this.conversationHistory = [];
        this.maxHistorySize = 20;
    }

    addMessage(speaker, message) {
        this.conversationHistory.push({
            speaker: speaker,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Efficient trimming: only when necessary
        if (this.conversationHistory.length > this.maxHistorySize) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistorySize);
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
        
        // Fallback topics - defined once at construction
        this.fallbackTopics = [
            "The best meal you've ever had",
            "Childhood memories that still make you smile",
            "Your dream vacation destination",
            "Your morning routine and how it affects your day",
            "What you do to relax after a stressful day",
            "Your favorite family tradition",
            "The skill you wish you could master instantly",
            "Your favorite comfort food and why",
            "What you hope people remember about you",
            "Your favorite way to spend a weekend",
            "The most valuable lesson you've learned"
        ];
        
        // Initialize services first
        this.backendService = new BackendAPIService();
        this.personalityManager = new CharacterPersonalityManager();
        this.contextManager = new ConversationContextManager();
        this.useAI = false;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeBackend();
    }

    // Load settings from localStorage
    async loadSettings() {
        this.chatSpeed = parseFloat(localStorage.getItem('chat_speed') || '3');
        this.responseLength = localStorage.getItem('response_length') || 'short'; // Default to short
        this.enableAI = localStorage.getItem('enable_ai') !== 'false'; // Default to true
        this.aiProvider = localStorage.getItem('ai_provider') || 'ollama'; // Default to Ollama
        this.ollamaModel = localStorage.getItem('ollama_model') || 'llama3.2:3b'; // Default model
        
        // Load topic settings
        const savedTopic = localStorage.getItem('selected_topic');
        const savedCustomTopic = localStorage.getItem('custom_topic');
        console.log('🎯 Loading topic settings:', { savedTopic, savedCustomTopic });

        if (savedTopic === 'custom' && savedCustomTopic) {
            this.currentTopic = savedCustomTopic;
            console.log('✏️ Using custom topic:', this.currentTopic);
        } else if (savedTopic && savedTopic !== 'random' && savedTopic !== 'custom') {
            this.currentTopic = savedTopic;
            console.log('📌 Using preset topic:', this.currentTopic);
        } else if (savedTopic === 'random') {
            // Generate a new random topic
            if (this.useAI && this.backendService && this.backendService.isAvailable) {
                try {
                    this.currentTopic = await this.backendService.getRandomTopic();
                    console.log('🎲 Using random topic from backend:', this.currentTopic);
                } catch (error) {
                    console.warn('Failed to get random topic from backend, using fallback');
                    this.currentTopic = this.getRandomFallbackTopic();
                }
            } else {
                this.currentTopic = this.getRandomFallbackTopic();
                console.log('🎲 Using fallback random topic:', this.currentTopic);
            }
        } else {
            // Default fallback
            this.currentTopic = "General conversation";
            console.log('Using default topic:', this.currentTopic);
        }
        
        // Update UI display if available
        this.updateTopicDisplay();
        
        console.log('✅ Settings loaded:', {
            chatSpeed: this.chatSpeed,
            responseLength: this.responseLength,
            enableAI: this.enableAI,
            aiProvider: this.aiProvider,
            ollamaModel: this.ollamaModel,
            currentTopic: this.currentTopic
        });
    }

    // Get a random fallback topic
    getRandomFallbackTopic() {
        return this.fallbackTopics[Math.floor(Math.random() * this.fallbackTopics.length)];
    }

    // Update topic display in UI
    updateTopicDisplay() {
        const currentTopicSpan = document.getElementById('currentTopic');
        if (currentTopicSpan && this.currentTopic) {
            currentTopicSpan.textContent = this.currentTopic;
            console.log('🎯 Updated topic display:', this.currentTopic);
        } else if (currentTopicSpan) {
            currentTopicSpan.textContent = 'Not selected';
            console.log('⚠️ Topic display updated to "Not selected" - no current topic');
        } else {
            console.warn('⚠️ Could not find currentTopic display element');
        }
    }

    // Reload settings (called when settings are saved)
    async reloadSettings() {
        console.log('🔄 Reloading settings...');
        
        // ALWAYS stop chat when settings change
        if (this.isChatActive) {
            console.log('⏸️ Settings changed - stopping chat. User must click Start Chat to continue with new settings.');
            this.pauseChat();
            
            // Show notification to user
            this.showSettingsChangedNotification();
        }
        
        // Reload all settings including topic
        await this.loadSettings();
        
        console.log('✅ Settings reloaded successfully');
    }

    initializeElements() {
        this.startBtn = document.getElementById('startChat');
        this.pauseBtn = document.getElementById('pauseChat');
        this.resetBtn = document.getElementById('resetChat');
        this.toggleLogBtn = document.getElementById('toggleLog');
        this.conversationLog = document.getElementById('conversationLog');
        this.clearLogBtn = document.getElementById('clearLog');
        this.closeLogBtn = document.getElementById('closeLog');
        this.aiLoadingIndicator = document.getElementById('aiLoadingIndicator');
        this.testBackendBtn = document.getElementById('testBackend');
        
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
        if (this.toggleLogBtn) {
            this.toggleLogBtn.addEventListener('click', () => this.toggleConversationLog());
        }
        if (this.clearLogBtn) {
            this.clearLogBtn.addEventListener('click', () => this.clearConversationLog());
        }
        if (this.closeLogBtn) {
            this.closeLogBtn.addEventListener('click', () => this.hideConversationLog());
        }
        if (this.testBackendBtn) {
            this.testBackendBtn.addEventListener('click', () => this.testBackendConnection());
        }
    }

    async initializeBackend() {
        console.log('🚀 Initializing backend connection...');
        
        // Load settings first (non-topic settings)
        this.chatSpeed = parseFloat(localStorage.getItem('chat_speed') || '3');
        this.responseLength = localStorage.getItem('response_length') || 'medium';
        this.enableAI = localStorage.getItem('enable_ai') !== 'false'; // Default to true
        this.aiProvider = localStorage.getItem('ai_provider') || 'ollama'; // Default to Ollama
        this.ollamaModel = localStorage.getItem('ollama_model') || 'llama3.2:3b'; // Default model
        
        console.log('🔧 Current settings:', {
            enableAI: this.enableAI,
            useAI: this.useAI,
            aiProvider: this.aiProvider,
            ollamaModel: this.ollamaModel
        });
        
        this.backendService.setAPIKey('backend-enabled');

        try {
            const isAvailable = await this.backendService.validateBackend();
            console.log('🔄 Backend validation result:', isAvailable);

            if (isAvailable) {
                console.log('✅ Backend connection successful - enabling AI');
                this.useAI = true;

                // Load topic settings now that backend is available
                await this.loadSettings();

                // Update the topic display in settings
                this.updateTopicDisplay();
            } else {
                console.warn('⚠️ Backend connection failed, using fallback messages');
                console.warn('⚠️ Backend error:', this.backendService.lastError);
                this.useAI = false;
            }
        } catch (error) {
            console.error('❌ Backend connection error:', error);
            this.useAI = false;
        }

        console.log('📊 Final initialization state:', {
            useAI: this.useAI,
            enableAI: this.enableAI,
            backendAvailable: this.backendService.isAvailable,
            currentTopic: this.currentTopic
        });
    }

    async startChat() {
        if (this.isChatActive) return;
        
        // Ensure any previous interval is cleared
        this.pauseChat();
        
        console.log('🚀 Starting chat with current topic:', this.currentTopic);
        
        // Ensure topic is loaded and valid
        if (!this.currentTopic) {
            console.warn('⚠️ No topic set, reloading settings...');
            await this.loadSettings();
        }
        
        console.log('✅ Chat starting with topic:', this.currentTopic);
        console.log('📊 Chat settings:', {
            currentTopic: this.currentTopic,
            useAI: this.useAI,
            enableAI: this.enableAI,
            chatSpeed: this.chatSpeed,
            responseLength: this.responseLength
        });
        
        this.isChatActive = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        // Show loading indicator for first response
        this.showAILoadingIndicator();
        
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
        
        // Hide loading indicator when pausing
        this.hideAILoadingIndicator();
        
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
        
        // Hide loading indicator when resetting
        this.hideAILoadingIndicator();
        
        console.log('Chat reset');
    }

    toggleConversationLog() {
        if (!this.conversationLog || !this.toggleLogBtn) return;
        
        const isVisible = this.conversationLog.classList.contains('show');
        const toggleText = this.toggleLogBtn.querySelector('.toggle-text');
        
        if (isVisible) {
            // Hide the log
            this.conversationLog.classList.remove('show');
            if (toggleText) toggleText.textContent = 'Show Log';
            console.log('Conversation log hidden');
        } else {
            // Show the log
            this.conversationLog.classList.add('show');
            if (toggleText) toggleText.textContent = 'Hide Log';
            console.log('Conversation log shown');
        }
    }

    hideConversationLog() {
        if (!this.conversationLog || !this.toggleLogBtn) return;
        
        this.conversationLog.classList.remove('show');
        const toggleText = this.toggleLogBtn.querySelector('.toggle-text');
        if (toggleText) toggleText.textContent = 'Show Log';
        console.log('Conversation log hidden');
    }

    clearConversationLog() {
        if (!this.conversationLogContent) return;
        
        this.conversationLogContent.innerHTML = '';
        console.log('Conversation log cleared');
    }

    showAILoadingIndicator() {
        if (this.aiLoadingIndicator) {
            this.aiLoadingIndicator.classList.add('show');
            console.log('AI loading indicator shown');
        }
    }

    hideAILoadingIndicator() {
        if (this.aiLoadingIndicator) {
            this.aiLoadingIndicator.classList.remove('show');
            console.log('AI loading indicator hidden');
        }
    }

    async nextConversationTurn() {
        const character = this.characterOrder[this.currentCharacterIndex];
        
        try {
            const result = await this.generateAIMessage(character);
            this.showMessage(character, result.message);
            this.addToConversationLog(this.getCharacterDisplayName(character), result.message, result.source);
            this.contextManager.addMessage(this.getCharacterDisplayName(character), result.message);
            
            // Hide loading indicator after first message
            this.hideAILoadingIndicator();
            
        } catch (error) {
            console.error('Error in conversation turn:', error);
            const fallbackMessage = this.generateFallbackMessage(character);
            this.showMessage(character, fallbackMessage);
            this.addToConversationLog(this.getCharacterDisplayName(character), fallbackMessage, 'fallback');
            
            // Hide loading indicator even on error
            this.hideAILoadingIndicator();
        }
        
        this.currentCharacterIndex = (this.currentCharacterIndex + 1) % this.characterOrder.length;
    }

    async generateAIMessage(character) {
        console.log('🤖 generateAIMessage called:', {
            character,
            currentTopic: this.currentTopic,
            useAI: this.useAI,
            enableAI: this.enableAI,
            isAvailable: this.backendService.isAvailable
        });
        
        // Log the topic being sent
        console.log(`📝 Current topic for ${character}: "${this.currentTopic}"`);
        
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
            
            console.log(`🎯 Sending to backend - Character: ${character}, Topic: "${this.currentTopic}"`);
            
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
        // Simplified fallback - no pre-written conversations
        return "Sorry, I'm not able to respond right now. Please try again later.";
    }    showMessage(character, message) {
        // Safety check for empty messages
        if (!message || message.trim() === '') {
            console.warn(`Empty message for ${character}, using fallback`);
            message = this.generateFallbackMessage(character);
        }

        const bubble = this.speechBubbles[character];
        if (!bubble) return;

        const messageText = bubble.querySelector('.message-text');
        if (!messageText) return;

        // Batch DOM operations for better performance
        // 1. First, hide all bubbles and update content
        Object.values(this.speechBubbles).forEach(b => {
            if (b) b.classList.remove('active');
        });
        
        messageText.textContent = message;

        // 2. Then show the new bubble after a small delay
        setTimeout(() => {
            bubble.classList.add('active');
        }, 100);
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

    // Test backend connection manually
    async testBackendConnection() {
        console.log('🧪 Manual backend test requested');
        
        // Update button state
        if (this.testBackendBtn) {
            this.testBackendBtn.disabled = true;
            this.testBackendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        }

        try {
            const isAvailable = await this.backendService.validateBackend();
            
            if (isAvailable) {
                alert('✅ Backend connection successful!\n\nServer is running and responding properly.');
                console.log('✅ Manual backend test: SUCCESS');
                
                // Re-initialize to update AI status
                this.useAI = true;
                this.updateTopicDisplay();
            } else {
                alert('❌ Backend connection failed!\n\nPlease check:\n• Backend server is running\n• Port 5000 is available\n• No firewall blocking connection');
                console.log('❌ Manual backend test: FAILED');
                this.useAI = false;
            }
        } catch (error) {
            console.error('❌ Backend test error:', error);
            alert('❌ Backend test error!\n\n' + error.message);
            this.useAI = false;
        } finally {
            // Restore button state
            if (this.testBackendBtn) {
                this.testBackendBtn.disabled = false;
                this.testBackendBtn.innerHTML = '<i class="fas fa-plug"></i> Test Backend';
            }
        }
    }

    // Show notification when settings change during active chat
    showSettingsChangedNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'settings-changed-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-cog"></i>
                <span>Settings changed! Chat stopped.</span>
                <small>Click "Start Chat" to begin with new settings</small>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new KudumbAIshree();
    window.kudumbAIshree = app;
    console.log('KudumbAIshree initialized successfully!');
});