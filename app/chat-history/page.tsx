"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getChatSessions, deleteChatSession, SavedChatSession } from "@/lib/chatHistory";
import { soloPracticeTopics } from "@/lib/soloPracticeTopics";
import { simulationTopics } from "@/lib/simulationTopics";

type FilterType = "all" | "solo-practice" | "simulation";

export default function ChatHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SavedChatSession[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setSessions(getChatSessions());
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return sessions;
    return sessions.filter((s) => s.type === filter);
  }, [sessions, filter]);

  const handleDelete = (id: string) => {
    deleteChatSession(id);
    setSessions(getChatSessions());
    if (expandedId === id) setExpandedId(null);
  };

  const getTopicInfo = (session: SavedChatSession) => {
    if (session.type === "solo-practice") {
      const topic = soloPracticeTopics.find((t) => t.id === session.topicId);
      return { emoji: topic?.emoji || session.topicEmoji, title: topic?.title || session.topicTitle };
    }
    const topic = simulationTopics.find((t) => t.id === session.topicId);
    return { emoji: topic?.emoji || session.topicEmoji, title: topic?.titleJa || session.topicTitle };
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
        <span className="text-2xl">💬</span>
        <h1 className="text-xl font-bold">チャット履歴</h1>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {([
          ["all", "すべて"],
          ["solo-practice", "独り言"],
          ["simulation", "シミュレーション"],
        ] as [FilterType, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition ${
              filter === value
                ? "bg-violet-100 text-violet-700 border border-violet-300"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">
          {sessions.length === 0
            ? "まだチャット履歴がありません"
            : "該当する履歴がありません"}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((session) => {
            const isExpanded = expandedId === session.id;
            const info = getTopicInfo(session);
            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          session.type === "solo-practice"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        {session.type === "solo-practice" ? "独り言" : "シミュレーション"}
                      </span>
                      <span className="font-semibold text-sm text-gray-800">
                        {info.emoji} {info.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(session.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {session.messages.length}件のメッセージ
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="text-gray-400 hover:text-red-500 text-sm cursor-pointer flex-shrink-0"
                  >
                    🗑
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    {session.messages.map((msg, i) => {
                      const isUser = msg.role === "user";
                      const isCorrection = msg.type === "correction";
                      return (
                        <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          {!isUser && session.type === "solo-practice" && (
                            <img
                              src="/crazy-yuta.jpg"
                              alt="CRAZY ゆーた"
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2 mt-1"
                            />
                          )}
                          {!isUser && session.type === "simulation" && (
                            <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
                              {info.emoji}
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                              isUser
                                ? "bg-green-500 text-white rounded-br-md"
                                : isCorrection
                                  ? "bg-amber-50 text-gray-800 rounded-bl-md shadow-sm border border-amber-200"
                                  : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}
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
