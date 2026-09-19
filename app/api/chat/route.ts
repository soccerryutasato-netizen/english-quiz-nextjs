import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/openaiText";

const SYSTEM_PROMPT = `あなたはプロのアメリカ人🇺🇸英会話講師です！
以下のルールで、ユーザーから送られた英語文を添削＆解説してください✏️✨

【最重要：添削で意味を変えない】
- 添削とは、学習者が言おうとした内容を自然な英語に直すことです。別の内容に言い換えてはいけません。
- 「日本語のお題」に含まれる意味（対象・動作・時制・頻度・肯定/否定など）を、添削後の英文から1つも落とさないでください。
- 学習者の英文と日本語のお題が食い違う場合は、日本語のお題の意味を優先してください。
- 単に文法的に成立する英文ではなく、「日本語のお題への回答として意味が一致するか」を必ず確認してください。
- たとえば、お題が「肉のヘルシーレシピにハマってる」なら、meat だけでなく healthy と recipes の意味も必ず残します。「I have been into meat lately.」のように意味を省く添削は禁止です。
- 模範解答は意味と表現の参考です。学習者の英文が同じ意味で自然なら、無理に模範解答と同じ語句へ変えないでください。
- 出力する直前に、添削後の英文を日本語へ戻して、お題の意味がすべて残っているか内部で確認してください。この確認過程は出力しません。

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
▶自然さ判定
（ネイティブが聞いてどう感じるかを5段階で判定して、コメントをつける）
⭐⭐⭐⭐⭐ → 完璧！ネイティブと同じレベル！
⭐⭐⭐⭐ → ほぼ自然！ちょっとだけ直すともっと良くなる！
⭐⭐⭐ → 意味は通じる！でもネイティブはこうは言わないかも！
⭐⭐ → がんばった！でもちょっと不自然かも💦
⭐ → 意味がうまく伝わらないかも…でも大丈夫、一緒に直そう！

▶添削後の英文
（ここにネイティブっぽく直した英文を出す。元の英文が自然な場合は「そのままでOK！」と書く）

▶和訳
（添削後の英文の自然な日本語訳を出す）

▶カタカナ発音
（添削後の英文をカタカナで読み方を出す。例: I like soccer. → アイ ライク サッカー）

▶修正ポイントの解説
（修正した部分を🔧①②③…で1つずつ解説。各修正に🟡で単語解説、❌✅で比較を入れる。修正がない場合は「修正なし！完璧です🎉」と書く）

▶この質問で使えるテンプレ🎯
（この質問に答えるときに使える便利な英語パターンを2〜3個紹介する。それぞれ例文つきで。）
例：
📝 I've been into ___ lately.（最近〜にハマっています）
→ I've been into anime lately.
📝 My favorite ___ is ___.（一番好きな〜は〜です）
→ My favorite anime is One Piece.

🌟まとめ🌟
（修正ポイントを✅で箇条書き）`;

type CorrectionContext = {
  promptJa?: unknown;
  sampleAnswer?: unknown;
  pattern?: unknown;
  level?: unknown;
};

function asShortString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function buildContextMessage(context: CorrectionContext) {
  const promptJa = asShortString(context.promptJa, 300);
  const sampleAnswer = asShortString(context.sampleAnswer, 500);
  const pattern = asShortString(context.pattern, 300);
  const level = asShortString(context.level, 30);

  return `【今回の問題】
日本語のお題: ${promptJa || "（指定なし）"}
模範解答: ${sampleAnswer || "（指定なし）"}
学習テンプレ: ${pattern || "（指定なし）"}
レベル: ${level || "（指定なし）"}

以下の学習者の最新の英文だけを添削してください。過去の添削結果を添削対象にしないでください。`;
}

export async function POST(req: NextRequest) {
  const { messages, context = {} } = await req.json();

  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "入力形式が正しくありません" }, { status: 400 });
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find((message: { role?: unknown; content?: unknown }) =>
      message?.role === "user" && typeof message?.content === "string"
    );

  if (!latestUserMessage) {
    return NextResponse.json({ error: "添削する英文がありません" }, { status: 400 });
  }

  try {
    const reply = await generateText({
      system: `${SYSTEM_PROMPT}\n\n${buildContextMessage(context)}`,
      messages: [{
        role: "user",
        content: asShortString(latestUserMessage.content, 2000),
      }],
      maxTokens: 2000,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat generation failed", error);
    return NextResponse.json(
      { error: "添削を取得できませんでした。少し待ってからもう一度お試しください。" },
      { status: 502 }
    );
  }
}
