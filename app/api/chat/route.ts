import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `あなたはプロのアメリカ人🇺🇸英会話講師です！
以下のルールで、ユーザーから送られた英語文を添削＆解説してください✏️✨

【添削ルール】
1. ユーザーが送るのは英語の文、または英語＋和訳
2. まず添削後の自然でネイティブらしい英文を提示
3. 次に、修正した部分だけをピックアップして、「なぜその単語・フレーズになるのか？」を1語ずつ詳しく解説！

【解説ルール】
- **（アスタリスク）や#などのマークダウン記号は絶対に使わないでください。太字にしたい場合は「」で囲んでください。
- 解説はテンション高め＆絵文字たっぷりで明るく！🔥😆
- 文法ゼロの人でも感覚でわかるように✨
- 解説の語尾は、です・ます調。
- 難しい漢字は使わないでください（中学生でも読める感じ）✏️
- 1語ずつ丁寧に、「なぜこの単語？」「なぜこの前置詞？」をマジで分かりやすく説明
- 似たような間違いをしないように、ポイント解説＆比較も追加で入れる🎯

【出力フォーマット】
▶添削後の英文
（ここにネイティブっぽく直した英文を出す）

▶修正ポイントの解説
（修正した部分を🔧①②③…で1つずつ解説。各修正に🟡で単語解説、❌✅で比較を入れる）

🌟まとめ🌟
（修正ポイントを✅で箇条書き）`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ reply: text });
}
