import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { promptJa, sampleAnswer, userAnswer, pattern, level } = await req.json();

  if (!userAnswer?.trim()) {
    return NextResponse.json({ error: "回答が空です" }, { status: 400 });
  }

  const systemPrompt = `あなたは英語教師のAIです。生徒の英作文を採点してください。
採点は以下のJSON形式で返してください（他の文字は一切含めないこと）：
{
  "score": 1〜5の整数,
  "isCorrect": trueまたはfalse,
  "feedback": "フィードバック文（日本語・2〜3文）",
  "correction": "修正した英文（間違いがなければsampleAnswerと同じ）",
  "goodPoints": ["良かった点1", "良かった点2"],
  "improvements": ["改善点1", "改善点2"]
}

採点基準：
- 5点：文法・意味ともに完璧
- 4点：意味は通じるが小さなミスがある
- 3点：大体合っているが文法ミスがある
- 2点：部分的に正しいが大きなミスがある
- 1点：ほぼ不正解

isCorrect は score が 4 以上の場合 true にしてください。`;

  const userPrompt = `テンプレパターン: ${pattern}
レベル: ${level}
日本語プロンプト: ${promptJa}
模範解答: ${sampleAnswer}
生徒の回答: ${userAnswer}

上記の生徒の回答を採点してください。`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // APIキー未設定時はシンプルな文字列比較でフォールバック判定
    const normalize = (s: string) =>
      s.toLowerCase().trim()
        .replace(/[‘’ʼ`']/g, "'")  // アポストロフィ系を統一
        .replace(/[.,!?。、…]+/g, "")   // 句読点を全て除去（末尾だけでなく全体）
        .replace(/\s+/g, " ");          // 空白統一
    const isExact = normalize(userAnswer) === normalize(sampleAnswer);
    return NextResponse.json({
      score: isExact ? 5 : 2,
      isCorrect: isExact,
      feedback: isExact
        ? "完璧です！模範解答と一致しています。"
        : `模範解答は「${sampleAnswer}」です。`,
      correction: sampleAnswer,
      goodPoints: isExact ? ["模範解答と完全一致！"] : [],
      improvements: isExact ? [] : [`模範解答: ${sampleAnswer}`],
    });
  }

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  // JSON部分だけ取り出す
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "判定結果のパースに失敗しました" }, { status: 500 });
  }

  const result = JSON.parse(jsonMatch[0]);
  return NextResponse.json(result);
}
