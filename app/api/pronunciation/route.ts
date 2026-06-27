import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audio = formData.get("audio") as File;
  const expectedText = formData.get("expectedText") as string;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
  }

  // Send to Whisper API
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

  // Compare transcription with expected text
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  const expected = normalize(expectedText);
  const actual = normalize(transcription);

  const expectedWords = expected.split(" ");
  const actualWords = actual.split(" ");

  let matchCount = 0;
  for (let i = 0; i < expectedWords.length; i++) {
    if (actualWords[i] === expectedWords[i]) matchCount++;
  }

  const accuracy = expectedWords.length > 0 ? Math.round((matchCount / expectedWords.length) * 100) : 0;

  let feedback = "";
  if (accuracy >= 90) feedback = "素晴らしい発音です！🎉✨ ネイティブに近い発音ができています！";
  else if (accuracy >= 70) feedback = "いい感じ！👍✨ もう少しで完璧です！";
  else if (accuracy >= 50) feedback = "がんばった！💪 もう一回チャレンジしてみよう！";
  else feedback = "もう一度ゆっくり言ってみよう！🔥 大丈夫、練習あるのみ！";

  return NextResponse.json({
    transcription,
    accuracy,
    feedback,
    expected: expectedText,
  });
}
