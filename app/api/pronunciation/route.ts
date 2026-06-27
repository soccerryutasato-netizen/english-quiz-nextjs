import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audio = formData.get("audio") as File;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
  }

  const whisperForm = new FormData();
  whisperForm.append("file", audio, "recording.webm");
  whisperForm.append("model", "whisper-1");
  whisperForm.append("language", "en");

  const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}` },
    body: whisperForm,
  });

  if (!whisperRes.ok) {
    return NextResponse.json({ error: "音声認識に失敗しました" }, { status: 500 });
  }

  const { text: transcription } = await whisperRes.json();
  return NextResponse.json({ transcription });
}
