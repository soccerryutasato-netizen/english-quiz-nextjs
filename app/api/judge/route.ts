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
    const normalize = (s: string) =>
      s.toLowerCase().trim()
        .replace(/[‘’ʼ`’]/g, "’")
        .replace(/[.,!?。、…]+/g, "")
        .replace(/\s+/g, " ");

    const normUser = normalize(userAnswer);
    const normSample = normalize(sampleAnswer);
    const isExact = normUser === normSample;

    // 単語レベルで差分を見つける
    const userWords = normUser.split(" ");
    const sampleWords = normSample.split(" ");
    const diffs: string[] = [];
    const maxLen = Math.max(userWords.length, sampleWords.length);
    for (let i = 0; i < maxLen; i++) {
      const u = userWords[i];
      const s = sampleWords[i];
      if (u === undefined) {
        diffs.push(`「${s}」が抜けています`);
      } else if (s === undefined) {
        diffs.push(`「${u}」は不要です`);
      } else if (u !== s) {
        diffs.push(`「${u}」→「${s}」`);
      }
    }

    const isClose = !isExact && diffs.length <= 2 && userWords.length === sampleWords.length;

    return NextResponse.json({
      score: isExact ? 5 : isClose ? 3 : 2,
      isCorrect: isExact,
      feedback: isExact
        ? "完璧です！模範解答と一致しています。"
        : diffs.length > 0
          ? `ここが違います：${diffs.join("、")}。模範解答は「${sampleAnswer}」です。`
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
