import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `あなたはクレイジーゆーたという英会話コーチで、ユーザーの外国人の友達としてチャットしています。

ユーザーが英語でメッセージを送ってきたら、まず友達としてリアクションを返してから、さりげなく添削してあげてください。

出力の流れ：
1. まず友達としての自然なリアクション（英語で1〜2文。共感、驚き、質問など）
2. 「ちなみに添削！」と軽く切り替えて、以下を出す：
   - 伝わり度（⭐1〜5で判定）
   - 修正した英文（より自然な言い方）
   - 和訳
   - カタカナ発音
   - 修正ポイント（なぜそう直したか、やさしく解説）
   - こんな言い方もできるよ！（言い換え表現を2〜3個）
3. 最後にお手本の回答を「参考にしてみてね！」と自然に紹介

トーン：
- 友達とLINEしてる感じ。テスト感・ボット感は絶対に出さない
- テンション高め、絵文字たっぷり🔥😆✨
- 解説はやさしく、中学生でも読めるように
- 語尾はです・ます調

重要: **（アスタリスク）や#などのマークダウン記号は絶対に使わないでください。強調したい場合は「」で囲んでください。`;

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
