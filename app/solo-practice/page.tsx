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
    <main className="min-h-screen px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="mb-4 py-2 px-4 rounded-xl bg-gray-100 text-gray-600 text-sm cursor-pointer hover:bg-gray-200 transition-all inline-block"
          style={{ fontWeight: 700 }}
        >
          ← トップ
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📕</div>
          <h1 className="text-2xl mb-2" style={{ fontWeight: 900 }}>日常会話のシミュレーション</h1>
          <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>
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
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
          />
          <button
            onClick={handleRandom}
            className="px-4 py-2.5 rounded-xl bg-red-100 text-red-700 text-sm hover:bg-red-200 transition cursor-pointer whitespace-nowrap"
            style={{ fontWeight: 700 }}
          >
            🎲 ランダム
          </button>
        </div>

        {/* History link */}
        <div className="mb-4">
          <button
            onClick={() => router.push("/solo-practice/history")}
            className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            📝 添削履歴を見る →
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{ fontWeight: 700 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topic cards */}
        <div className="space-y-4">
          {filtered.map((topic) => (
            <button
              key={topic.id}
              onClick={() => router.push(`/solo-practice/${topic.id}`)}
              className="w-full text-left rounded-2xl bg-red-50 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-stretch">
                {/* Left color strip */}
                <div className="w-14 flex-shrink-0 bg-gradient-to-b from-red-400 to-rose-500 rounded-l-2xl flex items-center justify-center relative overflow-hidden">
                  <span className="text-white/30 text-2xl select-none absolute">{topic.emoji}</span>
                </div>

                {/* Icon circle */}
                <div className="flex items-center pl-3">
                  <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-red-200">
                    <span className="text-lg">{topic.emoji}</span>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 py-3 pl-3 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-red-700" style={{ fontWeight: 900 }}>
                      {topic.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{topic.description}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center pr-4 text-red-500 text-xl font-bold">→</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              該当するテーマが見つかりません
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
