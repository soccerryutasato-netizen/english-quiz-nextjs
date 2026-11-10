"use client";
import { useEffect, useRef, useState } from "react";

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type RecognitionWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

export function usePronunciation() {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const transcriptRef = useRef("");
  const endedRef = useRef(false);
  const stopResolverRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const startRecording = async () => {
    const browser = window as RecognitionWindow;
    const SpeechRecognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("このブラウザーは音声入力に対応していません。キーボードから英語を入力してください。");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    transcriptRef.current = "";
    endedRef.current = false;

    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const finalText = results.filter(result => result.isFinal)
        .map(result => result[0]?.transcript || "").join(" ");
      const interimText = results.filter(result => !result.isFinal)
        .map(result => result[0]?.transcript || "").join(" ");
      transcriptRef.current = [finalText, interimText].filter(Boolean).join(" ").trim();
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        alert("マイクへのアクセスを許可してください");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        alert("音声を認識できませんでした。もう一度試すか、英語を入力してください。");
      }
      endedRef.current = true;
      setRecording(false);
      setProcessing(false);
      stopResolverRef.current?.("");
      stopResolverRef.current = null;
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      endedRef.current = true;
      if (stopResolverRef.current) {
        stopResolverRef.current(transcriptRef.current);
        stopResolverRef.current = null;
        recognitionRef.current = null;
        setProcessing(false);
      } else if (!transcriptRef.current) {
        recognitionRef.current = null;
        setRecording(false);
      }
    };

    try {
      recognition.start();
      setRecording(true);
    } catch {
      recognitionRef.current = null;
      alert("音声入力を開始できませんでした。英語を入力してください。");
    }
  };

  const stopRecording = async (): Promise<string> => {
    const recognition = recognitionRef.current;
    if (!recognition) return "";
    setRecording(false);
    if (endedRef.current) {
      recognitionRef.current = null;
      return transcriptRef.current;
    }
    setProcessing(true);
    return new Promise((resolve) => {
      stopResolverRef.current = resolve;
      recognition.stop();
    });
  };

  return { recording, processing, startRecording, stopRecording };
}
