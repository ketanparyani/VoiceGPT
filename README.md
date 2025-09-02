# Revolt Motors Voice Assistant

A voice-enabled AI assistant specialized in Revolt Motors electric vehicles, powered by Google's Gemini AI.

## Features

- **Voice Interaction**: Speak naturally to ask questions about Revolt Motors
- **Real-time Responses**: Get immediate AI-powered answers
- **Interruption Support**: Interrupt the AI at any time by clicking or pressing spacebar
- **Text-to-Speech**: AI responses are spoken aloud
- **Low Latency**: Optimized for quick response times
- **Multi-language Support**: Works with various languages
- **Specialized Knowledge**: Focused exclusively on Revolt Motors products

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Web Speech API)
- **Backend**: Node.js, Express.js
- **AI API**: Google Gemini AI
- **Audio Processing**: Web Audio API, MediaRecorder API

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Google Gemini API key

### Setup Steps

1. **Clone or download the project files**

2. **Set up the backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Add your Gemini API key**:
   - Add your API key: const GEMINI_API_KEY = "Replace the Actual Gemini API Key at server.js"
4. **Start the backend server**:
   ```bash
   npm run dev
   ```

5. **Start the frontend**:
   - Open the `index.html` file in a web browser
   - Or serve it using a local server:
     ```bash
     # Using Node.js http-server
     npx http-server
     ```

6. **Access the application**:
   - Frontend: http://localhost:8000 (or whichever port you use)
   - Backend: http://localhost:3001

## Usage

1. **Click the microphone button** to start recording
2. **Speak your question** about Revolt Motors
3. **Click again** to stop recording and get a response
4. **Interrupt anytime** by clicking in the chat area or pressing spacebar

### Example Questions

- "Tell me about the Revolt RV400"
- "What is the price of RV300?"
- "How does battery swapping work?"
- "What is the range of RV400?"
- "Where can I buy a Revolt bike?"

## API Endpoints

- `POST /api/conversation` - Process audio and return AI response
- `GET /health` - Health check endpoint
- `GET /api/test` - Test endpoint for Gemini API
- `GET /api/models` - List available AI models

## Project Structure

```
revolt-voice-assistant/
├── frontend/
│   └── index.html          # Main frontend application
├── backend/
│   ├── server.js           # Express server with API routes
│   ├── package.json        # Dependencies and scripts
└── README.md              # This file
```

## Configuration


const GEMINI_API_KEY= Replace the Actual Gemini API Key at server.js


### CORS Settings

The server is configured to allow requests from:
- http://localhost:3001
- http://localhost:8080
- http://127.0.0.1:8080

## Troubleshooting

### Common Issues

1. **Microphone access denied**
   - Ensure your browser has microphone permissions
   - Use HTTPS in production environments

2. **CORS errors**
   - Make sure frontend and backend are on allowed origins
   - Check the CORS configuration in server.js

3. **API errors**
   - Verify your Gemini API key is valid
   - Check your API quota and billing settings

4. **Speech recognition not working**
   - Use Chrome for best compatibility
   - Check browser support for Web Speech API

### Debug Mode

Enable debugging by checking the browser console (F12) for detailed error messages.

## Browser Support

- **Chrome**: Full support (recommended)


### Adding New Features

1. **Modify frontend** in `index.html`
2. **Add API endpoints** in `server.js`
3. **Test locally** before deployment



## License

This project is created for demonstration purposes.

## Support

For issues related to:
- API keys: Visit [Google AI Studio](https://aistudio.google.com/)
- Technical problems: Check the browser console for error messages
- Revolt Motors information: Visit [Revolt Motors Official Website](https://www.revoltmotors.com/)
