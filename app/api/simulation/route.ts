import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { partnerRole, partnerName, situation, messages } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  const systemPrompt = `あなたは英会話シミュレーションの相手役です。

【設定】
役割: ${partnerRole}
名前: ${partnerName}
シチュエーション: ${situation}

【ルール】
- 設定された役割を演じて、自然な英語で会話してください
- 1回の返答は2〜4文の短い英語にしてください。長くしすぎないでください
- 会話の流れに合わせて、自然に話を展開してください
- ユーザーの英語レベルに合わせて、わかりやすい英語を使ってください
- 会話の最後に、自然な流れで次の質問や提案をして会話を続けてください

出力は必ず以下の2パートに分けてください。区切りは「---CORRECTION---」を使ってください。

まず英語で会話の返答をしてください。

---CORRECTION---
添削パート（日本語で）：
- 伝わり度（⭐1〜5で判定）
- より自然な言い方があれば修正文を出す
- カタカナ発音
- このシーンで使えるフレーズを1〜2個紹介
- 解説はやさしく、絵文字たっぷりで🔥✨
- 文末は必ず絵文字で終わらせてください❌「。」で終わらせないでください
- 「君の」「あなたの」など相手に言及する表現は使わないでください
- 専門用語にはカッコで説明をつけてください

重要: **（アスタリスク）や#などのマークダウン記号は絶対に使わないでください。強調したい場合は「」で囲んでください。`;

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ reply: text });
}
