# 🏡 KudumbAIshree - Kerala Sit-out Chat Experience

A web-based, visually immersive platform where multiple AI personas casually chat with each other while sitting in a Kerala-style house sit-out. The conversation feels natural, unscripted, and relatable—like what you'd overhear from a group of neighbours chatting about everyday life.

## ✨ Features

- **Visual Experience**: Beautiful Kerala sit-out scene with 4 AI characters seated in fixed positions
- **Natural Conversations**: Realistic dialogue about everyday topics like weather, family, business, and local news
- **Interactive Controls**: Start, pause, and reset the conversation
- **Speech Bubbles**: Animated dialogue boxes that appear near each character
- **Conversation Log**: Real-time log of all conversations with timestamps
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🎭 Characters

1. **Retired Teacher** - Thoughtful and informed, talks about education and the past
2. **Young Mother** - Casual and caring, shares parenting stories and family updates
3. **Shop Owner** - Practical and grounded, discusses business and local economy
4. **Old Farmer** - Traditional wisdom, talks about weather, crops, and farming

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Deratheone/kudumbAIshree.git
   cd kudumbAIshree
   ```

2. **Open the project**:
   - Simply open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Start the experience**:
   - Click the "Start Chat" button to begin the conversation
   - Use "Pause" to stop the conversation temporarily
   - Use "Reset" to start over
   - Click on character seats to trigger individual messages
   - Click on speech bubbles for interactive effects

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Animations**: CSS animations and transitions

## 📁 Project Structure

```
kudumbAIshree/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── WhatsApp Image 2025-07-30 at 10.34.41 PM.jpeg  # Background image
```

## 🎨 Design Features

- **Beautiful UI**: Modern, clean design with gradient backgrounds
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Speech bubble pop-in effects and hover interactions
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Performance**: Optimized for smooth 60fps animations

## 🔧 Customization

### Adding New Characters
1. Add a new character seat in `index.html`
2. Update the character order in `script.js`
3. Add character-specific messages in the `generateMessage()` function

### Modifying Conversations
Edit the `messages` object in `script.js` to add new dialogue options for each character.

### Styling Changes
Modify `styles.css` to change colors, fonts, or layout.

## 🎯 Future Enhancements

- **Backend Integration**: Connect with Ollama for AI-generated responses
- **Text-to-Speech**: Add voice synthesis for each character
- **News Integration**: Real-time news headlines in conversations
- **Audio Effects**: Background ambient sounds
- **More Characters**: Additional AI personas
- **Conversation Themes**: Different topics and moods

## 👨‍💻 Developer

Built for "Useless Projects" Hackathon (16-hour challenge)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the project!

---

*Built with ❤️ for the "Useless Projects" Hackathon - A fun, quirky, and unconventional tech project that brings the essence of Kerala's neighborhood chit-chat to life through AI.* 