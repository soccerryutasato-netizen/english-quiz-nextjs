"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;
    setSupported(!!SR);
  }, []);

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("このブラウザは音声入力に対応していません。Chromeをお試しください。");
      return;
    }

    try {
      const recognition = new SR();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          onResultRef.current(transcript);
        }
        setListening(false);
      };

      recognition.onend = () => setListening(false);
      recognition.onerror = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      alert("音声入力を開始できませんでした。マイクの許可を確認してください。");
      setListening(false);
    }
  }, [listening]);

  return { listening, toggle, supported };
}
