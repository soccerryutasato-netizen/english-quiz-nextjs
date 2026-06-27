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
          <div className="w-16 h-16 mx-auto mb-3">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="23" fill="#f3e8ff" stroke="#d8b4fe" strokeWidth="2"/><path d="M24 14l8 6-8 6V14z" fill="#a855f7" opacity="0.3"/><path d="M14 24c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z" stroke="#7c3aed" strokeWidth="2"/><path d="M14 24h20" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="2 2"/><path d="M24 14c3 3 4.5 6 4.5 10s-1.5 7-4.5 10" stroke="#7c3aed" strokeWidth="1.5"/><path d="M24 14c-3 3-4.5 6-4.5 10s1.5 7 4.5 10" stroke="#7c3aed" strokeWidth="1.5"/><path d="M33 17l3-2M35 15l1 2" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <h1 className="text-2xl mb-2" style={{ fontWeight: 900 }}>海外シミュレーション</h1>
          <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>
            海外のリアルなシーンで英会話を練習しよう
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-sm"
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
              onClick={() => router.push(`/simulation/${topic.id}`)}
              className="w-full text-left rounded-2xl bg-purple-50 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-stretch">
                {/* Left color strip */}
                <div className="w-14 flex-shrink-0 bg-gradient-to-b from-purple-400 to-violet-500 rounded-l-2xl flex items-center justify-center relative overflow-hidden">
                  <span className="text-white/30 text-2xl select-none absolute">{topic.emoji}</span>
                </div>

                {/* Icon circle */}
                <div className="flex items-center pl-3">
                  <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-purple-200">
                    <span className="text-lg">{topic.emoji}</span>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 py-3 pl-3 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-purple-700" style={{ fontWeight: 900 }}>
                      {topic.titleJa}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{topic.description}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center pr-4 text-purple-500 text-xl font-bold">→</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
