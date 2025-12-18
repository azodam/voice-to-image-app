const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend ishlayapti!' });
});

// Asosiy route - keyinroq to'ldiramiz
app.post('/api/generate-image', async (req, res) => {
  console.log('📝 Request keldi:', req.body);
  
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Matn kiritilmagan!' });
    }

    // 1. Ollama bilan prompt yaratish
    console.log('🤖 Ollama bilan ishlayapman...');
    
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: `You are an expert at creating image generation prompts. Convert this user request into a detailed, descriptive prompt for an AI image generator. Only respond with the prompt, nothing else.

User request: "${text}"

Image prompt:`,
        stream: false
      })
    });

    const ollamaData = await ollamaResponse.json();
    const imagePrompt = ollamaData.response.trim();
    
    console.log('✅ Ollama javobi:', imagePrompt);

    // 2. Pollinations.ai bilan rasm generatsiya qilish
    console.log('🎨 Rasm yaratyapman...');
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true`;
    
    console.log('✅ Rasm tayyor!');

    // Javob qaytarish
    res.json({
      success: true,
      data: {
        originalText: text,
        imagePrompt: imagePrompt,
        imageUrl: imageUrl,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Xato:', error);
    res.status(500).json({ 
      error: 'Server xatosi',
      details: error.message 
    });
  }
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishlamoqda`);
  console.log('📌 Ollama ishga tushganini tekshiring: http://localhost:11434');
});