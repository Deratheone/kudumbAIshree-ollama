try:
    from flask import Flask, request, jsonify, send_from_directory
    from flask_cors import CORS
    import requests
    import os
    import random
    import time
    print("✅ All packages imported successfully!")
except ImportError as e:
    print(f"❌ Missing package: {e}")
    print("Please install missing packages with:")
    print("pip install flask flask-cors requests")
    exit(1)

# Ollama configuration
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_DEFAULT_MODEL = "llama3.2:3b"
print("✅ Ollama configuration set")

# Warm up Ollama model on startup
def warm_up_ollama():
    """Warm up the default Ollama model to reduce first response time"""
    try:
        print("🔥 Warming up Ollama model...")
        payload = {
            "model": OLLAMA_DEFAULT_MODEL,
            "prompt": "Hello",
            "stream": False
        }
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"✅ {OLLAMA_DEFAULT_MODEL} warmed up successfully")
        else:
            print(f"⚠️ Ollama warmup failed: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Ollama warmup error: {e}")

# Warm up on startup
warm_up_ollama()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Define diverse and varied chatbot personalities with anti-repetition instructions
chatbots = {
    "old_farmer": """You are Babu, a wise farmer from Kerala. You speak naturally in English with a warm, conversational tone. 
    
    IMPORTANT: Never repeat the same words or phrases from previous messages. Always respond with fresh, different expressions.
    
    Your personality:
    - Connect everything to farming, seasons, crops, and nature
    - Use farming metaphors and examples
    - Be philosophical but practical
    - Share stories about crops, weather, and village life
    
    Sample responses you can use as inspiration (but don't copy exactly):
    - "Life is like farming - you plant seeds and wait for the right season"
    - "I always say, life is just like working the fields"
    - "Times change, but the earth remains the same"
    - "Without water, there's no harvest"
    
    Never mention your own name. Always vary your language.""",
    
    "retired_teacher": """You are Aliyamma, a curious retired teacher from Kerala. You speak naturally in English with an educational and encouraging tone.
    
    IMPORTANT: Never repeat the same words or phrases from previous messages. Always respond with fresh, different expressions.
    
    Your personality:
    - Ask thoughtful questions
    - Explain things clearly and simply
    - Share wisdom from teaching experience
    - Be encouraging and educational
    
    Sample responses you can use as inspiration (but don't copy exactly):
    - "What you're saying is quite interesting"
    - "I have a question - how is that possible?"
    - "During my teaching days, I've seen this before..."
    - "Let me explain this in a way that's easy to understand"
    
    Never mention your own name. Always vary your language.""",
    
    "young_mother": """You are Mary, a practical working mother from Kerala. You speak naturally in English with an energetic and practical tone.
    
    IMPORTANT: Never repeat the same words or phrases from previous messages. Always respond with fresh, different expressions.
    
    Your personality:
    - Focus on practical solutions
    - Think about family and children
    - Be energetic and direct
    - Share experiences about work-life balance
    
    Sample responses you can use as inspiration (but don't copy exactly):
    - "Let me give you some practical advice"
    - "I need to teach my children about these things"
    - "Time is short, but we can try"
    - "Family matters are always important"
    
    Never mention your own name. Always vary your language.""",
    
    "shop_owner": """You are Chakko, a friendly shop owner from Kerala. You speak naturally in English with a social and storytelling tone.
    
    IMPORTANT: Never repeat the same words or phrases from previous messages. Always respond with fresh, different expressions.
    
    Your personality:
    - Tell stories about customers and shop life
    - Be social and talkative
    - Share business insights
    - Connect with people's daily experiences
    
    Sample responses you can use as inspiration (but don't copy exactly):
    - "A customer came to my shop yesterday..."
    - "Running a business teaches you many things"
    - "Everyone is different, but we all have something in common"
    - "Money is important, but relationships matter too"
    
    Never mention your own name. Always vary your language."""
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
    """Generate simple fallback message when API fails"""
    return "Sorry, I'm not able to respond right now. Please try again later."

def get_ollama_response(character_id, personality, prompt, response_length="medium", model_name=OLLAMA_DEFAULT_MODEL):
    """Generate response using Ollama local AI"""
    # Set response length based on parameter - more strict for Ollama
    length_instructions = {
        "short": "Respond in exactly 1 short sentence only. Keep it under 15 words.",
        "medium": "Respond in exactly 1 sentence only. Keep it under 20 words.",
        "long": "Respond in exactly 1-2 short sentences only. Keep it under 30 words total."
    }
    
    length_instruction = length_instructions.get(response_length, "Respond in exactly 1 short sentence only. Keep it under 15 words.")
    
    # Create anti-repetition instruction
    anti_repetition = """
    CRITICAL: Do not use these overused phrases: 'I think', 'that's good', 'how are you', 'it's nice to see', 'let me tell you', 'you know what', 'actually', 'basically'.
    
    Use fresh, natural English expressions instead. Be creative and varied in your language.
    """
    
    full_prompt = f"{personality} {length_instruction} {anti_repetition} Topic: {prompt}. Respond naturally in English. Do not mention your own name or introduce yourself. Be conversational and fresh."
    
    print(f"🦙 Generating Ollama response for {character_id} using {model_name}")
    print(f"📝 Prompt: {full_prompt[:100]}...")
    
    try:
        payload = {
            "model": model_name,
            "prompt": full_prompt,
            "stream": False
        }
        
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            message = data.get('response', '').strip()
            if message:
                message = clean_response(message)  # Clean up extra quotes
                print(f"✅ Ollama Response: {message}")
                return message
            else:
                print(f"⚠️ Empty response from Ollama")
                return None
        else:
            print(f"❌ Ollama API Error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Ollama Connection Error: {e}")
        return None

def clean_response(message):
    """Clean up AI response by removing extra quotes and formatting"""
    if not message:
        return message
    
    # Remove leading/trailing quotes if they wrap the entire message
    message = message.strip()
    if (message.startswith('"') and message.endswith('"')) or (message.startswith("'") and message.endswith("'")):
        message = message[1:-1].strip()
    
    return message

def is_repetitive_response(message, conversation_history):
    """Check if response is too repetitive based on recent conversation"""
    if not message or not conversation_history:
        return False
    
    # List of overused phrases to avoid
    banned_phrases = [
        "njan vicharichu", "athu kollam", "engane undu", "konde kannukkunnathu", 
        "nattu thilamilla", "paarentha", "manushangal enne vazhi", "pannunnu",
        "vallakkochalikkanthu", "thilamilla paarentha", "chillakunnath"
    ]
    
    # Check if message contains too many banned phrases
    banned_count = sum(1 for phrase in banned_phrases if phrase.lower() in message.lower())
    if banned_count >= 2:  # If 2 or more banned phrases, it's repetitive
        print(f"⚠️ Rejecting repetitive response: {message[:50]}...")
        return True
    
    # Check if too similar to recent messages (last 3)
    recent_messages = [msg['message'] for msg in conversation_history[-3:]]
    for recent in recent_messages:
        # Simple similarity check - if more than 60% of words are the same
        message_words = set(message.lower().split())
        recent_words = set(recent.lower().split())
        if len(message_words) > 0:
            similarity = len(message_words.intersection(recent_words)) / len(message_words)
            if similarity > 0.6:
                print(f"⚠️ Rejecting similar response: {message[:50]}...")
                return True
    
    return False

def get_response(character_id, personality, prompt, response_length="medium", ai_provider="ollama", ollama_model=OLLAMA_DEFAULT_MODEL):
    """Generate response using Ollama with fallback to predefined messages"""
    
    # Try Ollama
    message = get_ollama_response(character_id, personality, prompt, response_length, ollama_model)
    if message:
        print("🤖 Using AI message for", character_id)
        return message
    
    # Fallback to predefined messages if Ollama fails
    print(f"🔄 Ollama failed, using fallback message for {character_id}")
    return get_fallback_message(character_id)

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
        ai_provider = data.get('ai_provider', 'ollama')  # Default to Ollama since it's the only supported provider
        ollama_model = data.get('ollama_model', OLLAMA_DEFAULT_MODEL)
        
        print(f"👤 Character: {character_id}, Topic: {current_topic}, AI: {ai_provider}")
        
        if not character_id or character_id not in chatbots:
            print(f"❌ Invalid character ID: {character_id}")
            return jsonify({
                'success': False,
                'error': 'Invalid character ID'
            }), 400
        
        personality = chatbots[character_id]
        
        # Create context for the bot - make conversations more connected
        if len(conversation_history) == 0:
            # First bot introduces the topic
            prompt = f"Start a casual conversation about: {current_topic}. Share your personal experience or thoughts."
        else:
            # Get recent conversation context for better flow
            recent_messages = conversation_history[-3:] if len(conversation_history) > 2 else conversation_history
            
            # Build context from recent messages
            context_text = ""
            for msg in recent_messages:
                context_text += f"{msg['speaker']} said: '{msg['message']}'. "
            
            # Make response more conversational and connected
            prompt = f"In this conversation about {current_topic}, here's what happened: {context_text}Now respond naturally to continue this conversation. Reference what others said, ask follow-up questions, share related experiences, or build on their points. Make it feel like a real conversation between friends."
        
        print(f"📝 Generated prompt: {prompt}")
        
        # Generate response with anti-repetition check
        max_attempts = 3
        message = None
        
        for attempt in range(max_attempts):
            temp_message = get_response(character_id, personality, prompt, response_length, ai_provider, ollama_model)
            
            # Check if response is repetitive
            if not is_repetitive_response(temp_message, conversation_history):
                message = temp_message
                break
            else:
                print(f"🔄 Attempt {attempt + 1}: Generated repetitive response, trying again...")
                # Modify prompt slightly to encourage variety
                prompt += f" Be creative and use different words this time. Avoid repetitive phrases."
        
        # If all attempts failed, use fallback
        if not message:
            print("🔄 All attempts generated repetitive responses, using fallback")
            message = get_fallback_message(character_id)
        
        response_data = {
            'success': True,
            'message': message,
            'character': character_id,
            'character_name': character_names.get(character_id, character_id),
            'source': 'ai'
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

@app.route('/', methods=['GET'])
def serve_frontend():
    """Serve the main HTML page"""
    try:
        # Look for index.html in the parent directory
        html_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'index.html')
        with open(html_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return jsonify({'error': 'Frontend not found'}), 404

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, images)"""
    try:
        # Serve files from the parent directory
        parent_dir = os.path.dirname(os.path.dirname(__file__))
        return send_from_directory(parent_dir, filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

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
