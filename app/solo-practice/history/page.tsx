"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAnswers, toggleFavorite, SoloPracticeAnswer } from "@/lib/soloPracticeHistory";
import { soloPracticeTopics } from "@/lib/soloPracticeTopics";

export default function SoloPracticeHistoryPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SoloPracticeAnswer[]>([]);
  const [filterTopic, setFilterTopic] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setAnswers(getAnswers());
  }, []);

  const topicMap = useMemo(() => {
    const map: Record<string, string> = {};
    soloPracticeTopics.forEach((t) => {
      map[t.id] = `${t.emoji} ${t.title}`;
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = answers;
    if (filterTopic) {
      list = list.filter((a) => a.topicId === filterTopic);
    }
    if (favOnly) {
      list = list.filter((a) => a.isFavorite);
    }
    return list;
  }, [answers, filterTopic, favOnly]);

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    setAnswers(getAnswers());
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <button
        onClick={() => router.push("/solo-practice")}
        className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-4 block"
      >
        ← テーマ一覧に戻る
      </button>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📝</span>
        <h1 className="text-xl font-bold">添削履歴</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value="">すべてのテーマ</option>
          {soloPracticeTopics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFavOnly(!favOnly)}
          className={`px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition ${
            favOnly
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
          }`}
        >
          ⭐ お気に入りのみ
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">
          {answers.length === 0
            ? "まだ添削履歴がありません"
            : "該当する履歴がありません"}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((answer) => {
            const isExpanded = expandedId === answer.id;
            return (
              <div
                key={answer.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : answer.id)
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {topicMap[answer.topicId] || answer.topicId}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(answer.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {answer.userAnswer}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(answer.id)}
                    className="text-lg cursor-pointer"
                  >
                    {answer.isFavorite ? "⭐" : "☆"}
                  </button>
                </div>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs font-semibold text-violet-600 mb-2">
                      添削結果
                    </div>
                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {answer.correctionResult}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
