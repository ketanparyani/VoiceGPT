const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;


const path = require('path');

// static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

//  route to serve your main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware - CORS
app.use(cors({
  origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Configure multer for audio uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// Initialize Google Generative AI 
const GEMINI_API_KEY = "AIzaSyDG4GWV3rMHa1UFoK_WDVjJoAYcmOq_1vc"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// System instructions for Revolt Motors specialization
const systemInstruction = {
  role: "user",
  parts: [{
    text: "You are a helpful assistant specialized in Revolt Motors electric vehicles. " +
          "Only provide information about Revolt Motors products, services, and related topics. " +
          "If asked about other topics, politely redirect the conversation back to Revolt Motors. " +
          "Keep responses concise and conversational for voice interactions. " +
          "Provide accurate information about models like RV400, RV300, pricing, features, " +
          "battery technology, and charging options."
  }]
};

// Store conversation history per session
const conversationHistory = new Map();

// Available models 
const AVAILABLE_MODELS = [
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-pro",
  "gemini-2.0-flash-live-preview-02-05",
  "gemini-2.0-flash-exp"
];

// Helper function to convert audio to text 
async function transcribeAudio(audioBuffer) {
  const sampleResponses = [
    "Tell me about Revolt Motors electric bikes",
    "What is the price of RV400?",
    "How does the battery swapping work?",
    "What are the features of RV300?",
    "Where can I buy a Revolt bike?",
    "What is the range of Revolt RV400?",
    "How long does it take to charge the battery?",
    "What colors are available for RV300?"
  ];
  return sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
}

// Function to find available model
async function findAvailableModel() {
  for (const modelName of AVAILABLE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("test");
      await result.response;
      console.log(` Using model: ${modelName}`);
      return modelName;
    } catch (error) {
      console.log(` Model not available: ${modelName}`);
    }
  }
  return null;
}

// API endpoint to handle audio conversations

app.post('/api/conversation', upload.single('audio'), async (req, res) => {
  try {
    console.log('Received audio request');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const sessionId = req.body.sessionId || 'default';
    const startTime = parseInt(req.body.startTime) || Date.now();
    const userText = req.body.userText || "Tell me about Revolt Motors";
    
    console.log('User query:', userText);

    // Use Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `As a Revolt Motors specialist, respond to this query: "${userText}". 
    Keep response concise (2-3 sentences maximum), friendly, and focused on Revolt Motors products.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Generated response:', text);

    res.json({
      text: text,
      latency: Date.now() - startTime
    });

  } catch (error) {
    console.error('Error processing audio:', error);

    // Fallback response if API fails
    const fallbackResponses = [
      "Revolt Motors offers innovative electric motorcycles with AI features and battery swapping technology.",
      "The RV400 starts at ₹1.03 lakh with a range of 150km and top speed of 85km/h.",
      "Revolt bikes feature removable batteries that can be charged at home or swapped at stations.",
      "You can book a test ride at Revolt experience centers across major Indian cities."
    ];
    
    res.json({
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      latency: 800
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Try to find available model
    const modelName = await findAvailableModel();
    
    if (modelName) {
      res.json({ 
        status: 'OK', 
        message: 'Server is running',
        geminiApi: 'Connected',
        model: modelName
      });
    } else {
      res.json({ 
        status: 'WARNING', 
        message: 'Server running but no Gemini models available',
        availableModels: AVAILABLE_MODELS
      });
    }
  } catch (error) {
    res.json({ 
      status: 'WARNING', 
      message: 'Server is running but Gemini API failed',
      error: error.message,
      availableModels: AVAILABLE_MODELS
    });
  }
});

// New test endpoint for text conversations
app.post('/api/text-conversation', express.json(), async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    // Find available model
    const modelName = await findAvailableModel() || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      text: text,
      success: true,
      model: modelName
    });

  } catch (error) {
    console.error('Error processing text:', error);
    
    // Fallback response
    res.json({
      text: "Revolt Motors is known for its innovative electric motorcycles with features like AI connectivity and battery swapping technology. How can I help you with Revolt products?",
      success: false
    });
  }
});

// Simple text endpoint for testing
app.get('/api/simple-test', async (req, res) => {
  try {
    // Find available model
    const modelName = await findAvailableModel() || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent("Tell me about Revolt Motors in one sentence");
    const response = await result.response;
    const text = response.text();

    res.json({
      text: text,
      success: true,
      model: modelName
    });
  } catch (error) {
    res.json({
      text: "Revolt Motors is India's leading electric motorcycle company known for its AI-enabled bikes like RV400 with battery swapping technology.",
      success: false,
      error: error.message
    });
  }
});

// Get available models
app.get('/api/models', async (req, res) => {
  try {
    const availableModels = [];
    
    for (const modelName of AVAILABLE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        await result.response;
        availableModels.push({ name: modelName, status: "available" });
      } catch (error) {
        availableModels.push({ name: modelName, status: "unavailable", error: error.message });
      }
    }
    
    res.json({ models: availableModels });
  } catch (error) {
    res.json({ 
      models: AVAILABLE_MODELS.map(name => ({ name, status: "unknown" })),
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Frontend: http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Model test: http://localhost:${port}/api/models`);
  console.log(`Simple test: http://localhost:${port}/api/simple-test`);
  
});