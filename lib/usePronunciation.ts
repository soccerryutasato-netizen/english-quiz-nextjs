"use client";
import { useState, useRef } from "react";

export type PronunciationResult = {
  transcription: string;
  accuracy: number;
  feedback: string;
  expected: string;
};

export function usePronunciation() {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      alert("マイクへのアクセスを許可してください");
    }
  };

  const stopRecording = async (expectedText: string) => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        setRecording(false);
        setProcessing(true);

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);
        formData.append("expectedText", expectedText);

        try {
          const res = await fetch("/api/pronunciation", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.error) {
            setResult({ transcription: "", accuracy: 0, feedback: data.error, expected: expectedText });
          } else {
            setResult(data);
          }
        } catch {
          setResult({ transcription: "", accuracy: 0, feedback: "通信エラーが発生しました💦", expected: expectedText });
        }
        setProcessing(false);
        resolve();
      };

      mediaRecorderRef.current!.stop();
      mediaRecorderRef.current!.stream.getTracks().forEach(t => t.stop());
    });
  };

  const clearResult = () => setResult(null);

  return { recording, processing, result, startRecording, stopRecording, clearResult };
}
