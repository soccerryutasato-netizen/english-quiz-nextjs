import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/openaiText";

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

  if (typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "質問が空です" }, { status: 400 });
  }

  try {
    const reply = await generateText({
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question.trim().slice(0, 2000) }],
      maxTokens: 1000,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Question box generation failed", error);
    return NextResponse.json(
      { error: "回答を取得できませんでした。少し待ってからもう一度お試しください。" },
      { status: 502 }
    );
  }
}
