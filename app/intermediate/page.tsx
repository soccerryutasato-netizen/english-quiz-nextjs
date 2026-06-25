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
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-4 block"
        >
          ← トップ
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${levelBadgeColors[level]}`}>
            {levelIcons[level]} Lv.{level}
          </span>
          <h1 className="text-2xl font-bold">中級テンプレ一覧</h1>
        </div>
        <p className="text-gray-500 text-sm mb-1 font-medium">{levelDescriptions[level]}</p>
        <p className="text-gray-400 text-xs mb-8">{levelDetails[level]}</p>

        {/* 続きからボタン */}
        {resumeInfo && !completedIds.includes(resumeInfo.templateId) && (
          <button
            onClick={() => router.push(`/intermediate/quiz?templateId=${resumeInfo.templateId}&level=${level}`)}
            className="w-full mb-6 py-3 rounded-xl bg-amber-600 text-white font-bold text-base hover:bg-amber-700 transition cursor-pointer"
          >
            続きから →
          </button>
        )}

        <div className="space-y-4">
          {intermediateTemplates.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">
                    テンプレ {t.num}
                    {completedIds.includes(t.id) && <span className="ml-1 text-green-500">✅</span>}
                  </p>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-lg text-amber-700">{t.question}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{t.questionJa}</p>
                  <button
                    onClick={() => setDocsUrl(t.docsUrl)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-300 hover:border-indigo-500 rounded-xl px-4 py-2 transition inline-block font-bold bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                  >
                    📖 解説を見る
                  </button>
                </div>
                <button
                  onClick={() => router.push(`/intermediate/quiz?templateId=${t.id}&level=${level}`)}
                  className="flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-all cursor-pointer"
                >
                  挑戦 →
                </button>
              </div>
            </div>
          ))}
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
