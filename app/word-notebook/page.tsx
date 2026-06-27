"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getWords, deleteWord, SavedWord } from "@/lib/wordNotebook";

export default function WordNotebookPage() {
  const router = useRouter();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setWords(getWords());
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return words;
    const q = search.trim().toLowerCase();
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.answer.toLowerCase().includes(q)
    );
  }, [words, search]);

  const handleDelete = (id: string) => {
    deleteWord(id);
    setWords(getWords());
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <button
        onClick={() => router.push("/")}
        className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer mb-4 block"
      >
        ← トップに戻る
      </button>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📖</span>
        <h1 className="text-xl font-bold">単語帳</h1>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="単語を検索..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">
          {words.length === 0
            ? "まだ単語が保存されていません"
            : "該当する単語がありません"}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((word) => {
            const isExpanded = expandedId === word.id;
            return (
              <div
                key={word.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : word.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {word.word}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(word.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {word.answer}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(word.id)}
                    className="text-gray-400 hover:text-red-500 text-sm cursor-pointer flex-shrink-0"
                  >
                    🗑
                  </button>
                </div>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {word.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
