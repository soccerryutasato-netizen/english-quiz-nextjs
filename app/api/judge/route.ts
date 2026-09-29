import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/openaiText";

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

  try {
    const text = await generateText({
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      maxTokens: 800,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Judge response did not contain JSON");
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Judge generation failed", error);
    return NextResponse.json(
      { error: "判定結果を取得できませんでした。少し待ってからもう一度お試しください。" },
      { status: 502 }
    );
  }
}
