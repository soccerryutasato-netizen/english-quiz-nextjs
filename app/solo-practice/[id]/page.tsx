"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { soloPracticeTopics } from "@/lib/soloPracticeTopics";
import { saveAnswer } from "@/lib/soloPracticeHistory";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

const categoryBgImages: Record<string, string> = {
  "食べ物": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=60",
  "日常": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=60",
  "健康・ジム": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=60",
  "趣味": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=60",
  "旅行": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=60",
  "仕事": "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=60",
  "猫・動物": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=60",
  "サウナ・リラックス": "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=60",
  "もしも系": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=60",
  "思い出・経験": "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=60",
};
import { saveChatSession } from "@/lib/chatHistory";
import { saveWord } from "@/lib/wordNotebook";

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
  const { listening, toggle: toggleMic } = useSpeechRecognition((text) => setInput((prev) => prev ? prev + " " + text : text));
  const [saved, setSaved] = useState(false);
  const [lastUserAnswer, setLastUserAnswer] = useState("");
  const [lastCorrection, setLastCorrection] = useState("");
  const [translatedIdx, setTranslatedIdx] = useState<Record<number, string>>({});
  const [translatingIdx, setTranslatingIdx] = useState<number | null>(null);
  const [questionBox, setQuestionBox] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [chatSaved, setChatSaved] = useState(false);

  useEffect(() => {
    if (!topic) return;
    setMessages([
      { role: "crazy", content: topic.questionExample, type: "intro" },
    ]);
    setInput("");
    setSaved(false);
    setLastUserAnswer("");
    setLastCorrection("");
    setTranslatedIdx({});
    setQuestionBox(false);
    setQuestionAnswer("");
  }, [id, topic]);

  const questionBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (questionAnswer) {
      questionBoxRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [questionAnswer]);

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
      const reply = data.reply || data.error || "エラーが発生しました";

      setLastCorrection(reply);

      const replyPart = reply.match(/---REPLY---\s*([\s\S]*?)(?=---CORRECTION---|$)/)?.[1]?.trim();
      const correctionPart = reply.match(/---CORRECTION---\s*([\s\S]*?)(?=---FOLLOWUP---|$)/)?.[1]?.trim();
      const followupPart = reply.match(/---FOLLOWUP---\s*([\s\S]*?)$/)?.[1]?.trim();

      const newMessages: ChatMessage[] = [];
      if (replyPart) {
        newMessages.push({ role: "crazy", content: replyPart });
      }
      if (correctionPart) {
        newMessages.push({ role: "crazy", content: correctionPart, type: "correction" });
      }
      if (followupPart) {
        newMessages.push({ role: "crazy", content: followupPart });
      }
      if (newMessages.length === 0) {
        newMessages.push({ role: "crazy", content: reply });
      }
      setMessages((prev) => [...prev, ...newMessages]);
    } catch {
      const errMsg = "通信エラーが発生しました💦 もう一度送ってみてね！";
      setLastCorrection(errMsg);
      setMessages((prev) => [...prev, { role: "crazy", content: errMsg }]);
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
      const answer = data.reply || data.error || "回答を取得できませんでした💦";
      setQuestionAnswer(answer);
      if (data.reply) {
        saveWord({
          id: Date.now().toString(),
          word: questionInput.trim(),
          answer,
          createdAt: new Date().toISOString(),
        });
      }
    } catch {
      setQuestionAnswer("通信エラーが発生しました💦");
    }
    setQuestionLoading(false);
  };

  const handleSaveChatSession = () => {
    if (!topic || messages.length === 0) return;
    saveChatSession({
      id: Date.now().toString(),
      type: "solo-practice",
      topicId: topic.id,
      topicTitle: topic.title,
      topicEmoji: topic.emoji,
      messages: messages.map((m) => ({ role: m.role, content: m.content, type: m.type })),
      createdAt: new Date().toISOString(),
    });
    setChatSaved(true);
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

  const isEnglishBubble = (msg: ChatMessage) =>
    msg.role === "crazy" && msg.type !== "correction";

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* Scene header */}
      <div className="relative bg-gradient-to-b from-violet-500 to-violet-700 px-4 pt-4 pb-16">
        <button
          onClick={() => router.push("/solo-practice")}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center text-sm hover:bg-black/30 cursor-pointer z-10"
        >
          ←
        </button>
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {lastCorrection && (
            <button
              onClick={handleSave}
              disabled={saved}
              className={`text-xs px-3 py-1.5 rounded-full transition cursor-pointer ${
                saved
                  ? "bg-green-400 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {saved ? "保存済 ✓" : "💾 保存"}
            </button>
          )}
          {messages.length > 1 && (
            <button
              onClick={handleSaveChatSession}
              disabled={chatSaved}
              className={`text-xs px-3 py-1.5 rounded-full transition cursor-pointer ${
                chatSaved
                  ? "bg-green-400 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {chatSaved ? "保存済 ✓" : "💬 保存"}
            </button>
          )}
        </div>
        <div className="text-6xl opacity-20 text-center pt-2">{topic.emoji}</div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden">
            <img src="/crazy-yuta.jpg" alt="CRAZY ゆーた" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Character name badge */}
      <div className="text-center pt-12 pb-1">
        <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          CRAZY ゆーた
        </span>
      </div>

      {/* Topic title */}
      <div className="text-center px-6 pb-3">
        <p className="text-xs text-gray-500">{topic.emoji} {topic.title}</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-40 space-y-3 relative" style={{ backgroundColor: "#faf5ff" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${categoryBgImages[topic.category] || categoryBgImages["日常"]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          }}
        />
        {messages.map((msg, i) => (
          <div key={i} className="relative z-10">
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "crazy" && (
                <img src="/crazy-yuta.jpg" alt="CRAZY ゆーた" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2 mt-1" />
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

            {/* 和訳ボタン（英語の吹き出しのみ） */}
            {isEnglishBubble(msg) && (
              <div className="ml-10 mt-1">
                {translatedIdx[i] ? (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5 inline-block">{translatedIdx[i]}</p>
                ) : (
                  <button
                    onClick={() => handleTranslate(i, msg.content)}
                    disabled={translatingIdx === i}
                    className="text-xs text-violet-500 hover:text-violet-700 cursor-pointer"
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
            <img src="/crazy-yuta.jpg" alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2 mt-1" />
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
        <div className="bg-violet-50 border-t-2 border-violet-300 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-violet-700">📖 わからない単語・表現を聞いてみよう！</p>
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
              placeholder="例: bucket list ってどういう意味？"
              className="flex-1 border border-violet-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-violet-400 bg-white"
              disabled={questionLoading}
            />
            <button
              onClick={handleQuestionAsk}
              disabled={!questionInput.trim() || questionLoading}
              className="px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex-shrink-0"
            >
              {questionLoading ? "..." : "聞く"}
            </button>
          </div>
          {questionAnswer && (
            <div ref={questionBoxRef} className="bg-white rounded-xl p-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {questionAnswer}
            </div>
          )}
        </div>
      )}

      {/* 分からない単語ボタン */}
      {!questionBox && (
        <div className="bg-violet-50 border-t-2 border-violet-300 px-4 py-2">
          <button
            onClick={() => setQuestionBox(true)}
            className="w-full text-center text-sm text-white bg-violet-500 hover:bg-violet-600 rounded-full py-2.5 font-bold transition cursor-pointer shadow-sm"
          >
            📖 分からない単語・表現がある場合はこちら
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-3 py-3 flex gap-1.5 items-center sticky bottom-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && input.trim() && !loading) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="English..."
          className="flex-1 min-w-0 border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-violet-400 bg-gray-50"
          disabled={loading}
        />
        <button
          onClick={toggleMic}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer flex-shrink-0 ${
            listening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          🎤
        </button>
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
