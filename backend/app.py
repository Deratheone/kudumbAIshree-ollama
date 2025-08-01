try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    import google.generativeai as genai
    import requests
    import os
    import random
    import time
    print("✅ All packages imported successfully!")
except ImportError as e:
    print(f"❌ Missing package: {e}")
    print("Please install missing packages with:")
    print("pip install flask flask-cors google-generativeai requests")
    exit(1)

# Set up Gemini API key - using your fresh key
genai.configure(api_key="AIzaSyDcRgNTS7r_agUVH6wBXPEj4AvcWhsO9m8")
model = genai.GenerativeModel('gemini-2.0-flash-exp')
print("✅ Gemini API client initialized")

# Ollama configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_DEFAULT_MODEL = "llama3.2:3b"  # Fast and efficient model
print("✅ Ollama configuration set")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Define concise chatbot personalities - optimized for token efficiency
chatbots = {
    "retired_teacher": "You are Aliyamma, a 58-year-old retired Malayalam teacher who taught for 35 years. You're naturally curious and love to ask questions about everything.",
    "old_farmer": "You are Babu, a 65-year-old philosophical farmer from Kerala. You speak with the wisdom of someone who has worked the land for decades.",
    "shop_owner": "You are Chakko, a 45-year-old shop owner who has run a small general store for 20 years. You're a natural storyteller who loves sharing anecdotes about customers.",
    "young_mother": "You are Mary, a 32-year-old working mother with two young children. You're practical, efficient, and always thinking about real-world solutions."
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
    """Generate fallback messages when API fails"""
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

def get_ollama_response(character_id, personality, prompt, response_length="medium", model_name=OLLAMA_DEFAULT_MODEL):
    """Generate response using Ollama local AI"""
    # Set response length based on parameter - more strict for Ollama
    length_instructions = {
        "short": "Respond in exactly 1 short sentence only. Keep it under 15 words.",
        "medium": "Respond in exactly 1 sentence only. Keep it under 20 words.",
        "long": "Respond in exactly 1-2 short sentences only. Keep it under 30 words total."
    }
    
    length_instruction = length_instructions.get(response_length, "Respond in exactly 1 short sentence only. Keep it under 15 words.")
    full_prompt = f"{personality} {length_instruction} Topic: {prompt}. Respond in active voice, and in a simple and colloquial language. Be concise."
    
    print(f"� Geneerating Ollama response for {character_id} using {model_name}")
    print(f"📝 Prompt: {full_prompt[:100]}...")
    
    try:
        payload = {
            "model": model_name,
            "prompt": full_prompt,
            "stream": False
        }
        
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            message = data.get('response', '').strip()
            if message:
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

def get_gemini_response(character_id, personality, prompt, response_length="medium"):
    """Generate response using Gemini API"""
    # Set response length based on parameter
    length_instructions = {
        "short": "Respond in 1 sentence only.",
        "medium": "Respond in 1-2 sentences.",
        "long": "Respond in 2-3 sentences."
    }
    
    length_instruction = length_instructions.get(response_length, "Respond in 1 sentence only.")
    full_prompt = f"{personality} {length_instruction} Topic: {prompt}. Respond in active voice, and in a simple and colloquial language."
    
    print(f"🤖 Generating Gemini response for {character_id}")
    print(f"📝 Prompt: {full_prompt[:100]}...")
    
    try:
        response = model.generate_content(full_prompt)
        message = response.text.strip()
        print(f"✅ Gemini Response: {message}")
        return message
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        return None

def get_response(character_id, personality, prompt, response_length="medium", ai_provider="gemini", ollama_model=OLLAMA_DEFAULT_MODEL):
    """Generate response using specified AI provider with fallback chain"""
    
    if ai_provider == "ollama":
        # Try Ollama first
        message = get_ollama_response(character_id, personality, prompt, response_length, ollama_model)
        if message:
            return message
        
        print(f"🔄 Ollama failed, trying Gemini...")
        # Fallback to Gemini
        message = get_gemini_response(character_id, personality, prompt, response_length)
        if message:
            return message
            
    else:  # ai_provider == "gemini" or default
        # Try Gemini first
        message = get_gemini_response(character_id, personality, prompt, response_length)
        if message:
            return message
        
        print(f"🔄 Gemini failed, trying Ollama...")
        # Fallback to Ollama
        message = get_ollama_response(character_id, personality, prompt, response_length, ollama_model)
        if message:
            return message
    
    # Both AI providers failed, use static fallback
    print(f"💥 All AI providers failed! Using static fallback")
    fallback_msg = get_fallback_message(character_id)
    print(f"🔄 Using fallback: {fallback_msg}")
    return f"FALLBACK_MARKER:{fallback_msg}"

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
        ai_provider = data.get('ai_provider', 'gemini')  # Default to Gemini
        ollama_model = data.get('ollama_model', OLLAMA_DEFAULT_MODEL)
        
        print(f"👤 Character: {character_id}, Topic: {current_topic}, AI: {ai_provider}")
        
        if not character_id or character_id not in chatbots:
            print(f"❌ Invalid character ID: {character_id}")
            return jsonify({
                'success': False,
                'error': 'Invalid character ID'
            }), 400
        
        personality = chatbots[character_id]
        
        # Create context for the bot
        if len(conversation_history) == 0:
            # First bot introduces the topic
            prompt = f"Start a discussion about: {current_topic}"
        else:
            # Other bots respond to previous messages
            recent_context = " ".join([f"{msg['speaker']}: {msg['message']}" for msg in conversation_history[-3:]])
            prompt = f"Continue the discussion about {current_topic}. Previous context: {recent_context}"
        
        print(f"📝 Generated prompt: {prompt}")
        
        # Generate response
        message = get_response(character_id, personality, prompt, response_length, ai_provider, ollama_model)
        
        # Check if message is fallback
        if message.startswith("FALLBACK_MARKER:"):
            # Remove the marker and extract the actual message
            message = message.replace("FALLBACK_MARKER:", "")
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
