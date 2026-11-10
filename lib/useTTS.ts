"use client";
import { useEffect, useRef, useState } from "react";

export function useTTS() {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const playingIdxRef = useRef<number | null>(null);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const play = async (idx: number, text: string) => {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      alert("このブラウザーは音声読み上げに対応していません。");
      return;
    }

    const wasPlaying = playingIdxRef.current === idx;
    window.speechSynthesis.cancel();
    playingIdxRef.current = null;
    setPlayingIdx(null);
    if (wasPlaying) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.lang.toLowerCase() === "en-us")
      || voices.find(voice => voice.lang.toLowerCase().startsWith("en"))
      || null;
    utterance.onend = utterance.onerror = () => {
      if (playingIdxRef.current === idx) {
        playingIdxRef.current = null;
        setPlayingIdx(null);
      }
    };
    playingIdxRef.current = idx;
    setPlayingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  return { playingIdx, play };
}
