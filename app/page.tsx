"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Level, levelDescriptions, levelIcons, levelDetails } from "@/lib/mockData";

const levels: Level[] = [1, 2, 3];

const levelColors: Record<Level, string> = {
  1: "border-green-400 bg-green-50 hover:bg-green-100",
  2: "border-blue-400 bg-blue-50 hover:bg-blue-100",
  3: "border-red-400 bg-red-50 hover:bg-red-100",
};

type Course = "beginner" | "intermediate";

const courses = [
  {
    key: "beginner" as Course,
    emoji: "📗",
    title: "初級テンプレクイズ",
    sub: "42テンプレ × 30問",
    desc: "日→英の瞬間英作文",
    color: "from-green-400 to-emerald-500",
    border: "border-green-300",
    bg: "bg-green-50",
    ring: "bg-green-500",
    text: "text-green-700",
    num: "01",
  },
  {
    key: "intermediate" as Course,
    emoji: "📙",
    title: "中級テンプレクイズ",
    sub: "22テンプレ",
    desc: "英語の質問に英語で答える",
    color: "from-yellow-400 to-amber-500",
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    ring: "bg-yellow-500",
    text: "text-yellow-700",
    num: "02",
  },
  {
    key: "solo" as string,
    emoji: "📕",
    title: "独り言プラクティス",
    sub: "20テーマ",
    desc: "日常テーマで英語アウトプット",
    color: "from-red-400 to-rose-500",
    border: "border-red-300",
    bg: "bg-red-50",
    ring: "bg-red-500",
    text: "text-red-700",
    num: "03",
  },
  {
    key: "simulation" as string,
    emoji: "🌍",
    title: "海外シミュレーション",
    sub: "12シーン",
    desc: "ホテル・空港・レストランなど実践英会話",
    color: "from-purple-400 to-violet-500",
    border: "border-purple-300",
    bg: "bg-purple-50",
    ring: "bg-purple-500",
    text: "text-purple-700",
    num: "04",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);

  const handleCourseClick = (key: string) => {
    if (key === "beginner" || key === "intermediate") {
      setCourse(key as Course);
    } else if (key === "solo") {
      router.push("/solo-practice");
    } else if (key === "simulation") {
      router.push("/simulation");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🗣️</div>
          <h1 className="text-3xl mb-2" style={{ fontWeight: 900 }}>瞬間英作文クイズ</h1>
          <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>
            英語テンプレを使って瞬間英作文を練習しよう
          </p>
        </div>

        {/* Course select */}
        {!course && (
          <>
            <div className="space-y-4">
              {courses.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleCourseClick(c.key)}
                  className={`w-full text-left rounded-2xl ${c.border} ${c.bg} overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm`}
                >
                  <div className="flex items-center">
                    {/* Left color strip with number */}
                    <div className={`w-16 flex-shrink-0 bg-gradient-to-b ${c.color} flex flex-col items-center justify-center py-4 self-stretch rounded-l-2xl`}>
                      <span className="text-white text-xs font-bold opacity-80">{c.num}</span>
                    </div>

                    {/* Emoji circle */}
                    <div className="flex-shrink-0 -ml-5">
                      <div className={`w-12 h-12 rounded-full ${c.ring} flex items-center justify-center text-2xl shadow-md border-2 border-white`}>
                        {c.emoji}
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 pl-3 pr-4 py-3">
                      <div className={`font-bold text-base ${c.text}`} style={{ fontWeight: 900 }}>
                        {c.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {c.sub} ｜ {c.desc}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className={`pr-4 ${c.text} text-lg`}>→</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer links */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => router.push("/chat-history")}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 border-2 border-gray-200 shadow-[0_4px_0_0_rgb(156,163,175)] hover:shadow-[0_2px_0_0_rgb(156,163,175)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
              >
                💬 チャット履歴
              </button>
              <button
                onClick={() => router.push("/word-notebook")}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 border-2 border-gray-200 shadow-[0_4px_0_0_rgb(156,163,175)] hover:shadow-[0_2px_0_0_rgb(156,163,175)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
              >
                📖 単語帳
              </button>
            </div>
          </>
        )}

        {/* Level select */}
        {(course === "beginner" || course === "intermediate") && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <button
              onClick={() => setCourse(null)}
              className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-3 block"
            >
              ← コース選択に戻る
            </button>
            <h2 className="font-semibold text-gray-600 mb-4 text-sm">
              出題形式を選んでください
            </h2>
            <div className="space-y-3">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => router.push(
                    course === "beginner"
                      ? `/templates?level=${level}`
                      : `/intermediate?level=${level}`
                  )}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${levelColors[level]}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{levelIcons[level]}</span>
                    <div>
                      <div className="font-bold text-sm text-gray-800">
                        Lv.{level}　{levelDescriptions[level]}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {levelDetails[level]}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
