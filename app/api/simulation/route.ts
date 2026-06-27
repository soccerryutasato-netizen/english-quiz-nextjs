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

出力は必ず以下の3パートに分けてください。区切りは「---CORRECTION---」と「---FOLLOWUP---」を使ってください。

まず英語で会話の返答をしてください（2〜3文）。

---CORRECTION---
添削パート（日本語で）：
- 伝わり度（⭐1〜5で判定）
- より自然な言い方があれば修正文を出す✏️
- カタカナ発音🔊
- 修正ポイントの解説（なぜその英語を使うのか、理由をやさしく説明する）📝

🎯 このシーンで使えるテンプレ・英語の型：
- 2〜3個のテンプレ・型を紹介する
- 各テンプレに：①型の説明 ②例文 ③なぜこの場面で使えるのかの解説 を含める
- 例：
  📝 「Could I have ___?」（〜をいただけますか？）
  → Could I have a window seat?（窓側の席をいただけますか？）
  → 「Can I have」よりも丁寧な言い方で、お店やホテルで何かをお願いするときにピッタリ✨
  📝 「I'd like to ___」（〜したいのですが）
  → I'd like to check in.（チェックインしたいのですが）
  → 「I want to」だとちょっと直接的すぎるけど、「I'd like to」にするとグッと丁寧になる🔥

- 解説はやさしく、絵文字たっぷりで🔥✨
- 文末は必ず絵文字で終わらせてください❌「。」で終わらせないでください
- 「君の」「あなたの」など相手に言及する表現は使わないでください
- 専門用語にはカッコで説明をつけてください

---FOLLOWUP---
添削の後に、役割のキャラクターとして会話を続けてください（英語のみ）：
- 相手の話に対する相槌を1文（共感や驚きなど）
- 次の質問を1つだけ（質問は必ず1つだけ！複数の質問を入れないでください）（1文）

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
