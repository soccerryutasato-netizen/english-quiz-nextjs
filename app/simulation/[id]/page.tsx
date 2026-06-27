"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { simulationTopics } from "@/lib/simulationTopics";
import { CharacterAvatar } from "@/lib/CharacterAvatar";
import { saveChatSession } from "@/lib/chatHistory";
import { saveWord } from "@/lib/wordNotebook";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

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
  const { listening, toggle: toggleMic } = useSpeechRecognition((text) => setInput((prev) => prev ? prev + " " + text : text));
  const [translatedIdx, setTranslatedIdx] = useState<Record<number, string>>({});
  const [translatingIdx, setTranslatingIdx] = useState<number | null>(null);
  const [questionBox, setQuestionBox] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [chatSaved, setChatSaved] = useState(false);

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

  const questionBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (questionAnswer) {
      questionBoxRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [questionAnswer]);

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

      // Parse reply, correction, and followup
      const replyPart = reply.match(/^([\s\S]*?)(?=---CORRECTION---|$)/)?.[1]?.trim();
      const correctionPart = reply.match(/---CORRECTION---\s*([\s\S]*?)(?=---FOLLOWUP---|$)/)?.[1]?.trim();
      const followupPart = reply.match(/---FOLLOWUP---\s*([\s\S]*?)$/)?.[1]?.trim();

      // Store full assistant reply for conversation context (reply + followup)
      const contextReply = [replyPart, followupPart].filter(Boolean).join(" ");
      apiMessagesRef.current.push({ role: "assistant", content: contextReply || reply });

      const newMessages: ChatMessage[] = [];
      if (replyPart) {
        newMessages.push({ role: "partner", content: replyPart });
      }
      if (correctionPart) {
        newMessages.push({ role: "partner", content: correctionPart, type: "correction" });
      }
      if (followupPart) {
        newMessages.push({ role: "partner", content: followupPart });
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
      const answer = data.reply || data.error || "回答を取得できませんでした";
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
      setQuestionAnswer("通信エラーが発生しました");
    }
    setQuestionLoading(false);
  };

  const handleSaveChatSession = () => {
    if (!topic || messages.length === 0) return;
    saveChatSession({
      id: Date.now().toString(),
      type: "simulation",
      topicId: topic.id,
      topicTitle: topic.titleJa,
      topicEmoji: topic.emoji,
      messages: messages.map((m) => ({ role: m.role, content: m.content, type: m.type })),
      createdAt: new Date().toISOString(),
    });
    setChatSaved(true);
  };

  const isEnglishBubble = (msg: ChatMessage) =>
    msg.role === "partner" && msg.type !== "correction";

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* Scene header */}
      <div className={`relative ${topic.sceneBg} px-4 pt-4 pb-16`}>
        <button
          onClick={() => router.push("/simulation")}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center text-sm hover:bg-black/30 cursor-pointer z-10"
        >
          ←
        </button>
        {messages.length > 1 && (
          <button
            onClick={handleSaveChatSession}
            disabled={chatSaved}
            className={`absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full transition cursor-pointer z-10 ${
              chatSaved
                ? "bg-green-400 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {chatSaved ? "保存済 ✓" : "💬 保存"}
          </button>
        )}
        <div className="text-8xl opacity-20 text-center pt-2">{topic.sceneEmoji}</div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
            <CharacterAvatar gender={topic.characterGender} size={80} />
          </div>
        </div>
      </div>

      {/* Character name badge */}
      <div className="text-center pt-12 pb-2">
        <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {topic.partnerName}
        </span>
      </div>

      {/* Situation text */}
      <div className="text-center px-6 pb-3">
        <p className="text-xs text-gray-500">{topic.description}</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-40 space-y-3 relative" style={{ backgroundColor: topic.chatBgColor }}>
        {/* Background photo */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${topic.chatBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          }}
        />
        {messages.map((msg, i) => (
          <div key={i} className="relative z-10">
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "partner" && (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mr-2 mt-1 overflow-hidden">
                  <CharacterAvatar gender={topic.characterGender} size={32} />
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
            <div ref={questionBoxRef} className="bg-white rounded-xl p-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
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
