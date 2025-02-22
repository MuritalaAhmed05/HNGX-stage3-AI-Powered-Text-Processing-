"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Globe, Sparkles, MessageSquare } from "lucide-react";
import SplashCursor from "../../components/SplashCursor/SplashCursor";
import { ModeToggle } from "@/components/ui/theme-btn";

interface Translator {
  create: (options: {
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<{ translate: (text: string) => Promise<string> }>;
}

interface LanguageDetector {
  create: () => Promise<{
    detect: (text: string) => Promise<{ detectedLanguage: string }[]>;
  }>;
}

interface Summarizer {
  create: (options: {
    type: string;
    format: string;
    length: string;
  }) => Promise<{ summarize: (text: string) => Promise<string> }>;
}

interface AI {
  translator?: Translator;
  languageDetector?: LanguageDetector;
  summarizer?: Summarizer;
}

declare const self: { ai?: AI };

const languageMap: Record<string, string> = {
  en: "English",
  zh: "Mandarin Chinese (Simplified)",
  "zh-Hant": "Taiwanese Mandarin (Traditional)",
  ja: "Japanese",
  pt: "Portuguese",
  ru: "Russian",
  es: "Spanish",
  tr: "Turkish",
  hi: "Hindi",
  vi: "Vietnamese",
  bn: "Bengali",
  fr: "French",
};

interface Message {
  text: string;
  detectedLang: string;
  translation: string;
  targetLang: string;
  timestamp: string;
  summary?: string;
}

export default function ChatTranslator() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiSupported, setApiSupported] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [summarizingIndex, setSummarizingIndex] = useState<number | null>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (self.ai?.translator && self.ai?.languageDetector) {
      setApiSupported(true);
    } else {
      setApiSupported(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    setError("");

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newMessage: Message = {
      text,
      detectedLang: "",
      translation: "",
      targetLang: "",
      timestamp,
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      if (self.ai?.languageDetector) {
        const detector = await self.ai.languageDetector.create();
        const results = await detector.detect(newMessage.text);
        if (results.length > 0) {
          newMessage.detectedLang = results[0].detectedLanguage;
        } else {
          newMessage.detectedLang = "Unknown";
        }
      } else {
        setError("Language detector is not available.");
      }
    } catch (err) {
      setError("Error detecting language. Please try again.");
      console.error(err);
    }

    setMessages((prev) => [...prev.slice(0, -1), newMessage]);
  };

  const translateMessage = async (index: number, targetLang: string) => {
    if (!targetLang) {
      setError("Please select a language to translate to.");
      return;
    }

    setLoading(true);
    try {
      if (self.ai?.translator) {
        const translator = await self.ai.translator.create({
          sourceLanguage: messages[index].detectedLang || "en",
          targetLanguage: targetLang,
        });
        const result = await translator.translate(messages[index].text);
        const updatedMessages = [...messages];
        updatedMessages[index] = {
          ...messages[index],
          translation: result,
          targetLang,
        };
        setMessages(updatedMessages);
      } else {
        setError("Translator is not available.");
      }
    } catch (err) {
      setError("Error translating message. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const summarizeMessage = async (index: number) => {
    setSummarizingIndex(index);

    try {
      if (self.ai?.summarizer) {
        const summarizer = await self.ai.summarizer.create({
          type: "tl;dr",
          format: "plain-text",
          length: "medium",
        });
        const summary = await summarizer.summarize(messages[index].text);
        const updatedMessages = [...messages];
        updatedMessages[index].summary = summary;
        setMessages(updatedMessages);
      }
    } catch (err) {
      setError("Error summarizing message. Please try again.");
      console.error("Error summarizing message:", err);
    } finally {
      setSummarizingIndex(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#060606] lg:px-[7rem] md:px-[5rem] transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SplashCursor />
      </div>

      <div className="w-full mx-auto bg-white dark:bg-[#060606] h-screen flex flex-col dark:shadow-xl overflow-hidden relative z-10 transition-colors duration-300">
        {error && (
          <div className="fixed z-10 top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in">
            {error}
          </div>
        )}

        <header className="border-b flex justify-between border-black/20 dark:border-white/20 p-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-purple-600 dark:text-white animate-spin-slow" />
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              AI-Powered Text Processing
            </h2>
            <span className="animate-bounce">✨</span>
          </div>
          <div>
            <ModeToggle />
          </div>
        </header>

        {!apiSupported && (
          <div className="m-4 p-3 bg-red-500 text-white rounded-lg">
            Chrome AI Translator API is not supported in this environment.
          </div>
        )}

        <main className="flex-grow p-4 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-gray-100 dark:bg-white/95 p-4 rounded-2xl rounded-tr-none shadow-lg backdrop-blur-sm mt-5 transition-colors duration-300">
                    <p className="text-black">{msg.text}</p>
                    <div className="flex justify-between gap-4 items-center">
                      {msg.detectedLang && (
                        <span className="text-xs text-blue-600 block mt-1 font-medium">
                          Language:{" "}
                          {languageMap[msg.detectedLang] || msg.detectedLang}
                        </span>
                      )}
                      <span className="text-xs text-gray-700 dark:text-black/90 text-center mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                    {msg.text.length > 150 &&
                      msg.detectedLang === "en" &&
                      !msg.summary && (
                        <button
                          onClick={() => summarizeMessage(index)}
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                          disabled={summarizingIndex === index}
                        >
                          {summarizingIndex === index ? (
                            <>
                              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                              Summarizing...
                            </>
                          ) : (
                            "Summarize"
                          )}
                        </button>
                      )}
                  </div>
                </div>

                <div className="flex justify-end items-center gap-2">
                  <select
                    className="p-2 bg-white text-gray-800 backdrop-blur-sm border-0 rounded-xl text-sm shadow-lg focus:ring-2 focus:ring-purple-400 max-w-[200px] transition-colors duration-300"
                    value={msg.targetLang}
                    onChange={(e) =>
                      setMessages((prev) => {
                        const updated = [...prev];
                        updated[index].targetLang = e.target.value;
                        return updated;
                      })
                    }
                  >
                    <option value="">Select language ✨</option>
                    {Object.entries(languageMap).map(([code, name]) => (
                      <option
                        key={code}
                        value={code}
                        className="bg-white dark:bg-[#060606] hover:bg-gray-100 dark:hover:bg-[#121212] text-black dark:text-white max-w-[200px]"
                      >
                        {name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => translateMessage(index, msg.targetLang)}
                    disabled={loading || !msg.targetLang}
                    className="px-4 text-gray-900 py-2 bg-gray-100 dark:bg-white/90 hover:bg-gray-200 dark:hover:bg-white/100 rounded-xl text-sm shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {loading ? "Translating..." : "Translate"}
                  </button>
                </div>

                {msg.translation && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-purple-200 dark:bg-purple-100 p-4 rounded-2xl rounded-tl-none shadow-lg mt-5">
                      <p className="text-black">{msg.translation}</p>
                      <span className="text-xs text-gray-700 dark:text-black/90 text-center mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                )}

                {msg.summary && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-purple-200 dark:bg-purple-100 p-4 rounded-2xl rounded-tl-none shadow-lg mt-5">
                      <p className="mt-2 text-sm italic text-gray-700 dark:text-gray-800">
                        {msg.summary}
                      </p>
                      <span className="text-xs text-gray-700 dark:text-black/90 text-center mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <footer className="border-t text-center p-4 bg-gray-100 dark:bg-[#121212] transition-colors duration-300">
          <div className="flex items-end w-full gap-2 p-2">
            <div className="flex-grow bg-gray-200 dark:bg-[#181818] backdrop-blur-sm rounded-2xl shadow-lg p-2 transition-colors duration-300">
              <textarea
                className="w-full bg-transparent resize-none min-h-[20px] max-h-[90px] text-black dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-500 border-0 overflow-y-auto outline-none transition-colors duration-300"
                placeholder="Enter your text here... ✨"
                value={text}
                rows={1}
                style={{ height: "auto" }}
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>

            <button
              onClick={() => {
                sendMessage();
                setText("");
              }}
              className="h-[40px] w-[40px] bg-purple-600 dark:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <span className="text-[12px] text-center text-gray-700 dark:text-white">
            This AI can make mistakes. It is still under construction!!
          </span>
        </footer>
      </div>
    </div>
  );
}
