"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { soloPracticeTopics } from "@/lib/soloPracticeTopics";

export default function SoloPracticeListPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(soloPracticeTopics.map((t) => t.category)));
    return ["すべて", ...cats];
  }, []);

  const filtered = useMemo(() => {
    let list = soloPracticeTopics;
    if (selectedCategory !== "すべて") {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, search]);

  const handleRandom = () => {
    const pool = filtered.length > 0 ? filtered : soloPracticeTopics;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/solo-practice/${pick.id}`);
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-3 block"
        >
          ← トップに戻る
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">📕</span>
          <h1 className="text-2xl font-bold">日常会話のシミュレーション</h1>
        </div>
        <p className="text-gray-500 text-sm">
          日常テーマについて英語で自分の話を書いてみよう
        </p>
      </div>

      {/* Search + Random */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
        <button
          onClick={handleRandom}
          className="px-4 py-2 rounded-xl bg-violet-100 text-violet-700 font-semibold text-sm hover:bg-violet-200 transition cursor-pointer whitespace-nowrap"
        >
          🎲 ランダム
        </button>
      </div>

      {/* History link */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/solo-practice/history")}
          className="text-violet-600 hover:text-violet-800 text-sm cursor-pointer"
        >
          📝 添削履歴を見る →
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
              selectedCategory === cat
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topic cards */}
      <div className="space-y-3">
        {filtered.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{topic.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-gray-800">
                    {topic.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">
                    {topic.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{topic.description}</p>
              </div>
              <button
                onClick={() => router.push(`/solo-practice/${topic.id}`)}
                className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition cursor-pointer whitespace-nowrap"
              >
                練習する
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            該当するテーマが見つかりません
          </p>
        )}
      </div>
    </main>
  );
}
