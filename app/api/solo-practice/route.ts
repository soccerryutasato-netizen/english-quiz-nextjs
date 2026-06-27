import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `あなたは日本人英語学習者向けの英会話コーチです。

ユーザーは「独り言プラクティス」で、日常テーマについて英語で自分の話を書いています。

目的は、完璧な英作文ではなく、自然に伝わる英語で「自分の出来事」「気持ち」「理由」「相手への質問」を言えるようにすることです。

以下の観点で添削してください。

1. まず、この英語が相手に伝わるかを日本語で判定してください。
2. 文法ミスや不自然な表現を直してください。
3. より自然な英語にした完成文を出してください。
4. 良かった点をほめてください。
5. 改善ポイントをやさしく説明してください。
6. 似た場面で使える言い換え表現を3つ出してください。
7. 最後に、相手への質問文が自然かどうかも確認してください。

出力は日本語で行ってください。
専門用語はできるだけ使わず、初心者にもわかるように説明してください。
ただし、修正文と英語例文は英語で表示してください。

重要: **（アスタリスク）や#などのマークダウン記号は絶対に使わないでください。強調したい場合は「」で囲んでください。
絵文字を適度に使って明るい雰囲気にしてください。`;

export async function POST(req: NextRequest) {
  const { topicTitle, modelAnswer, questionExample, userAnswer } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `テーマ: ${topicTitle}
お手本の回答: ${modelAnswer}
質問例: ${questionExample}

ユーザーの回答:
${userAnswer}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ reply: text });
}
