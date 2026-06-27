"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { simulationTopics } from "@/lib/simulationTopics";

type ChatMessage = {
  role: "partner" | "user";
  content: string;
  type?: "correction";
};

export default function SimulationChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const topic = simulationTopics.find((t) => t.id === id);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [translatedIdx, setTranslatedIdx] = useState<Record<number, string>>({});
  const [translatingIdx, setTranslatingIdx] = useState<number | null>(null);
  const [questionBox, setQuestionBox] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  // Track conversation history for API (role: user/assistant)
  const apiMessagesRef = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    if (!topic) return;
    setMessages([
      { role: "partner", content: topic.firstMessage },
    ]);
    apiMessagesRef.current = [];
    setInput("");
    setTranslatedIdx({});
    setQuestionBox(false);
    setQuestionAnswer("");
  }, [id, topic]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!topic) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">シナリオが見つかりません</p>
      </main>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    apiMessagesRef.current.push({ role: "user", content: userText });
    setLoading(true);

    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerRole: topic.partnerRole,
          partnerName: topic.partnerName,
          situation: topic.situation,
          messages: apiMessagesRef.current,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "エラーが発生しました";

      // Parse reply and correction
      const parts = reply.split("---CORRECTION---");
      const replyPart = parts[0]?.trim();
      const correctionPart = parts[1]?.trim();

      // Store full assistant reply for conversation context
      apiMessagesRef.current.push({ role: "assistant", content: replyPart || reply });

      const newMessages: ChatMessage[] = [];
      if (replyPart) {
        newMessages.push({ role: "partner", content: replyPart });
      }
      if (correctionPart) {
        newMessages.push({ role: "partner", content: correctionPart, type: "correction" });
      }
      if (newMessages.length === 0) {
        newMessages.push({ role: "partner", content: reply });
      }
      setMessages((prev) => [...prev, ...newMessages]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "partner", content: "通信エラーが発生しました。もう一度送ってみてね！" },
      ]);
    }
    setLoading(false);
  };

  const handleTranslate = async (idx: number, text: string) => {
    if (translatedIdx[idx] || translatingIdx === idx) return;
    setTranslatingIdx(idx);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `以下の英語を自然な日本語に翻訳してください。翻訳だけ返してください。絵文字は使わないでください。\n\n${text}` }],
        }),
      });
      const data = await res.json();
      setTranslatedIdx((prev) => ({ ...prev, [idx]: data.reply || "翻訳できませんでした" }));
    } catch {
      setTranslatedIdx((prev) => ({ ...prev, [idx]: "翻訳エラー" }));
    }
    setTranslatingIdx(null);
  };

  const handleQuestionAsk = async () => {
    if (!questionInput.trim() || questionLoading) return;
    setQuestionLoading(true);
    setQuestionAnswer("");
    try {
      const res = await fetch("/api/question-box", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionInput }),
      });
      const data = await res.json();
      setQuestionAnswer(data.reply || data.error || "回答を取得できませんでした");
    } catch {
      setQuestionAnswer("通信エラーが発生しました");
    }
    setQuestionLoading(false);
  };

  const isEnglishBubble = (msg: ChatMessage) =>
    msg.role === "partner" && msg.type !== "correction";

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-teal-600 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.push("/simulation")}
          className="text-white/80 hover:text-white text-sm cursor-pointer"
        >
          ←
        </button>
        <div className="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center text-lg flex-shrink-0">
          {topic.emoji}
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{topic.partnerName}</p>
          <p className="text-xs text-teal-200">{topic.emoji} {topic.titleJa}</p>
        </div>
      </div>

      {/* Situation banner */}
      <div className="bg-teal-50 border-b border-teal-200 px-4 py-2">
        <p className="text-xs text-teal-700">
          💡 シチュエーション: {topic.description}
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "partner" && (
                <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
                  {topic.emoji}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-green-500 text-white rounded-br-md"
                    : msg.type === "correction"
                      ? "bg-amber-50 text-gray-800 rounded-bl-md shadow-sm border border-amber-200"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>

            {/* 和訳ボタン */}
            {isEnglishBubble(msg) && (
              <div className="ml-10 mt-1">
                {translatedIdx[i] ? (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5 inline-block">{translatedIdx[i]}</p>
                ) : (
                  <button
                    onClick={() => handleTranslate(i, msg.content)}
                    disabled={translatingIdx === i}
                    className="text-xs text-teal-500 hover:text-teal-700 cursor-pointer"
                  >
                    {translatingIdx === i ? "翻訳中..." : "🇯🇵 和訳を見る"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
              {topic.emoji}
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 質問箱 */}
      {questionBox && (
        <div className="bg-teal-50 border-t-2 border-teal-300 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-teal-700">📖 わからない単語・表現を聞いてみよう！</p>
            <button onClick={() => { setQuestionBox(false); setQuestionAnswer(""); setQuestionInput(""); }} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
          </div>
          <div className="flex gap-2 mb-2">
            <input
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && questionInput.trim() && !questionLoading) {
                  e.preventDefault();
                  handleQuestionAsk();
                }
              }}
              placeholder="例: reservation ってどういう意味？"
              className="flex-1 border border-teal-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-400 bg-white"
              disabled={questionLoading}
            />
            <button
              onClick={handleQuestionAsk}
              disabled={!questionInput.trim() || questionLoading}
              className="px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex-shrink-0"
            >
              {questionLoading ? "..." : "聞く"}
            </button>
          </div>
          {questionAnswer && (
            <div className="bg-white rounded-xl p-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {questionAnswer}
            </div>
          )}
        </div>
      )}

      {/* 分からない単語ボタン */}
      {!questionBox && (
        <div className="bg-teal-50 border-t-2 border-teal-300 px-4 py-2">
          <button
            onClick={() => setQuestionBox(true)}
            className="w-full text-center text-sm text-white bg-teal-500 hover:bg-teal-600 rounded-full py-2.5 font-bold transition cursor-pointer shadow-sm"
          >
            📖 分からない単語・表現がある場合はこちら
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex gap-2 sticky bottom-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && input.trim() && !loading) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="英語で返事を書こう..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 bg-gray-50"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex-shrink-0"
        >
          ▶
        </button>
      </div>
    </main>
  );
}
