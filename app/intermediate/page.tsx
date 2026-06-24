"use client";

import { useRouter } from "next/navigation";
import { intermediateTemplates } from "@/lib/intermediateTemplates";

export default function IntermediateTemplatesPage() {
  const router = useRouter();

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
          <span className="px-3 py-1 rounded-full text-sm font-bold border bg-amber-100 text-amber-700 border-amber-300">
            📙 中級
          </span>
          <h1 className="text-2xl font-bold">日常会話テンプレ</h1>
        </div>
        <p className="text-gray-500 text-sm mb-1 font-medium">英語の質問に英語で答えよう</p>
        <p className="text-gray-400 text-xs mb-8">質問を読んで、自分の言葉で英語で答えてみましょう</p>

        <div className="space-y-4">
          {intermediateTemplates.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">テンプレ {t.num}</p>
                  <p className="font-semibold text-lg text-amber-700 mb-0.5">
                    {t.question}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{t.questionJa}</p>
                  <a
                    href={t.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-500 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 rounded-full px-2.5 py-0.5 transition inline-block"
                  >
                    📖 解説を見る
                  </a>
                </div>
                <button
                  onClick={() => router.push(`/intermediate/quiz?templateId=${t.id}`)}
                  className="flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-all cursor-pointer"
                >
                  挑戦 →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
