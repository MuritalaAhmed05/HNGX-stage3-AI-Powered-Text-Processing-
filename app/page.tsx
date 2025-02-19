'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';



interface Translator {
  create: (options: { sourceLanguage: string; targetLanguage: string }) => Promise<{ translate: (text: string) => Promise<string> }>;
}

interface LanguageDetector {
  create: () => Promise<{ detect: (text: string) => Promise<{ detectedLanguage: string }[]> }>;
}

interface AI {
  translator?: Translator;
  languageDetector?: LanguageDetector;
}

declare const self: { ai?: AI }

const languageMap: Record<string, string> = {
  en: 'English',
  zh: 'Mandarin Chinese (Simplified)',
  'zh-Hant': 'Taiwanese Mandarin (Traditional)',
  ja: 'Japanese',
  pt: 'Portuguese',
  ru: 'Russian',
  es: 'Spanish',
  tr: 'Turkish',
  hi: 'Hindi',
  vi: 'Vietnamese',
  bn: 'Bengali',
  fr: 'French',
};

interface Message {
  text: string;
  detectedLang: string;
  translation: string;
  targetLang: string;
}

export default function ChatTranslator() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiSupported, setApiSupported] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (self.ai?.translator && self.ai?.languageDetector) {
      setApiSupported(true);
    } else {
      setApiSupported(false);
    }
  }, []);


  const sendMessage = async () => {
    if (!text.trim()) return;
    setError('');
    const newMessage: Message = { text, detectedLang: '', translation: '', targetLang: '' };
    setMessages((prev) => [...prev, newMessage]);
    setText('');


    setTimeout(() => {
      scrollToBottom();
    }, 100)

    try {
      if (self.ai?.languageDetector) {
        const detector = await self.ai.languageDetector.create();
        const results = await detector.detect(newMessage.text);
        if (results.length > 0) {
          newMessage.detectedLang = results[0].detectedLanguage;
        } else {
          newMessage.detectedLang = 'Unknown';
        }
      } else {
        setError('Language detector is not available.');
      }
    } catch (err) {
      setError('Error detecting language. Please try again.');
      console.error(err);
    }

    setMessages((prev) => [...prev.slice(0, -1), newMessage]);
  };

  const translateMessage = async (index: number, targetLang: string) => {
    if (!targetLang) {
      setError('Please select a language to translate to.');
      return;
    }

    setLoading(true);
    try {
      if (self.ai?.translator) {
        const translator = await self.ai.translator.create({
          sourceLanguage: messages[index].detectedLang || 'en',
          targetLanguage: targetLang,
        });
        const result = await translator.translate(messages[index].text);
        const updatedMessages = [...messages];
        updatedMessages[index] = { ...messages[index], translation: result, targetLang };
        setMessages(updatedMessages);
      } else {
        setError('Translator is not available.');
      }
    } catch (err) {
      setError('Error translating message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
       <div className="w-full mx-auto bg-white dark:bg-gray-900 h-[600px] flex flex-col rounded-xl shadow-lg overflow-hidden">
      <header className="border-b p-4 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold">Translation Assistant</h2>
      </header>

      {!apiSupported && (
        <div className="m-4 p-3 bg-red-500 text-white rounded-lg">
          Chrome AI Translator API is not supported in this environment.
        </div>
      )}

      <main className="flex-grow p-4 overflow-y-auto flex flex-col-reverse">
        <div className="space-y-4">
          <div ref={messagesEndRef} />
          {messages.map((msg, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-blue-500 dark:bg-blue-600 p-3 rounded-lg rounded-tr-none text-white">
                  <p>{msg.text}</p>
                  {msg.detectedLang && (
                    <span className="text-xs text-blue-100 block mt-1">
                      Detected: {languageMap[msg.detectedLang] || msg.detectedLang}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end items-center gap-2">
                <select
                  className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm"
                  value={msg.targetLang}
                  onChange={(e) => setMessages((prev) => {
                    const updated = [...prev];
                    updated[index].targetLang = e.target.value;
                    return updated;
                  })}
                >
                  <option value="">Select language</option>
                  {Object.entries(languageMap).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => translateMessage(index, msg.targetLang)}
                  disabled={loading || !msg.targetLang}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
                >
                  {loading ? "Translating..." : "Translate"}
                </button>
              </div>

              {msg.translation && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] bg-gray-200 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none">
                    <p>{msg.translation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex w-full gap-2">
          <textarea
            className="flex-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[60px] max-h-[120px] resize-y"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage} className="h-[60px] w-[60px] bg-blue-500 dark:bg-blue-600 text-white rounded-lg flex items-center justify-center">
            <Send className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-500 text-white rounded-lg">{error}</div>
        )}
      </footer>
    </div>
  );
}
