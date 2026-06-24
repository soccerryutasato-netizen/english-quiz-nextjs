"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Level, levelDescriptions, levelIcons, levelDetails, getAllTemplates } from "@/lib/mockData";
import { templateExplanations } from "@/lib/templateExplanations";

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

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* ナビ */}
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-4 block"
        >
          ← トップ
        </button>

        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${levelBadgeColors[level]}`}>
            {levelIcons[level]} Lv.{level}
          </span>
          <h1 className="text-2xl font-bold">テンプレ一覧</h1>
        </div>
        <p className="text-gray-500 text-sm mb-1 font-medium">{levelDescriptions[level]}</p>
        <p className="text-gray-400 text-xs mb-8">{levelDetails[level]}</p>

        {/* テンプレカード */}
        <div className="space-y-4">
          {templates.map((template, idx) => {
            const num = idx + 1;
            const hasExplanation = !!templateExplanations[num];
            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">テンプレ {num}</p>
                    <p className="font-mono text-lg font-semibold text-indigo-700 mb-0.5">
                      {template.pattern}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">{template.patternJa}</p>

                    {/* レベル2のみ例文プレビュー */}
                    {level === 2 && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 border border-gray-100 mb-3">
                        <span className="text-gray-400 text-xs block mb-0.5">例文</span>
                        <p className="font-medium">{template.example}</p>
                        <p className="text-gray-400 text-xs">{template.exampleJa}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-gray-400">{template.questions.length}問</p>
                      {hasExplanation && (
                        <button
                          onClick={() => setExplanationNum(num)}
                          className="text-xs text-indigo-500 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 rounded-full px-2.5 py-0.5 transition cursor-pointer"
                        >
                          📖 解説を見る
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/quiz?templateId=${template.id}&level=${level}`)
                    }
                    className="flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer"
                  >
                    挑戦 →
                  </button>
                </div>
              </div>
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
