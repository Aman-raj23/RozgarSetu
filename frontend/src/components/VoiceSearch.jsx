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
        className={`relative p-3 rounded-full transition-all duration-300 ${
          listening
            ? "bg-error text-on-error shadow-lg scale-110"
            : "bg-surface-container-low text-primary hover:bg-surface-container-high hover:shadow-md"
        }`}
        title={listening ? t("voice_stop") : t("voice_start")}
      >
        {/* Pulse ring animation when listening */}
        {listening && (
          <span className="absolute inset-0 rounded-full bg-error animate-ping opacity-30" />
        )}
        <span className={`material-symbols-outlined relative z-10 text-2xl ${listening ? "icon-fill" : ""}`}>mic</span>
      </button>

      {transcript && (
        <span className="text-sm text-on-surface-variant animate-fade-in">
          <span className="text-on-surface-variant">{t("voice_heard")} </span>
          <span className="font-semibold text-on-surface">"{transcript}"</span>
        </span>
      )}

      {listening && !transcript && (
        <span className="text-sm text-error font-medium animate-pulse">
          {t("voice_listening")}
        </span>
      )}
    </div>
  );
}
