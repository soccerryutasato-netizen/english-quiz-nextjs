"use client";
import { useState, useRef } from "react";

export function usePronunciation() {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
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

  const stopRecording = async (): Promise<string> => {
    if (!mediaRecorderRef.current) return "";

    return new Promise((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        setRecording(false);
        setProcessing(true);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);
        try {
          const res = await fetch("/api/pronunciation", { method: "POST", body: formData });
          const data = await res.json();
          setProcessing(false);
          resolve(data.transcription || "");
        } catch {
          setProcessing(false);
          resolve("");
        }
      };
      mediaRecorderRef.current!.stop();
      mediaRecorderRef.current!.stream.getTracks().forEach(t => t.stop());
    });
  };

  return { recording, processing, startRecording, stopRecording };
}
