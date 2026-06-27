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

export default function HomePage() {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🗣️</div>
          <h1 className="text-3xl font-bold mb-2">瞬間英作文クイズ</h1>
          <p className="text-gray-500 text-sm">
            英語テンプレを使って瞬間英作文を練習しよう
          </p>
        </div>

        {/* Course select */}
        {!course && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-600 mb-4 text-sm">
              コースを選んでください
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setCourse("beginner")}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-indigo-400 bg-indigo-50 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📗</span>
                  <div>
                    <div className="font-bold text-base text-gray-800">初級テンプレクイズ</div>
                    <div className="text-xs text-gray-500 mt-0.5">42テンプレ × 30問 ｜ 日→英の瞬間英作文</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setCourse("intermediate")}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📙</span>
                  <div>
                    <div className="font-bold text-base text-gray-800">中級テンプレクイズ</div>
                    <div className="text-xs text-gray-500 mt-0.5">22テンプレ ｜ 英語の質問に英語で答える</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push("/solo-practice")}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-violet-400 bg-violet-50 hover:bg-violet-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📕</span>
                  <div>
                    <div className="font-bold text-base text-gray-800">独り言プラクティス</div>
                    <div className="text-xs text-gray-500 mt-0.5">20テーマ ｜ 日常テーマで英語アウトプット</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push("/simulation")}
                className="w-full text-left px-5 py-4 rounded-xl border-2 border-teal-400 bg-teal-50 hover:bg-teal-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <div className="font-bold text-base text-gray-800">海外シミュレーション</div>
                    <div className="text-xs text-gray-500 mt-0.5">12シーン ｜ ホテル・空港・レストランなど実践英会話</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer links */}
        {!course && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.push("/chat-history")}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-indigo-700 bg-indigo-100 border-2 border-indigo-200 shadow-[0_4px_0_0_rgb(129,140,248)] hover:shadow-[0_2px_0_0_rgb(129,140,248)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
            >
              💬 チャット履歴
            </button>
            <button
              onClick={() => router.push("/word-notebook")}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-amber-700 bg-amber-100 border-2 border-amber-200 shadow-[0_4px_0_0_rgb(252,211,77)] hover:shadow-[0_2px_0_0_rgb(252,211,77)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
            >
              📖 単語帳
            </button>
          </div>
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
