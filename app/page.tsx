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

function IconBeginner() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="24" cy="24" r="23" fill="#dcfce7" stroke="#86efac" strokeWidth="2"/>
      <path d="M14 34V16a2 2 0 012-2h12a2 2 0 012 2v18" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 34l10-6 10 6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 20h4M20 24h6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 18l3-3M35 15l-1.5-1.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconIntermediate() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="24" cy="24" r="23" fill="#fef9c3" stroke="#fde047" strokeWidth="2"/>
      <path d="M15 32l3-8 12-12 5 5-12 12-8 3z" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27 15l5 5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 32l2.5-2.5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="35" cy="13" r="2" fill="#eab308"/>
    </svg>
  );
}

function IconDaily() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="24" cy="24" r="23" fill="#fee2e2" stroke="#fca5a5" strokeWidth="2"/>
      <rect x="10" y="14" width="18" height="13" rx="3" stroke="#dc2626" strokeWidth="2"/>
      <path d="M28 22h6a3 3 0 013 3v4a3 3 0 01-3 3h-1l-3 3v-3h-2" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="20.5" r="1.2" fill="#dc2626"/>
      <circle cx="20" cy="20.5" r="1.2" fill="#dc2626"/>
      <circle cx="24" cy="20.5" r="1.2" fill="#dc2626"/>
    </svg>
  );
}

function IconSimulation() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="24" cy="24" r="23" fill="#f3e8ff" stroke="#d8b4fe" strokeWidth="2"/>
      <path d="M24 14l8 6-8 6V14z" fill="#a855f7" opacity="0.3"/>
      <path d="M14 24c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z" stroke="#7c3aed" strokeWidth="2"/>
      <path d="M14 24h20" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="2 2"/>
      <path d="M24 14c3 3 4.5 6 4.5 10s-1.5 7-4.5 10" stroke="#7c3aed" strokeWidth="1.5"/>
      <path d="M24 14c-3 3-4.5 6-4.5 10s1.5 7 4.5 10" stroke="#7c3aed" strokeWidth="1.5"/>
      <path d="M33 17l3-2M35 15l1 2" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const courseData = [
  {
    key: "beginner" as Course,
    Icon: IconBeginner,
    title: "初級テンプレクイズ",
    sub: "42テンプレ × 30問",
    desc: "日→英の瞬間英作文",
    gradient: "from-green-400 to-emerald-500",
    cardBg: "bg-green-50",
    textColor: "text-green-700",
    arrowColor: "text-green-500",
    num: "01",
  },
  {
    key: "intermediate" as Course,
    Icon: IconIntermediate,
    title: "中級テンプレクイズ",
    sub: "22テンプレ",
    desc: "英語の質問に英語で答える",
    gradient: "from-yellow-400 to-amber-500",
    cardBg: "bg-yellow-50",
    textColor: "text-yellow-700",
    arrowColor: "text-yellow-500",
    num: "02",
  },
  {
    key: "solo" as string,
    Icon: IconDaily,
    title: "日常会話のシミュレーション",
    sub: "20テーマ",
    desc: "日常テーマで英語アウトプット",
    gradient: "from-red-400 to-rose-500",
    cardBg: "bg-red-50",
    textColor: "text-red-700",
    arrowColor: "text-red-500",
    num: "03",
  },
  {
    key: "simulation" as string,
    Icon: IconSimulation,
    title: "海外シミュレーション",
    sub: "12シーン",
    desc: "ホテル・空港・レストランなど実践英会話",
    gradient: "from-purple-400 to-violet-500",
    cardBg: "bg-purple-50",
    textColor: "text-purple-700",
    arrowColor: "text-purple-500",
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
              {courseData.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleCourseClick(c.key)}
                  className={`w-full text-left rounded-2xl ${c.cardBg} overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-stretch">
                    {/* Left color strip with large number */}
                    <div className={`w-20 flex-shrink-0 bg-gradient-to-b ${c.gradient} rounded-l-2xl flex items-center justify-center relative overflow-hidden`}>
                      <span className="text-white/25 font-black text-5xl select-none" style={{ fontWeight: 900 }}>{c.num}</span>
                    </div>

                    {/* Icon overlapping the strip */}
                    <div className="flex items-center -ml-7 z-10">
                      <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-white">
                        <div className="w-12 h-12">
                          <c.Icon />
                        </div>
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0 py-4 pl-3 pr-2">
                      <div className={`font-bold text-base ${c.textColor}`} style={{ fontWeight: 900 }}>
                        {c.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {c.sub} ｜ {c.desc}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className={`flex items-center pr-4 ${c.arrowColor} text-xl font-bold`}>→</div>
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
              className="w-full mb-4 py-2.5 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer shadow-[0_3px_0_0_rgb(156,163,175)] hover:shadow-[0_1px_0_0_rgb(156,163,175)] hover:translate-y-[2px] active:shadow-none active:translate-y-[3px]"
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
