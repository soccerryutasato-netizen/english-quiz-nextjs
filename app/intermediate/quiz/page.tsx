"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { intermediateTemplates } from "@/lib/intermediateTemplates";

function IntermediateQuiz() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("templateId") ?? "";
  const template = intermediateTemplates.find((t) => t.id === templateId);

  const [userAnswer, setUserAnswer] = useState("");
  const [isJudging, setIsJudging] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    isCorrect: boolean;
    feedback: string;
    correction: string;
  } | null>(null);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        テンプレが見つかりません
      </div>
    );
  }

  const handleSubmit = async () => {
    if (isJudging || !userAnswer.trim()) return;
    setIsJudging(true);

    const res = await fetch("/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptJa: template.questionJa,
        sampleAnswer: template.sampleAnswers[0],
        userAnswer: userAnswer,
        pattern: template.question,
        level: "intermediate",
      }),
    });

    const data = await res.json();
    setResult(data);
    setIsJudging(false);
  };

  const handleNext = () => {
    const currentIdx = intermediateTemplates.findIndex((t) => t.id === templateId);
    const nextIdx = currentIdx + 1;
    if (nextIdx < intermediateTemplates.length) {
      const nextTemplate = intermediateTemplates[nextIdx];
      setUserAnswer("");
      setResult(null);
      router.push(`/intermediate/quiz?templateId=${nextTemplate.id}`);
    } else {
      router.push("/intermediate");
    }
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/intermediate")}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-4 block"
        >
          ← テンプレ一覧
        </button>

        <div className="flex items-center gap-2 mb-6">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            📙 中級
          </span>
          <span className="text-sm text-gray-500">テンプレ {template.num} / {intermediateTemplates.length}</span>
        </div>

        {/* 質問カード */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
          <p className="text-xs text-gray-400 mb-2">この質問に英語で答えてみよう</p>
          <p className="text-xl font-semibold text-amber-700 mb-2">{template.question}</p>
          <p className="text-sm text-gray-500">{template.questionJa}</p>
        </div>

        {/* 回答入力 */}
        {!result && (
          <>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
              placeholder="英語で答えてください..."
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-amber-400 resize-none bg-white"
              rows={3}
              disabled={isJudging}
            />
            <p className="text-xs text-gray-400 mt-1 text-right mb-2">Cmd+Enter で送信</p>
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim() || isJudging}
              className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-base hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isJudging ? "判定中..." : "回答する"}
            </button>
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

              {/* あなたの回答 */}
              <div className="bg-white/60 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-400 mb-1">あなたの回答</p>
                <p className="text-sm font-medium">{userAnswer}</p>
              </div>

              {/* 回答例 */}
              <div className="bg-white/60 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-400 mb-1">回答例</p>
                {template.sampleAnswers.map((ans, i) => (
                  <p key={i} className="text-sm font-medium text-indigo-700 mb-1">
                    {ans}
                  </p>
                ))}
              </div>
            </div>

            {/* 解説リンク */}
            <a
              href={template.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 rounded-xl border-2 border-indigo-300 text-indigo-700 font-bold hover:bg-indigo-50 transition cursor-pointer"
            >
              📖 解説を見る（Google Docs）
            </a>

            {/* 次の問題 */}
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
