import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function VoiceSearch({ onResult, className = "" }) {
  const { lang, t } = useLanguage();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);

  // Keep onResult ref up to date without causing re-creation
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // Create/recreate SpeechRecognition when language changes
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    // Abort old instance if any
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      if (event.results[0].isFinal) {
        setListening(false);
        onResultRef.current?.(result);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      // Auto-retry on network errors
      if (event.error === "network") {
        setTranscript("");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.abort(); } catch (e) { /* ignore */ }
    };
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        // Recreate if in bad state
        setListening(false);
      }
    }
  };

  if (!supported) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        className={`relative p-4 rounded-2xl transition-all duration-300 ${
          listening
            ? "bg-danger-500 text-white shadow-lg shadow-danger-500/30 scale-110"
            : "bg-primary-50 text-primary-600 hover:bg-primary-100 hover:shadow-md"
        }`}
        title={listening ? t("voice_stop") : t("voice_start")}
      >
        {/* Pulse ring animation when listening */}
        {listening && (
          <span className="absolute inset-0 rounded-2xl bg-danger-500 animate-ping opacity-30" />
        )}
        <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>

      {transcript && (
        <span className="text-sm text-dark-500 animate-fade-in">
          <span className="text-dark-400">{t("voice_heard")} </span>
          <span className="font-semibold text-dark-700">"{transcript}"</span>
        </span>
      )}

      {listening && !transcript && (
        <span className="text-sm text-danger-500 font-medium animate-pulse">
          {t("voice_listening")}
        </span>
      )}
    </div>
  );
}
