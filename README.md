# 🏡 KudumbAIshree - Kerala Sit-out Chat Experience

A unique AI-powered chat application that simulates a traditional Kerala sit-out conversation with four distinct characters, each with authentic personalities and speech patterns.

## ✨ Features

- **Interactive Kerala Sit-out Scene** - Visual representation of a traditional Kerala veranda
- **AI-Powered Conversations** - Uses Google's Gemini API with intelligent fallback system
- **4 Distinct Characters** - Each with unique personalities and speech patterns
- **Smart Fallback System** - Multiple API keys with automatic switching for reliability
- **Real-time Conversation Flow** - Characters speak in natural rotation
- **Customizable Settings** - Adjust chat speed, response length, and AI usage
- **Conversation Logging** - Track the full conversation with timestamps and source indicators
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 👥 Characters

1. **🌾 Babu (Old Farmer)** - 65-year-old philosophical farmer who uses farming metaphors and speaks with deep wisdom from decades of working the land
2. **📚 Aliyamma (Retired Teacher)** - 58-year-old curious former Malayalam teacher who loves asking questions and turning conversations into learning moments
3. **👩‍👧‍👦 Mary (Young Mother)** - 32-year-old practical working mother focused on real-world solutions, time management, and family life
4. **🏪 Chakko (Shop Owner)** - 45-year-old storytelling shop owner who shares anecdotes about customers, local events, and community happenings

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Modern web browser
- Google Gemini API keys (free from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kudumbAIshree
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install flask flask-cors requests
   ```

3. **Configure API Keys** (Choose one method)
   
   **Method A: Using config.py (Recommended for security)**
   ```bash
   cd backend
   cp config_template.py config.py
   # Edit config.py and add your actual API keys
   ```
   
   **Method B: Direct editing**
   - Open `backend/app.py`
   - Replace the placeholder keys in the `GEMINI_API_KEYS` array:
   ```python
   GEMINI_API_KEYS = [
       "your-primary-api-key-here",
       "your-fallback-api-key-here",
       "your-third-api-key-here",  # Optional but recommended
   ]
   ```

4. **Start the Backend**
   ```bash
   python app.py
   ```
   You should see: `🚀 Starting KudumbAIshree Backend API...`

5. **Open the Application**
   - Open `index.html` in your web browser
   - The application will automatically connect to the backend

## 🎮 How to Use

1. **Start Conversation** - Click "Start Chat" to begin the AI-powered conversation
2. **Adjust Settings** - Use the settings panel (⚙️) to:
   - Change chat speed (1-15 seconds between messages)
   - Set response length (short/medium/long)
   - Enable/disable AI responses
   - Test backend connection
3. **View Conversation** - Click "Show Log" to see the full conversation history with timestamps
4. **Control Chat** - Use Pause/Reset buttons to control the conversation flow
5. **Monitor AI Status** - Watch for 🤖 (AI) vs 📝 (Fallback) indicators in the conversation log

## 🔧 Technical Architecture

### Backend (Python Flask)
- **Smart API Management** - Automatic switching between multiple Gemini API keys
- **Character Personalities** - Rich, detailed personality definitions for each character
- **Conversation Context** - Maintains conversation history for contextual responses
- **Graceful Fallbacks** - Character-appropriate fallback messages when AI is unavailable
- **CORS Support** - Enables frontend-backend communication

### Frontend (Vanilla JavaScript)
- **Real-time Communication** - Seamless backend integration with error handling
- **Character Rotation** - Proper turn-based conversation flow
- **Settings Management** - Persistent user preferences
- **Visual Feedback** - Speech bubbles, animations, and status indicators
- **Responsive Design** - Mobile-friendly interface

### AI Integration
- **Multiple API Keys** - Redundancy for higher availability
- **Rate Limit Handling** - Automatic key switching when limits are reached
- **Context Awareness** - Characters respond to previous messages in the conversation
- **Personality Consistency** - Each character maintains unique speech patterns

## 📁 Project Structure

```
kudumbAIshree/
├── backend/
│   ├── app.py              # Flask backend with Gemini API integration
│   └── requirements.txt    # Python dependencies
├── index.html              # Main application interface
├── script-clean.js         # Frontend JavaScript logic
├── styles.css              # Application styling
├── README.md               # This documentation
└── WhatsApp Image...jpeg   # Kerala sit-out background image
```

## 🛠️ Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change the port in `app.py` and update `BACKEND_CONFIG.API_URL` in `script-clean.js`
- **API key errors**: Verify your Gemini API keys are valid and have quota remaining
- **Import errors**: Ensure all dependencies are installed: `pip install flask flask-cors requests`

### Frontend Issues
- **No AI responses**: Check browser console (F12) for backend connection errors
- **Only fallback messages**: Your API keys may have hit daily quota limits
- **Characters speaking out of order**: Refresh the page and restart the chat

### API Quota Management
- **Free tier**: 50 requests per day per API key
- **Multiple keys**: Use 2-3 API keys for ~100-150 requests per day
- **Monitor usage**: Check Google AI Studio console for quota status
- **Fallback system**: Application gracefully handles quota exhaustion

## 🎯 Character Speech Patterns

Each character has distinctive speech patterns that make them unique:

- **Babu**: "You know, in my experience..." / "There's something philosophical about..."
- **Aliyamma**: "Let me tell you something interesting..." / "Have you ever wondered why..."
- **Mary**: "What actually works is..." / "The practical thing to do is..."
- **Chakko**: "Let me tell you what happened..." / "You won't believe this story..."

## 🌟 Built For

Created for the "Useless Projects" Hackathon - celebrating the joy of building something fun and engaging that brings people together through technology. Sometimes the best projects are the ones that simply make people smile and feel connected to their culture and community.

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy your virtual Kerala sit-out experience!** 🏡✨

*Built with ❤️ for the "Useless Projects" Hackathon - Where technology meets tradition in the most delightful way.*