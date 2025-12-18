// 1. Kerakli kutubxonalar
const express = require('express');
const cors = require('cors');

// Node 18+ (sizda 24) da fetch global, import shart emas

// 2. App yaratish
const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. ROUTE (sizning kodingiz)
app.post('/api/generate-image', async (req, res) => {
  console.log('📝 Request keldi:', req.body);
  
  try {
    const { text, style } = req.body;
    
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
        prompt: `You are an expert at creating image generation prompts. Convert this user request into a detailed, descriptive prompt for an AI image generator.

Style requirements: ${style || 'realistic, detailed'}

User request: "${text}"

Create a detailed prompt (only the prompt, no explanation):`,
        stream: false
      })
    });

    const ollamaData = await ollamaResponse.json();
    const imagePrompt = ollamaData.response.trim();
    
    console.log('✅ Ollama javobi:', imagePrompt);

    // 2. Pollinations.ai bilan rasm
    console.log('🎨 Rasm yaratyapman...');
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true&enhance=true`;
    
    console.log('✅ Rasm tayyor!');

    res.json({
      success: true,
      data: {
        originalText: text,
        imagePrompt,
        imageUrl,
        style,
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

// 5. SERVERNI ISHGA TUSHIRISH
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`);
});
