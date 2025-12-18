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

