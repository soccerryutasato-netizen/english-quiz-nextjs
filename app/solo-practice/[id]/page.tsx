"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { soloPracticeTopics } from "@/lib/soloPracticeTopics";
import { saveAnswer } from "@/lib/soloPracticeHistory";

export default function SoloPracticePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const topic = soloPracticeTopics.find((t) => t.id === id);

  const [userAnswer, setUserAnswer] = useState("");
  const [correctionResult, setCorrectionResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCorrectionResult("");
    setUserAnswer("");
    setSaved(false);
  }, [id]);

  if (!topic) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">テーマが見つかりません</p>
      </main>
    );
  }

  const handleSubmit = async () => {
    if (!userAnswer.trim() || loading) return;
    setLoading(true);
    setCorrectionResult("");
    setSaved(false);
    try {
      const res = await fetch("/api/solo-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle: topic.title,
          modelAnswer: topic.modelAnswer,
          questionExample: topic.questionExample,
          userAnswer: userAnswer.trim(),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setCorrectionResult("エラーが発生しました: " + data.error);
      } else {
        setCorrectionResult(data.reply);
      }
    } catch {
      setCorrectionResult("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    saveAnswer({
      id: Date.now().toString(),
      topicId: topic.id,
      userAnswer: userAnswer.trim(),
      correctionResult,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push("/solo-practice")}
        className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-4 block"
      >
        ← テーマ一覧に戻る
      </button>

      {/* Topic header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">{topic.emoji}</span>
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">
            {topic.category}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{topic.description}</p>
      </div>

      {/* Model answer */}
      <div className="bg-violet-50 rounded-2xl border border-violet-200 p-4 mb-4">
        <div className="text-xs font-semibold text-violet-600 mb-2">
          お手本の回答
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">
          {topic.modelAnswer}
        </p>
      </div>

      {/* Question example */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-6">
        <div className="text-xs font-semibold text-amber-600 mb-2">
          質問の例
        </div>
        <p className="text-sm text-gray-800">{topic.questionExample}</p>
      </div>

      {/* User input */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600 block mb-2">
          あなたの回答を英語で書いてみよう
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Write your answer in English..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {userAnswer.length} 文字
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!userAnswer.trim() || loading}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition cursor-pointer mb-6 ${
          !userAnswer.trim() || loading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-violet-600 text-white hover:bg-violet-700"
        }`}
      >
        {loading ? "添削中..." : "添削する"}
      </button>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 mt-3">AIが添削しています...</p>
        </div>
      )}

      {/* Correction result */}
      {correctionResult && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4">
          <div className="text-xs font-semibold text-violet-600 mb-3">
            添削結果
          </div>
          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {correctionResult}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {correctionResult && !loading && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
              saved
                ? "bg-green-100 text-green-600"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            }`}
          >
            {saved ? "保存しました ✓" : "保存する"}
          </button>
          <button
            onClick={() => router.push("/solo-practice")}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition cursor-pointer"
          >
            別のテーマにする
          </button>
        </div>
      )}
    </main>
  );
}
