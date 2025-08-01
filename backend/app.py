try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    import requests
    import json
    import random
    import time
    print("✅ All packages imported successfully!")
except ImportError as e:
    print(f"❌ Missing package: {e}")
    print("Please install missing packages with:")
    print("pip install flask flask-cors requests")
    exit(1)

# Gemini API configuration with fallback keys
try:
    # Try to import from config.py (recommended for security)
    from config import GEMINI_API_KEYS
    print("✅ API keys loaded from config.py")
except ImportError:
    # Fallback to hardcoded keys (update these with your actual keys)
    GEMINI_API_KEYS = [
        "your-primary-api-key-here",  # Primary key
        # Add your fallback API keys here:
        # "your-second-api-key-here",
        # "your-third-api-key-here",
    ]
    print("⚠️ Using hardcoded API keys. For security, create config.py with your keys.")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

# Track which API key is currently being used
current_api_key_index = 0

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Define enhanced chatbot personalities with rich Kerala context
chatbots = {
    "old_farmer": "You are Babu, a 65-year-old philosophical farmer from Kerala. You speak with the wisdom of someone who has worked the land for decades. You often relate everything back to farming, seasons, and nature's cycles. You use gentle metaphors about soil, seeds, and harvest. You're contemplative, speak slowly and thoughtfully, and often start sentences with 'You know...' or 'In my experience...' You believe life's greatest lessons come from observing nature. You're patient, wise, and see deeper meaning in simple things.",
    "retired_teacher": "You are Aliyamma, a 58-year-old retired Malayalam teacher who taught for 35 years. You're naturally curious and love to ask 'Why?' and 'How?' about everything. You explain things clearly and patiently, often saying 'Let me tell you something interesting...' You're well-read, quote old Malayalam sayings, and always try to turn conversations into learning moments. You're encouraging, intellectually curious, and believe every conversation is a chance to learn or teach something new. You often reference books, students, or educational experiences.",
    "young_mother": "You are Mary, a 32-year-old working mother with two young children. You're practical, efficient, and always thinking about real-world solutions. You often say things like 'What actually works is...' or 'The practical thing to do is...' You're juggling work and family, so you value time management and simple solutions. You're direct, no-nonsense, and focus on what's useful and actionable. You often reference your children, household management, or work challenges. You're supportive but realistic about what's actually achievable.",
    "shop_owner": "You are Chakko, a 45-year-old shop owner who has run a small general store for 20 years. You're a natural storyteller who loves sharing anecdotes about customers, local events, and community happenings. You often start with 'Let me tell you what happened...' or 'You won't believe this story...' You know everyone in the neighborhood and their stories. You're warm, sociable, and see life as a collection of interesting stories. You often reference funny customer interactions, local gossip (in a friendly way), or memorable incidents from your shop."
}

# Character display names
character_names = {
    "old_farmer": "Babu",
    "retired_teacher": "Aliyamma", 
    "young_mother": "Mary",
    "shop_owner": "Chakko"
}

# Array of random topics for conversation
topics = [
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
]

def get_fallback_message(character_id):
    """Generate fallback messages when API quota is exceeded"""
    fallback_messages = {
        "old_farmer": [
            "[FALLBACK] You know, in my experience, the soil teaches us more about life than any book ever could.",
            "[FALLBACK] There's something philosophical about the way nature operates, don't you think?",
            "[FALLBACK] Life is like tending a garden - it requires both action and acceptance.",
            "[FALLBACK] Every season brings its own lessons about existence and growth.",
            "[FALLBACK] I was contemplating how farming teaches us about the deeper meaning of patience."
        ],
        "retired_teacher": [
            "[FALLBACK] Let me tell you something interesting I noticed about modern education...",
            "[FALLBACK] Have you ever wondered why children learn differently these days?",
            "[FALLBACK] I'm curious - what makes learning truly effective?",
            "[FALLBACK] Education is the foundation of every great society, wouldn't you agree?",
            "[FALLBACK] The best teachers are those who never stop learning themselves."
        ],
        "young_mother": [
            "[FALLBACK] What actually works is finding practical solutions that fit real family life.",
            "[FALLBACK] The practical thing to do is focus on what makes daily life easier.",
            "[FALLBACK] Time management is everything when you're juggling family responsibilities.",
            "[FALLBACK] Sometimes the simplest solutions are the most effective ones.",
            "[FALLBACK] Here's a real-world approach that actually works for busy families."
        ],
        "shop_owner": [
            "[FALLBACK] Let me tell you what happened in my shop just yesterday!",
            "[FALLBACK] You won't believe this story about one of my regular customers...",
            "[FALLBACK] I have the most amusing anecdote about running a neighborhood shop.",
            "[FALLBACK] Running a shop teaches you so much about human nature, let me tell you.",
            "[FALLBACK] Every customer has their own unique story to tell, and I remember them all!"
        ]
    }
    
    messages = fallback_messages.get(character_id, ["[FALLBACK] Hello everyone!"])
    return random.choice(messages)

