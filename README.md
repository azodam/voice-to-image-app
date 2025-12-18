2. Install Ollama and download model
# Install Ollama (if not already installed)
curl -fsSL https://ollama.com/install.sh | sh

# Download the model
ollama pull llama3.2

# Start Ollama server
ollama serve
3. Setup Backend
cd backend
npm install
npm run dev
Backend will run on http://localhost:5000
4. Setup Frontend
Open a new terminal:
cd frontend
npm install
npm run dev
Frontend will run on http://localhost:3000
📖 Usage
Open your browser and navigate to http://localhost:3000
Click the "Bosing va Gapiring" button (or "Click and Speak")
Allow microphone access when prompted
Speak your image description in English
Example: "A beautiful sunset over mountains with a lake"
Wait for the AI to process and generate your image
Download your generated image using the download button
🖼️ Screenshots
Main Interface
�
Load image
Voice Recording
�
Load image
Generated Image
�
Load image
🔧 Configuration
Change LLM Model
Edit backend/server.js:
model: 'llama3.2', // Change to: 'mistral', 'codellama', etc.
Change Voice Language
Edit frontend/app/page.tsx:
recognition.lang = 'en-US'; // Change to: 'uz-UZ', 'ru-RU', etc.
🐛 Troubleshooting
Issue: "Backend xatosi" (Backend Error)
Solution: Make sure backend is running:
cd backend
npm run dev
Issue: "Brauzeringiz ovozni taniy olmaydi"
Solution: Use Chrome or Edge browser (Firefox doesn't support Web Speech API well)
Issue: Ollama connection error
Solution: Check if Ollama is running:
curl http://localhost:11434
If not running:
ollama serve
📝 API Endpoints:
POST /api/generate-image
Generate image from voice text.
Request Body:
{
  "text": "your voice transcript here"
}
Response:
{
  "success": true,
  "data": {
    "originalText": "your voice transcript",
    "imagePrompt": "AI-generated detailed prompt",
    "imageUrl": "https://image.pollinations.ai/...",
    "timestamp": "2024-12-18T10:30:00.000Z"
  }
}
🤝 Contributing:
Contributions are welcome! Please feel free to submit a Pull Request.
Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License:
This project is licensed under the MIT License.
🙏 Acknowledgments:
-Ollama - For providing free local LLM
-Pollinations.ai - For free image generation API
-Next.js - For the amazing React framework
-Tailwind CSS - For beautiful styling
📧 Contact:
Project Link: https://github.com/azodam/voice-to-image-app

# 🎤 Voice to Image AI

A modern **Voice-to-Image AI web application** that allows users to **speak**, convert speech into text, generate an **AI image prompt**, and create images using AI models.

This project uses:
- **Speech Recognition (Browser API)**
- **Ollama (LLM for prompt generation)**
- **Pollinations.ai (Image generation)**
- **Next.js + React + Tailwind CSS**
- **Express.js Backend**

---

## ✨ Features

### 🎤 Voice Recognition
- Speak instead of typing
- Uses browser Speech Recognition API
- Supports multiple languages

### 🌐 Multi-Language Support
Currently supported:
- 🇺🇸 English (`en-US`)
- 🇷🇺 Russian (`ru-RU`)

Language affects **speech recognition accuracy**.

---

### 🎨 Image Style Categories
Users can select different **art styles** before generating an image:

| Style | Description |
|------|------------|
| 📸 Realistic | Photorealistic, highly detailed |
| 🎨 Cartoon | Animated, colorful style |
| 🎌 Anime | Japanese anime / manga |
| 🖼️ Oil Painting | Classical oil painting |
| 💻 Digital Art | Concept art, ArtStation style |

Each style modifies the **AI prompt automatically**.

---

### 📚 Generation History
- Automatically saves generated images
- Stored in **LocalStorage**
- View previous prompts and images
- Click history item to reload it
- Maximum **20 items**
- Option to clear history

---

### 🧠 AI Prompt Generation
- User speech → text
- Text is sent to **Ollama (LLM)**
- Ollama converts it into a **detailed image prompt**
- Prompt is used for image generation

---

## 🏗️ Tech Stack

### Frontend
- Next.js (App Router)
- React (Client Components)
- Tailwind CSS
- Browser SpeechRecognition API

### Backend
- Node.js (18+)
- Express.js
- Ollama (local LLM server)
- Pollinations.ai (image generation)

---

## 🔧 Backend API

### Endpoint

POST /api/generate-image:

### Request Body
```json
{
  "text": "A cat riding a bicycle",
  "style": "anime style, manga, japanese animation"
}


Response:
{
  "success": true,
  "data": {
    "originalText": "A cat riding a bicycle",
    "imagePrompt": "A detailed anime-style illustration of a cat riding a bicycle...",
    "imageUrl": "https://image.pollinations.ai/...",
    "style": "anime",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}

🗂️ Backend (server.js) Explanation

1️⃣ Import required libraries
const express = require('express');
const cors = require('cors');

2️⃣ Create Express app
const app = express();

3️⃣ Middleware
app.use(cors());
app.use(express.json());

4️⃣ Image Generation Route
app.post('/api/generate-image', async (req, res) => {

Flow:

Receive text and style from frontend

Send request to Ollama

Ollama generates a detailed image prompt

Create image URL using Pollinations.ai

Send result back to frontend

▶️ How to Run the Project
1️⃣ Start Ollama

Make sure Ollama is running locally:

ollama run llama3.2

2️⃣ Start Backend
cd backend
node server.js


Backend will run at:

http://localhost:5000

3️⃣ Start Frontend
npm install
npm run dev


Frontend will run at:

http://localhost:3000

⚠️ Browser Requirements

Google Chrome (recommended)

Microsoft Edge

Speech Recognition does NOT work in Firefox

📌 Notes

History is stored locally (LocalStorage)

Images are generated via public Pollinations.ai API

Ollama must be running locally