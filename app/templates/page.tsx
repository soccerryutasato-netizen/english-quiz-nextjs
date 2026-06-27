"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { Level, levelDescriptions, levelIcons, levelDetails, getAllTemplates } from "@/lib/mockData";
import { templateExplanations } from "@/lib/templateExplanations";
import { loadProgress, getCompletedTemplates } from "@/lib/progress";

const levelBadgeColors: Record<number, string> = {
  1: "bg-green-100 text-green-700 border-green-300",
  2: "bg-blue-100 text-blue-700 border-blue-300",
  3: "bg-red-100 text-red-700 border-red-300",
};

function ExplanationModal({ templateNum, onClose }: { templateNum: number; onClose: () => void }) {
  const content = templateExplanations[templateNum];
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-base">📖 テンプレ解説</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* 本文 */}
        <div className="overflow-y-auto px-5 py-4 flex-1">
          {content ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mt-6 mb-3 text-indigo-700 border-l-4 border-indigo-400 pl-3 bg-indigo-50 py-1 rounded-r-lg">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mt-5 mb-2 text-purple-700 border-l-4 border-purple-400 pl-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold mt-4 mb-1 text-teal-700">{children}</h3>
                ),
                p: ({ children }) => <p className="text-sm text-gray-700 mb-3 leading-relaxed">{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-bold text-indigo-600 bg-indigo-50 px-0.5 rounded">{children}</strong>
                ),
                hr: () => <hr className="my-5 border-indigo-100" />,
                ul: ({ children }) => <ul className="list-none mb-3 space-y-1">{children}</ul>,
                li: ({ children }) => (
                  <li className="text-sm text-gray-700 pl-1 flex gap-1"><span>•</span><span>{children}</span></li>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4 rounded-xl border border-indigo-100 shadow-sm">
                    <table className="text-sm border-collapse w-full">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-indigo-100 text-indigo-800 px-3 py-2 text-left font-semibold">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="border-t border-indigo-50 px-3 py-2 text-gray-700">{children}</td>
                ),
                code: ({ children }) => (
                  <code className="bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 text-sm font-mono text-amber-700">{children}</code>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">このテンプレの解説はまだ準備中です🙏</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplateList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const levelParam = Number(searchParams.get("level")) as Level;
  const level: Level = ([1, 2, 3] as Level[]).includes(levelParam) ? levelParam : 1;
  const templates = getAllTemplates();
  const [explanationNum, setExplanationNum] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [resumeInfo, setResumeInfo] = useState<{ templateId: string; questionIdx: number } | null>(null);

  useEffect(() => {
    setCompletedIds(getCompletedTemplates("beginner", level));
    const progress = loadProgress("beginner", level);
    if (progress?.currentTemplateId) {
      setResumeInfo({ templateId: progress.currentTemplateId, questionIdx: progress.currentQuestionIdx });
    } else {
      setResumeInfo(null);
    }
  }, [level]);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        {/* ナビ */}
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
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="23" fill="#dcfce7" stroke="#86efac" strokeWidth="2"/><path d="M14 34V16a2 2 0 012-2h12a2 2 0 012 2v18" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 34l10-6 10 6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 20h4M20 24h6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/><path d="M32 18l3-3M35 15l-1.5-1.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <h1 className="text-2xl mb-2" style={{ fontWeight: 900 }}>テンプレ一覧</h1>
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
            onClick={() => router.push(`/quiz?templateId=${resumeInfo.templateId}&level=${level}`)}
            className="w-full mb-6 py-3 rounded-xl bg-green-600 text-white text-base hover:bg-green-700 transition cursor-pointer shadow-sm"
            style={{ fontWeight: 700 }}
          >
            続きから →
          </button>
        )}

        {/* テンプレカード */}
        <div className="space-y-4">
          {templates.map((template, idx) => {
            const num = idx + 1;
            const hasExplanation = !!templateExplanations[num];
            const isCompleted = completedIds.includes(template.id);
            return (
              <button
                key={template.id}
                onClick={() =>
                  router.push(`/quiz?templateId=${template.id}&level=${level}`)
                }
                className="w-full text-left rounded-2xl bg-green-50 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-stretch">
                  {/* Left color strip */}
                  <div className="w-14 flex-shrink-0 bg-gradient-to-b from-green-400 to-emerald-500 rounded-l-2xl flex items-center justify-center relative overflow-hidden">
                    <span className="text-white/20 font-black text-3xl select-none absolute" style={{ fontWeight: 900, right: -2 }}>
                      {String(num).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Icon circle */}
                  <div className="flex items-center pl-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-green-200">
                      <span className="text-green-700 text-sm" style={{ fontWeight: 900 }}>{num}</span>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0 py-3 pl-3 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-green-700" style={{ fontWeight: 900 }}>
                        {template.pattern}
                      </span>
                      {isCompleted && <span className="text-green-500 text-xs">✅</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{template.patternJa}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{template.questions.length}問</span>
                      {hasExplanation && (
                        <span
                          onClick={(e) => { e.stopPropagation(); setExplanationNum(num); }}
                          className="text-xs text-green-600 hover:text-green-800 border border-green-200 hover:border-green-400 rounded-full px-2 py-0.5 transition cursor-pointer"
                        >
                          📖 解説
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center pr-4 text-green-500 text-xl font-bold">→</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 解説モーダル */}
      {explanationNum !== null && (
        <ExplanationModal
          templateNum={explanationNum}
          onClose={() => setExplanationNum(null)}
        />
      )}
    </main>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense>
      <TemplateList />
    </Suspense>
  );
}
