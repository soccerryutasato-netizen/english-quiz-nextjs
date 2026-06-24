"use client";

import { useRouter } from "next/navigation";
import { Level, levelDescriptions, levelIcons, levelDetails } from "@/lib/mockData";

const levels: Level[] = [1, 2, 3, 4, 5];

const levelColors: Record<Level, string> = {
  1: "border-green-400 bg-green-50 hover:bg-green-100",
  2: "border-blue-400 bg-blue-50 hover:bg-blue-100",
  3: "border-yellow-400 bg-yellow-50 hover:bg-yellow-100",
  4: "border-orange-400 bg-orange-50 hover:bg-orange-100",
  5: "border-red-400 bg-red-50 hover:bg-red-100",
};

const levelSelectedRing: Record<Level, string> = {
  1: "ring-2 ring-green-500",
  2: "ring-2 ring-blue-500",
  3: "ring-2 ring-yellow-500",
  4: "ring-2 ring-orange-500",
  5: "ring-2 ring-red-500",
};

export default function HomePage() {
  const router = useRouter();
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

        {/* Level select */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-600 mb-4 text-sm">
            出題形式を選んでください
          </h2>
          <div className="space-y-3">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => router.push(`/templates?level=${level}`)}
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
      </div>
    </main>
  );
}
