"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { soloPracticeTopics } from "@/lib/soloPracticeTopics";
import { saveAnswer } from "@/lib/soloPracticeHistory";

type ChatMessage = {
  role: "crazy" | "user";
  content: string;
  type?: "intro" | "model" | "question" | "correction";
};

export default function SoloPracticePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const topic = soloPracticeTopics.find((t) => t.id === id);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastUserAnswer, setLastUserAnswer] = useState("");
  const [lastCorrection, setLastCorrection] = useState("");

  useEffect(() => {
    if (!topic) return;
    setMessages([
      { role: "crazy", content: `Hey! 今日は「${topic.title}」について英語で話してみよう！ ${topic.emoji}`, type: "intro" },
      { role: "crazy", content: `まずはお手本を見てみてね！\n\n${topic.modelAnswer}`, type: "model" },
      { role: "crazy", content: `じゃあ、こんな質問をイメージして答えてみよう！\n\n「${topic.questionExample}」\n\nYour turn! 英語で自由に書いてみて！`, type: "question" },
    ]);
    setInput("");
    setSaved(false);
    setLastUserAnswer("");
    setLastCorrection("");
  }, [id, topic]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!topic) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">テーマが見つかりません</p>
      </main>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setLastUserAnswer(userText);
    setSaved(false);

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/solo-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle: topic.title,
          modelAnswer: topic.modelAnswer,
          questionExample: topic.questionExample,
          userAnswer: userText,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "エラーが発生しました。";
      setLastCorrection(reply);
      setMessages((prev) => [...prev, { role: "crazy", content: reply, type: "correction" }]);
    } catch {
      const errMsg = "通信エラーが発生しました。もう一度送ってみてね！";
      setLastCorrection(errMsg);
      setMessages((prev) => [...prev, { role: "crazy", content: errMsg }]);
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!lastUserAnswer || !lastCorrection) return;
    saveAnswer({
      id: Date.now().toString(),
      topicId: topic.id,
      userAnswer: lastUserAnswer,
      correctionResult: lastCorrection,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-violet-600 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.push("/solo-practice")}
          className="text-white/80 hover:text-white text-sm cursor-pointer"
        >
          ←
        </button>
        <div className="w-9 h-9 rounded-full bg-violet-400 flex items-center justify-center text-lg flex-shrink-0">
          🔥
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">CRAZY ゆーた</p>
          <p className="text-xs text-violet-200">{topic.emoji} {topic.title}</p>
        </div>
        {lastCorrection && (
          <button
            onClick={handleSave}
            disabled={saved}
            className={`text-xs px-3 py-1 rounded-full transition cursor-pointer ${
              saved
                ? "bg-green-400 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {saved ? "保存済 ✓" : "💾 保存"}
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "crazy" && (
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
                🔥
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-green-500 text-white rounded-br-md"
                  : "bg-white text-gray-800 rounded-bl-md shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
              🔥
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

      {/* Action buttons after correction */}
      {lastCorrection && !loading && (
        <div className="px-4 pb-2 flex gap-2">
          <button
            onClick={() => {
              setInput("");
              setLastCorrection("");
              setLastUserAnswer("");
              setSaved(false);
              setMessages((prev) => [
                ...prev,
                { role: "crazy", content: "Nice try! もう一回書いてみる？ それとも別のテーマにする？ 💪", type: "intro" },
              ]);
            }}
            className="flex-1 py-2 rounded-xl bg-violet-100 text-violet-700 font-bold text-xs hover:bg-violet-200 transition cursor-pointer"
          >
            もう一回チャレンジ
          </button>
          <button
            onClick={() => router.push("/solo-practice")}
            className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-200 transition cursor-pointer"
          >
            別のテーマにする
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
          placeholder="Write your answer in English..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 bg-gray-50"
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
