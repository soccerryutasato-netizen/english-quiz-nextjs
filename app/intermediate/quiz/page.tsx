"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import { intermediateTemplates, IntermediateTemplate } from "@/lib/intermediateTemplates";
import { Level, levelDescriptions, levelIcons } from "@/lib/mockData";
import { DocsModal } from "@/lib/DocsModal";

const GPT_URL = "https://chatgpt.com/g/g-67ef12d4e8148191ae6047b682071380-wen-fa-tian-xue-ying-yu-noonao-mijie-jue-kureisiyuta";

function generateChoices(template: IntermediateTemplate): string[] {
  const correct = template.sampleAnswers[0];
  const others = intermediateTemplates
    .filter((t) => t.id !== template.id)
    .map((t) => t.sampleAnswers[0]);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [...shuffled, correct].sort(() => Math.random() - 0.5);
  return choices;
}

function getHintWords(answer: string): string {
  const words = answer.split(" ");
  if (words.length <= 3) return words[0] + " ...";
  return words.slice(0, 2).join(" ") + " ... " + words[words.length - 1];
}

const levelBadgeColors: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-red-100 text-red-700",
};

function IntermediateQuiz() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("templateId") ?? "";
  const levelParam = Number(searchParams.get("level")) as Level;
  const level: Level = ([1, 2, 3] as Level[]).includes(levelParam) ? levelParam : 3;
  const template = intermediateTemplates.find((t) => t.id === templateId);

  const [userAnswer, setUserAnswer] = useState("");
  const [isJudging, setIsJudging] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    isCorrect: boolean;
    feedback: string;
    correction: string;
  } | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [copied, setCopied] = useState(false);

  const choices = useMemo(
    () => (template ? generateChoices(template) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [templateId]
  );

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        テンプレが見つかりません
      </div>
    );
  }

  const handleSubmit = async (answer: string) => {
    if (isJudging || !answer.trim()) return;
    setIsJudging(true);

    const res = await fetch("/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptJa: template.questionJa,
        sampleAnswer: template.sampleAnswers[0],
        userAnswer: answer,
        pattern: template.question,
        level: "intermediate",
      }),
    });

    const data = await res.json();
    setResult(data);
    setIsJudging(false);
  };

  const handleChoiceSelect = (choice: string) => {
    const isCorrect = choice === template.sampleAnswers[0];
    setUserAnswer(choice);
    setResult({
      score: isCorrect ? 5 : 1,
      isCorrect,
      feedback: isCorrect
        ? "正解！この表現を覚えましょう。"
        : `模範解答は「${template.sampleAnswers[0]}」です。`,
      correction: template.sampleAnswers[0],
    });
  };

  const handleNext = () => {
    const currentIdx = intermediateTemplates.findIndex((t) => t.id === templateId);
    const nextIdx = currentIdx + 1;
    if (nextIdx < intermediateTemplates.length) {
      const nextTemplate = intermediateTemplates[nextIdx];
      setUserAnswer("");
      setResult(null);
      router.push(`/intermediate/quiz?templateId=${nextTemplate.id}&level=${level}`);
    } else {
      router.push(`/intermediate?level=${level}`);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push(`/intermediate?level=${level}`)}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-4 block"
        >
          ← テンプレ一覧
        </button>

        <div className="flex items-center gap-2 mb-6">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${levelBadgeColors[level]}`}>
            {levelIcons[level]} Lv.{level}
          </span>
          <span className="text-sm text-gray-500">テンプレ {template.num} / {intermediateTemplates.length}</span>
        </div>

        {/* 質問カード */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
          <p className="text-xs text-gray-400 mb-2">この質問に英語で答えてみよう</p>
          <p className="text-xl font-semibold text-amber-700 mb-2">{template.question}</p>
          <p className="text-sm text-gray-500">{template.questionJa}</p>
        </div>

        {/* レベル別入力UI */}
        {!result && (
          <>
            {/* Lv.1 選択式 */}
            {level === 1 && (
              <div className="space-y-2 mb-4">
                {choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoiceSelect(choice)}
                    className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer text-sm"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            )}

            {/* Lv.2 ヒントあり */}
            {level === 2 && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
                  <span className="text-blue-400 text-xs block mb-0.5">ヒント</span>
                  <span className="font-mono text-sm text-blue-700">{getHintWords(template.sampleAnswers[0])}</span>
                </div>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(userAnswer); }}
                  placeholder="英語で答えてください..."
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-amber-400 resize-none bg-white"
                  rows={3}
                  disabled={isJudging}
                />
                <p className="text-xs text-gray-400 mt-1 text-right mb-2">Cmd+Enter で送信</p>
                <button
                  onClick={() => handleSubmit(userAnswer)}
                  disabled={!userAnswer.trim() || isJudging}
                  className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-base hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {isJudging ? "判定中..." : "回答する"}
                </button>
              </>
            )}

            {/* Lv.3 自由回答（GPT添削） */}
            {level === 3 && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm p-5">
                <div className="text-center mb-4">
                  <p className="text-sm font-bold text-green-800 mb-1">✍️ AI添削モード</p>
                  <p className="text-xs text-gray-500">ChatGPTの添削AIに英語で回答してフィードバックをもらおう</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-amber-500 mb-1">この質問をコピーして使ってね</p>
                  <p className="text-sm font-semibold text-amber-800">{template.question}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(template.question);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="mt-2 text-xs text-amber-600 border border-amber-300 rounded-lg px-3 py-1 hover:bg-amber-100 transition cursor-pointer"
                  >
                    {copied ? "✅ コピーしました！" : "📋 質問文をコピー"}
                  </button>
                </div>

                <a
                  href={GPT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-4 rounded-xl bg-green-600 text-white font-bold text-base hover:bg-green-700 transition"
                >
                  🤖 AIに添削してもらう
                </a>

                <button
                  onClick={handleNext}
                  className="w-full mt-3 py-3 rounded-xl bg-amber-600 text-white font-bold text-base hover:bg-amber-700 transition cursor-pointer"
                >
                  {intermediateTemplates.findIndex((t) => t.id === templateId) < intermediateTemplates.length - 1
                    ? "次の問題 →"
                    : "テンプレ一覧に戻る"}
                </button>
              </div>
            )}
          </>
        )}

        {/* 結果 */}
        {result && (
          <div className="space-y-4">
            <div className={`rounded-2xl border p-5 ${result.isCorrect ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300"}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{result.isCorrect ? "✅" : "💡"}</span>
                <div>
                  <p className="font-bold text-lg">{result.isCorrect ? "いいね！" : "もう少し！"}</p>
                  <p className="text-sm text-gray-600">{result.feedback}</p>
                </div>
              </div>

              <div className="bg-white/60 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-400 mb-1">あなたの回答</p>
                <p className="text-sm font-medium">{userAnswer}</p>
              </div>

              <div className="bg-white/60 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-400 mb-1">回答例</p>
                {template.sampleAnswers.map((ans, i) => (
                  <p key={i} className="text-sm font-medium text-indigo-700 mb-1">
                    {ans}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowDocs(true)}
              className="w-full text-center py-3 rounded-xl border-2 border-indigo-300 text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
            >
              📖 解説を見る
            </button>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-base hover:bg-amber-700 transition cursor-pointer"
            >
              {intermediateTemplates.findIndex((t) => t.id === templateId) < intermediateTemplates.length - 1
                ? "次の問題 →"
                : "テンプレ一覧に戻る"}
            </button>
          </div>
        )}
      </div>

      {showDocs && template && (
        <DocsModal url={template.docsUrl} onClose={() => setShowDocs(false)} />
      )}
    </main>
  );
}

export default function IntermediateQuizPage() {
  return (
    <Suspense>
      <IntermediateQuiz />
    </Suspense>
  );
}
