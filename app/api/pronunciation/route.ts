import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const PRONUNCIATION_PROMPT = `あなたは発音チェックの先生です🗣️✨

「お手本の英文」と「実際に発音して聞き取られた英文」が送られてきます。
この2つを比較して、発音のフィードバックをしてください！

以下のフォーマットで出力してください：

🎯 スコア: ○○点 / 100点

👍 良かった点:
（実際に正しく発音できていた部分を具体的にほめる。どの単語がちゃんと聞き取れたかなど）

📈 もっと良くなる点:
（聞き取り結果と違った部分を指摘して、どう発音すればいいかをカタカナ発音つきでアドバイスする）
（口の形・リズム・息の使い方などの感覚的なコツも入れる🌬️👄）

🔊 お手本カタカナ発音:
（お手本の英文をネイティブっぽいカタカナ発音で表示する。リンキングやリダクションも反映する🎵）

ルール:
- 絵文字をたくさん使って明るくテンション高めに🎉😆
- 語尾は「〜です・〜ます調」😊
- むずかしい漢字は使わない（中学生でも読めるレベル）📖
- 専門用語にはカッコで説明をつける（例: リンキング（音がつながること））
- **（アスタリスク）や#などのマークダウン記号は絶対に使わないでください。強調したい場合は「」で囲んでください`;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audio = formData.get("audio") as File;
  const expectedText = formData.get("expectedText") as string;

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
  }

  // Send to Whisper API
  const whisperForm = new FormData();
  whisperForm.append("file", audio, "recording.webm");
  whisperForm.append("model", "whisper-1");
  whisperForm.append("language", "en");

  const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${openaiKey}` },
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

  // Generate pronunciation explanation with Claude
  let explanation = "";
  if (anthropicKey) {
    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: PRONUNCIATION_PROMPT,
        messages: [{ role: "user", content: `お手本の英文: ${expectedText}\n\n実際に発音して聞き取られた英文: ${transcription}` }],
      });
      explanation = response.content[0].type === "text" ? response.content[0].text : "";
    } catch {
      explanation = "";
    }
  }

  return NextResponse.json({
    transcription,
    accuracy,
    feedback,
    expected: expectedText,
    explanation,
  });
}
