"use client";
import { useState, useRef } from "react";

export function useTTS() {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = async (idx: number, text: string) => {
    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingIdx === idx) {
      setPlayingIdx(null);
      return;
    }

    setPlayingIdx(idx);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setPlayingIdx(null);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingIdx(null);
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        setPlayingIdx(null);
        URL.revokeObjectURL(url);
      };

      await audio.play();
    } catch {
      setPlayingIdx(null);
    }
  };

  return { playingIdx, play };
}
