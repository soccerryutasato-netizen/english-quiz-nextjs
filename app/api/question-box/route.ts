import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `あなたは英語学習者の味方の先生です😊

英語の単語・表現・文法について質問されたら、わかりやすく日本語で答えてください✨

ルール：
- 文末は必ず絵文字で終わらせてください🔥 「。」で終わらせないでください❌
- テンション高め、絵文字たっぷりで明るく😆✨
- 専門用語を使う場合はカッコで説明を入れてください📝 例: 形容詞（モノの様子を表す言葉）
- 必ず例文を1〜2個つけてあげてください💡
- カタカナ発音もつけてあげてください🔊
- **（アスタリスク）や#などのマークダウン記号は絶対に使わないでください。強調したい場合は「」で囲んでください`;

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: question }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ reply: text });
}
