'use client';

import { useState } from 'react';

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Ovozni yozish funksiyasi
  const startRecording = () => {
    // Browser Speech Recognition ni tekshirish
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Brauzeringiz ovozni taniy olmaydi! Chrome yoki Edge ishlatib ko\'ring.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Ingliz tili (o'zbek tili uchun 'uz-UZ')
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsRecording(true);
    setError('');
    setTranscript('');
    setImagePrompt('');
    setImageUrl('');

    recognition.onstart = () => {
      console.log('🎤 Ovoz yozilmoqda...');
    };

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      console.log('📝 Siz aytdingiz:', text);
      setTranscript(text);
      
      // Backend'ga yuborish
      await generateImage(text);
    };

    recognition.onerror = (event: any) => {
      console.error('❌ Xato:', event.error);
      setError(`Xato: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log('🛑 Ovoz yozish tugadi');
      setIsRecording(false);
    };

    recognition.start();
  };

  // Backend'ga so'rov yuborish
  const generateImage = async (text: string) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('📤 Backend\'ga yuborish...');
      
      const response = await fetch('http://localhost:5000/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Backend xatosi');
      }

      const data = await response.json();
      console.log('📥 Backend javobi:', data);

      setImagePrompt(data.data.imagePrompt);
      setImageUrl(data.data.imageUrl);

    } catch (err) {
      console.error('❌ Xato:', err);
      setError('Rasm yaratishda xatolik yuz berdi. Backend ishga tushganini tekshiring!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎤 Voice to Image
          </h1>
          <p className="text-white text-lg opacity-90">
            Gapiring va AI rasm yaratasin!
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          
          {/* Record Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={startRecording}
              disabled={isRecording || isLoading}
              className={`
                px-12 py-6 rounded-full text-xl font-bold text-white
                transition-all duration-300 transform hover:scale-105
                ${isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : isLoading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl'
                }
              `}
            >
              {isRecording ? '🎤 Tinglamoqda...' : isLoading ? '⏳ Kutilmoqda...' : '🎤 Bosing va Gapiring'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              ❌ {error}
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">📝 Siz aytdingiz:</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">{transcript}</p>
              </div>
            </div>
          )}

          {/* Image Prompt */}
          {imagePrompt && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">🤖 AI Prompt:</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm">{imagePrompt}</p>
              </div>
            </div>
          )}

          {/* Generated Image */}
          {imageUrl && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎨 Yaratilgan Rasm:</h2>
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={imageUrl} 
                  alt="Generated" 
                  className="w-full h-auto"
                  onError={() => {
                    console.error('Rasm yuklanmadi');
                    setError('Rasm yuklanmadi, qayta urinib ko\'ring');
                  }}
                />
              </div>
              
              {/* Download Button */}
              <div className="mt-4 flex justify-center">
                <a
                  href={imageUrl}
                  download="generated-image.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  📥 Rasmni Yuklash
                </a>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-gray-600 text-lg">AI rasm yaratyapti...</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white opacity-75">
          <p>Powered by Ollama + Pollinations.ai</p>
        </div>

      </div>
    </div>
  );
}