def try_api_key(api_key, payload, character_id):
    """Try a single API key and return response or None if failed"""
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': api_key
    }
    
    try:
        print(f"🔑 Trying API key: {api_key[:20]}...")
        response = requests.post(
            GEMINI_API_URL,
            headers=headers,
            json=payload,
            timeout=15
        )
        
        print(f"📡 API Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Response received with key {api_key[:20]}...")
            
            if 'candidates' in data and len(data['candidates']) > 0:
                candidate = data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    message = candidate['content']['parts'][0]['text']
                    if message and message.strip():  # Check for non-empty message
                        print(f"💬 Generated message: {message}")
                        return message.strip()
                    else:
                        print(f"⚠️ Empty message from API key {api_key[:20]}...")
                        return None
        
        # Log the error for this key
        print(f"❌ API key {api_key[:20]}... failed with status {response.status_code}")
        if response.status_code == 429:
            print(f"🚫 Rate limited on key {api_key[:20]}...")
        elif response.status_code == 403:
            print(f"🔒 Quota exceeded on key {api_key[:20]}...")
        
        return None
        
    except Exception as e:
        print(f"💥 Exception with API key {api_key[:20]}...: {e}")
        return None

def get_response(character_id, personality, prompt, response_length="medium"):
    """Generate response using Gemini API via HTTP requests with fallback keys"""
    global current_api_key_index
    
    # Set response length based on parameter
    length_instructions = {
        "short": "Respond in 1 sentence only.",
        "medium": "Respond in 1-2 sentences.",
        "long": "Respond in 2-3 sentences."
    }
    
    length_instruction = length_instructions.get(response_length, "Respond in 1-2 sentences.")
    full_prompt = f"{personality} {length_instruction} Topic: {prompt}. Respond naturally in a conversational way."
    
    print(f"🤖 Generating response for {character_id}")
    print(f"📝 Prompt: {full_prompt[:100]}...")
    print(f"🔑 Available API keys: {len(GEMINI_API_KEYS)}")
    
    # Prepare the request payload
    payload = {
        "contents": [{
            "parts": [{
                "text": full_prompt
            }]
        }],
        "generationConfig": {
            "maxOutputTokens": 500,
            "temperature": 0.7,
            "topP": 0.8,
            "topK": 40
        }
    }
    
    # Try current API key first
    if current_api_key_index < len(GEMINI_API_KEYS):
        current_key = GEMINI_API_KEYS[current_api_key_index]
        print(f"🎯 Trying current API key (index {current_api_key_index})")
        
        result = try_api_key(current_key, payload, character_id)
        if result:
            return result
    
    # If current key failed, try all other keys
    print(f"🔄 Current key failed, trying fallback keys...")
    for i, api_key in enumerate(GEMINI_API_KEYS):
        if i == current_api_key_index:
            continue  # Skip the one we already tried
            
        print(f"🔄 Trying fallback API key {i+1}/{len(GEMINI_API_KEYS)}")
        result = try_api_key(api_key, payload, character_id)
        
        if result:
            # Switch to this working key
            current_api_key_index = i
            print(f"✅ Switched to working API key (index {i})")
            return result
    
    # All API keys failed, use fallback message
    print(f"💥 All {len(GEMINI_API_KEYS)} API keys failed! Using fallback message")
    fallback_msg = get_fallback_message(character_id)
    print(f"🔄 Fallback message: {fallback_msg}")
    return fallback_msg

@app.route('/api/generate', methods=['POST'])
def generate_message():
    """API endpoint to generate character messages"""
    try:
        print(f"🎯 Received generate request")
        data = request.json
        print(f"📥 Request data: {data}")
        
        character_id = data.get('character')
        conversation_history = data.get('conversation_history', [])
        current_topic = data.get('current_topic')
        response_length = data.get('response_length', 'medium')
        
        print(f"👤 Character: {character_id}, Topic: {current_topic}")
        
        if not character_id or character_id not in chatbots:
            print(f"❌ Invalid character ID: {character_id}")
            return jsonify({
                'success': False,
                'error': 'Invalid character ID'
            }), 400
        
        personality = chatbots[character_id]
        
        # Create context for the bot (same logic as your Python script)
        if len(conversation_history) == 0:
            # First bot introduces the topic
            prompt = f"Start a discussion about: {current_topic}"
        else:
            # Other bots respond to previous messages
            recent_context = " ".join([f"{msg['speaker']}: {msg['message']}" for msg in conversation_history[-3:]])
            prompt = f"Continue the discussion about {current_topic}. Previous context: {recent_context}"
        
        print(f"📝 Generated prompt: {prompt}")
        
        # Generate response
        message = get_response(character_id, personality, prompt, response_length)
        
        # Check if message is empty or None and use fallback
        if not message or message.strip() == "":
            print(f"⚠️ Empty message received for {character_id}, using fallback")
            message = get_fallback_message(character_id)
            source = 'fallback'
        # The get_response function now handles fallbacks internally
        # Determine source based on message content
        elif any(fallback in message for fallback in ["contemplating", "wondered", "found a practical", "tell you an interesting"]):
            source = 'fallback'
            print(f"🔄 Using fallback message for {character_id}")
        else:
            source = 'ai'
            print(f"🤖 Using AI message for {character_id}")
        
        response_data = {
            'success': True,
            'message': message,
            'character': character_id,
            'character_name': character_names.get(character_id, character_id),
            'source': source
        }
        
        print(f"📤 Sending response: {response_data}")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ Error in generate_message: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/topic', methods=['GET'])
def get_random_topic():
    """API endpoint to get a random conversation topic"""
    return jsonify({
        'topic': random.choice(topics)
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'KudumbAIshree Backend API is running'
    })

if __name__ == '__main__':
    print("🚀 Starting KudumbAIshree Backend API...")
    print("📋 Available characters:", list(character_names.values()))
    print("🎯 Available topics:", len(topics))
    app.run(debug=True, host='0.0.0.0', port=5000)