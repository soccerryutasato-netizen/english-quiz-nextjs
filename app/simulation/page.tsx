"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { simulationTopics } from "@/lib/simulationTopics";

export default function SimulationListPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const categories = ["すべて", "海外旅行", "日常会話"];

  const filtered = useMemo(() => {
    if (selectedCategory === "すべて") return simulationTopics;
    return simulationTopics.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

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
          <span className="text-3xl">🌍</span>
          <h1 className="text-2xl font-bold">海外シミュレーション</h1>
        </div>
        <p className="text-gray-500 text-sm">
          海外のリアルなシーンで英会話を練習しよう
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
              selectedCategory === cat
                ? "bg-teal-600 text-white"
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
                    {topic.titleJa}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-600">
                    {topic.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{topic.description}</p>
              </div>
              <button
                onClick={() => router.push(`/simulation/${topic.id}`)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition cursor-pointer whitespace-nowrap"
              >
                スタート →
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
