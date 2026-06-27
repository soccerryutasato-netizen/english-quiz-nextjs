"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { intermediateTemplates } from "@/lib/intermediateTemplates";
import { Level, levelDescriptions, levelIcons, levelDetails } from "@/lib/mockData";
import { DocsModal } from "@/lib/DocsModal";
import { loadProgress, getCompletedTemplates } from "@/lib/progress";


const levelBadgeColors: Record<number, string> = {
  1: "bg-green-100 text-green-700 border-green-300",
  2: "bg-blue-100 text-blue-700 border-blue-300",
  3: "bg-red-100 text-red-700 border-red-300",
};

function IntermediateTemplateList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const levelParam = Number(searchParams.get("level")) as Level;
  const level: Level = ([1, 2, 3] as Level[]).includes(levelParam) ? levelParam : 1;
  const [docsUrl, setDocsUrl] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [resumeInfo, setResumeInfo] = useState<{ templateId: string } | null>(null);

  useEffect(() => {
    setCompletedIds(getCompletedTemplates("intermediate", level));
    const progress = loadProgress("intermediate", level);
    if (progress?.currentTemplateId) {
      setResumeInfo({ templateId: progress.currentTemplateId });
    } else {
      setResumeInfo(null);
    }
  }, [level]);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-4 py-2 px-4 rounded-xl bg-gray-100 text-gray-600 text-sm cursor-pointer hover:bg-gray-200 transition-all inline-block"
          style={{ fontWeight: 700 }}
        >
          ← トップ
        </button>

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="23" fill="#fef9c3" stroke="#fde047" strokeWidth="2"/><path d="M15 32l3-8 12-12 5 5-12 12-8 3z" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M27 15l5 5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/><path d="M15 32l2.5-2.5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"/><circle cx="35" cy="13" r="2" fill="#eab308"/></svg>
          </div>
          <h1 className="text-2xl mb-2" style={{ fontWeight: 900 }}>中級テンプレ一覧</h1>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levelBadgeColors[level]}`}>
              {levelIcons[level]} Lv.{level}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: 400 }}>{levelDescriptions[level]}</p>
          <p className="text-gray-400 text-xs mt-0.5">{levelDetails[level]}</p>
        </div>

        {/* 続きからボタン */}
        {resumeInfo && !completedIds.includes(resumeInfo.templateId) && (
          <button
            onClick={() => router.push(`/intermediate/quiz?templateId=${resumeInfo.templateId}&level=${level}`)}
            className="w-full mb-6 py-3 rounded-xl bg-amber-600 text-white text-base hover:bg-amber-700 transition cursor-pointer shadow-sm"
            style={{ fontWeight: 700 }}
          >
            続きから →
          </button>
        )}

        <div className="space-y-4">
          {intermediateTemplates.map((t) => {
            const isCompleted = completedIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => router.push(`/intermediate/quiz?templateId=${t.id}&level=${level}`)}
                className="w-full text-left rounded-2xl bg-yellow-50 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-stretch">
                  {/* Left color strip */}
                  <div className="w-14 flex-shrink-0 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-l-2xl flex items-center justify-center relative overflow-hidden">
                    <span className="text-white/20 font-black text-3xl select-none absolute" style={{ fontWeight: 900, right: -2 }}>
                      {String(t.num).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Icon circle */}
                  <div className="flex items-center pl-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-amber-200">
                      <span className="text-amber-700 text-sm" style={{ fontWeight: 900 }}>{t.num}</span>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0 py-3 pl-3 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-amber-700" style={{ fontWeight: 900 }}>
                        {t.question}
                      </span>
                      {isCompleted && <span className="text-green-500 text-xs">✅</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{t.questionJa}</p>
                    <div className="mt-1">
                      <span
                        onClick={(e) => { e.stopPropagation(); setDocsUrl(t.docsUrl); }}
                        className="text-xs text-amber-600 hover:text-amber-800 border border-amber-200 hover:border-amber-400 rounded-full px-2 py-0.5 transition cursor-pointer"
                      >
                        📖 解説
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center pr-4 text-amber-500 text-xl font-bold">→</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {docsUrl && <DocsModal url={docsUrl} onClose={() => setDocsUrl(null)} />}
    </main>
  );
}

export default function IntermediateTemplatesPage() {
  return (
    <Suspense>
      <IntermediateTemplateList />
    </Suspense>
  );
}
