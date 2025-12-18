'use client';

import { useState, useEffect } from 'react';

// Til sozlamalari
const LANGUAGES = {
  en: { code: 'en-US', name: 'English', flag: '🇺🇸' },
  ru: { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' }
};

// Rasm uslublari
const STYLES = [
  { id: 'realistic', name: 'Realistic', emoji: '📸', prompt: 'photorealistic, highly detailed, 4K' },
  { id: 'cartoon', name: 'Cartoon', emoji: '🎨', prompt: 'cartoon style, animated, colorful' },
  { id: 'anime', name: 'Anime', emoji: '🎌', prompt: 'anime style, manga, japanese animation' },
  { id: 'oil', name: 'Oil Painting', emoji: '🖼️', prompt: 'oil painting, classical art, brush strokes' },
  { id: 'digital', name: 'Digital Art', emoji: '💻', prompt: 'digital art, concept art, artstation' }
];

// Tarix uchun interface
interface HistoryItem {
  id: string;
  text: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  style: string;
  language: string;
}

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Yangi state'lar
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof LANGUAGES>('en');
  const [selectedStyle, setSelectedStyle] = useState<string>('realistic');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // LocalStorage'dan tarixni yuklash
  useEffect(() => {
    const savedHistory = localStorage.getItem('voiceToImageHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Tarixni saqlash
  const saveToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 20); // Faqat 20 ta saqlash
    setHistory(newHistory);
    localStorage.setItem('voiceToImageHistory', JSON.stringify(newHistory));
  };

  // Tarixni tozalash
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('voiceToImageHistory');
  };

  // Ovozni yozish
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Browser ovozni taniy olmaydi! Chrome yoki Edge ishlatib ko\'ring.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANGUAGES[selectedLanguage].code;
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

  // Backend'ga so'rov
  const generateImage = async (text: string) => {
    setIsLoading(true);
    setError('');

    try {
      const stylePrompt = STYLES.find(s => s.id === selectedStyle)?.prompt || '';
      
      const response = await fetch('http://localhost:5000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          style: stylePrompt 
        }),
      });

      if (!response.ok) throw new Error('Backend xatosi');

      const data = await response.json();
      const prompt = data.data.imagePrompt;
      const url = data.data.imageUrl;

      setImagePrompt(prompt);
      setImageUrl(url);

      // Tarixga saqlash
      saveToHistory({
        id: Date.now().toString(),
        text,
        prompt,
        imageUrl: url,
        timestamp: new Date().toISOString(),
        style: selectedStyle,
        language: selectedLanguage
      });

    } catch (err) {
      console.error('❌ Xato:', err);
      setError('Rasm yaratishda xatolik. Backend ishga tushganini tekshiring!');
    } finally {
      setIsLoading(false);
    }
  };

  // Tarixdan rasmni ko'rsatish
  const loadFromHistory = (item: HistoryItem) => {
    setTranscript(item.text);
    setImagePrompt(item.prompt);
    setImageUrl(item.imageUrl);
    setSelectedStyle(item.style);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎤 Voice to Image AI
          </h1>
          <p className="text-white text-lg opacity-90">
            Gapiring va AI rasm yaratasin!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sozlamalar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-4">
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Sozlamalar</h2>
              
              {/* Til tanlash */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌐 Til / Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(LANGUAGES).map(([key, lang]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedLanguage(key as keyof typeof LANGUAGES)}
                      className={`
                        p-3 rounded-lg border-2 transition-all text-sm font-semibold
                        ${selectedLanguage === key 
                          ? 'border-purple-600 bg-purple-50 text-purple-700' 
                          : 'border-gray-200 hover:border-purple-300'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="text-xs">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uslub tanlash */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🎨 Rasm Uslubi / Art Style
                </label>
                <div className="space-y-2">
                  {STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`
                        w-full p-3 rounded-lg border-2 transition-all text-left
                        ${selectedStyle === style.id 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{style.emoji}</span>
                        <span className="font-semibold text-gray-700">{style.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarix tugmasi */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                📚 Tarix ({history.length})
              </button>

            </div>
          </div>

          {/* Asosiy qism */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              
              {/* Yozish tugmasi */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={startRecording}
                  disabled={isRecording || isLoading}
                  className={`
                    px-8 md:px-12 py-4 md:py-6 rounded-full text-lg md:text-xl font-bold text-white
                    transition-all duration-300 transform hover:scale-105
                    ${isRecording 
                      ? 'bg-red-500 animate-pulse' 
                      : isLoading 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl'
                    }
                  `}
                >
                  {isRecording ? '🎤 Tinglamoqda...' : isLoading ? '⏳ Kutilmoqda...' : '🎤 Bosib Gapiring'}
                </button>
              </div>

              {/* Xato */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  ❌ {error}
                </div>
              )}

              {/* Matn */}
              {transcript && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">📝 Siz aytdingiz:</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700">{transcript}</p>
                  </div>
                </div>
              )}

              {/* Prompt */}
              {imagePrompt && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">🤖 AI Prompt:</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">{imagePrompt}</p>
                  </div>
                </div>
              )}

              {/* Rasm */}
              {imageUrl && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🎨 Yaratilgan Rasm:</h3>
                  <div className="relative rounded-xl overflow-hidden shadow-xl">
                    <img 
                      src={imageUrl} 
                      alt="Generated" 
                      className="w-full h-auto"
                      onError={() => setError('Rasm yuklanmadi')}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <a
                      href={imageUrl}
                      download="generated-image.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      📥 Yuklab Olish
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
          </div>

        </div>

        {/* Tarix Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📚 Tarix</h2>
                <div className="space-x-2">
                  <button
                    onClick={clearHistory}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    🗑️ Tozalash
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    ✕ Yopish
                  </button>
                </div>
              </div>

              {history.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Tarix bo'sh</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map(item => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-500 transition-all"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt="History" 
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm text-gray-700 font-semibold mb-1 truncate">
                        {item.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white opacity-75">
          <p>Powered by Ollama + Pollinations.ai</p>
        </div>

      </div>
    </div>
  );
}
