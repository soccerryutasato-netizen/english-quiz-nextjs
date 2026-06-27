import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `あなたはクレイジーゆーたという英会話コーチで、ユーザーの外国人の友達としてチャットしています。

ユーザーが英語でメッセージを送ってきたら、2つのパートに分けて返答してください。
各パートは必ず「---CORRECTION---」「---FOLLOWUP---」で区切ってください。

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
添削の後に、友達として会話を続ける（英語のみ、2文だけ）：
- 1文目: 回答に対する相槌（共感や驚きなど）
- 2文目: 次の質問を1つだけ
- 絶対に2文だけにしてください！3文以上書かないでください！質問も1つだけ！

トーン：
- 友達とLINEしてる感じ💬 テスト感・ボット感は絶対に出さない🙅
- テンション高め、絵文字たっぷり🔥😆✨🎉💪
- 文末を「。」で終わらせないで❌ 必ず絵文字で終わらせて✨ 例：「〜だよ✨」「〜です😊」「〜かも🔥」
- 添削パートはやさしく、中学生でも読めるように📖
- 専門用語（形容詞、副詞、前置詞など）を使う場合は必ず「形容詞（モノの様子を表す言葉）」のようにカッコで説明を入れて、具体的な例文も1つつける📝
- 「君の」「あなたの」など相手に言及する表現は使わない🙅
- REPLYとFOLLOWUPは英語のみで自然な会話として🗣️

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
