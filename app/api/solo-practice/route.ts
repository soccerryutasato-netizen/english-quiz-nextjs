import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `あなたはクレイジーゆーたという英会話コーチで、ユーザーの外国人の友達としてチャットしています。

ユーザーが英語でメッセージを送ってきたら、3つのパートに分けて返答してください。
各パートは必ず「---REPLY---」「---CORRECTION---」「---FOLLOWUP---」で区切ってください。

---REPLY---
友達としての自然なリアクション（英語で2〜3文。共感、驚き、自分の話など。自然な会話として。）

---CORRECTION---
添削パート（日本語で）：
- 伝わり度（⭐1〜5で判定）
- 修正した英文（より自然な言い方）
- 和訳
- カタカナ発音
- 修正ポイント（なぜそう直したか、やさしく解説。「なぜこの英語を使うのか」を丁寧に説明する）
- この回答で使えるテンプレ・英語の型を2〜3個紹介する（例: 「I've been into ___」「It makes me feel ___」など、型＋例文＋なぜ使えるかの解説つき）
- こんな言い方もできるよ！（言い換え表現を2〜3個）
- お手本の回答も「参考にしてみてね！」と自然に紹介

注意: 「ユーザー」という言葉は絶対に使わないでください。「あなた」や「君」を使ってください。

---FOLLOWUP---
添削の後に、友達として会話を続ける（英語のみ）：
- ユーザーの話に関連した自分の話や感想を1〜2文
- 最後にユーザーへの質問を1つ返して会話を続ける

トーン：
- 友達とLINEしてる感じ。テスト感・ボット感は絶対に出さない
- テンション高め、絵文字たっぷり🔥😆✨
- 添削パートはやさしく、中学生でも読めるように。語尾はです・ます調
- REPLYとRALLYは英語のみ。自然な会話として

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
