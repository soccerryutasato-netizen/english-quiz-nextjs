"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getTemplateById, Level, Question } from "@/lib/mockData";
import { templateExplanations } from "@/lib/templateExplanations";

type JudgeResult = {
  score: number;
  isCorrect: boolean;
  feedback: string;
  correction: string;
  goodPoints: string[];
  improvements: string[];
};

// ---- レベル別クイズUI ----

function Level1Quiz({
  template,
  question,
  userAnswer,
  setUserAnswer,
  onSubmit,
  isJudging,
}: {
  template: { pattern: string; patternJa: string };
  question: Question;
  userAnswer: string;
  setUserAnswer: (v: string) => void;
  onSubmit: () => void;
  isJudging: boolean;
}) {
  return (
    <>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-4">
        <span className="text-indigo-400 text-xs block mb-0.5">テンプレ</span>
        <span className="font-mono font-semibold text-indigo-700">{template.pattern}</span>
        <span className="text-gray-400 text-xs ml-2">（{template.patternJa}）</span>
      </div>
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit(); }}
        placeholder="空欄に入る英語を入力してください..."
        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-indigo-400 resize-none bg-white"
        rows={2}
        disabled={isJudging}
      />
      <p className="text-xs text-gray-400 mt-1 text-right mb-2">Cmd+Enter で送信</p>
      <button
        onClick={onSubmit}
        disabled={!userAnswer.trim() || isJudging}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isJudging ? "判定中..." : "回答する"}
      </button>
    </>
  );
}

function Level2Quiz({
  template,
  question,
  userAnswer,
  setUserAnswer,
  onSubmit,
  isJudging,
}: {
  template: { pattern: string; patternJa: string };
  question: Question;
  userAnswer: string;
  setUserAnswer: (v: string) => void;
  onSubmit: () => void;
  isJudging: boolean;
}) {
  return (
    <>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-5">
        <span className="text-indigo-400 text-xs block mb-0.5">テンプレ</span>
        <span className="font-mono font-semibold text-indigo-700">{template.pattern}</span>
        <span className="text-gray-400 text-xs ml-2">（{template.patternJa}）</span>
      </div>
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit(); }}
        placeholder="テンプレを使って英語で答えを入力してください..."
        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-indigo-400 resize-none bg-white"
        rows={3}
        disabled={isJudging}
      />
      <p className="text-xs text-gray-400 mt-1 text-right mb-2">Cmd+Enter で送信</p>
      <button
        onClick={onSubmit}
        disabled={!userAnswer.trim() || isJudging}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isJudging ? "判定中..." : "回答する"}
      </button>
    </>
  );
}

function Level3Quiz({
  question,
  userAnswer,
  setUserAnswer,
  onSubmit,
  isJudging,
}: {
  question: Question;
  userAnswer: string;
  setUserAnswer: (v: string) => void;
  onSubmit: () => void;
  isJudging: boolean;
}) {
  return (
    <>
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit(); }}
        placeholder="英語で答えを入力してください..."
        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-indigo-400 resize-none bg-white"
        rows={3}
        disabled={isJudging}
      />
      <p className="text-xs text-gray-400 mt-1 text-right mb-2">Cmd+Enter で送信</p>
      <button
        onClick={onSubmit}
        disabled={!userAnswer.trim() || isJudging}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isJudging ? "判定中..." : "回答する"}
      </button>
    </>
  );
}

function Level4Quiz({
  question,
  onSelect,
}: {
  question: Question;
  onSelect: (choice: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (choice: string) => {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    // 少し遅らせて正誤を見せてから次へ
    setTimeout(() => onSelect(choice), 1200);
  };

  return (
    <div className="space-y-3">
      {question.choices.map((choice, i) => {
        const isCorrect = choice === question.sampleAnswer;
        const isSelected = choice === selected;
        let className = "w-full text-left px-4 py-3 rounded-xl border-2 font-mono text-sm transition-all cursor-pointer ";
        if (!revealed) {
          className += "border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50";
        } else if (isCorrect) {
          className += "border-green-500 bg-green-50 text-green-800";
        } else if (isSelected) {
          className += "border-red-400 bg-red-50 text-red-700";
        } else {
          className += "border-gray-200 bg-gray-50 text-gray-400";
        }
        return (
          <button key={i} onClick={() => handleSelect(choice)} className={className} disabled={revealed}>
            <span className="text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
            {choice}
            {revealed && isCorrect && <span className="ml-2 text-green-600">✓</span>}
            {revealed && isSelected && !isCorrect && <span className="ml-2 text-red-500">✗</span>}
          </button>
        );
      })}
    </div>
  );
}

function Level5Quiz({
  question,
  userAnswer,
  setUserAnswer,
  onSubmit,
  isJudging,
}: {
  question: Question;
  userAnswer: string;
  setUserAnswer: (v: string) => void;
  onSubmit: () => void;
  isJudging: boolean;
}) {
  return (
    <>
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 mb-5 text-xs text-purple-600">
        ✍️ テンプレやヒントなし。自由に英作文してください。
      </div>
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit(); }}
        placeholder="自由に英語で書いてください..."
        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-purple-400 resize-none bg-white"
        rows={4}
        disabled={isJudging}
      />
      <p className="text-xs text-gray-400 mt-1 text-right mb-2">Cmd+Enter で送信</p>
      <button
        onClick={onSubmit}
        disabled={!userAnswer.trim() || isJudging}
        className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-base hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isJudging ? "AI採点中..." : "回答する"}
      </button>
    </>
  );
}

// ---- テンプレ解説モーダル（クイズ内） ----

function ExplanationModal({ templateNum, onClose }: { templateNum: number; onClose: () => void }) {
  const content = templateExplanations[templateNum];
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-base">📖 テンプレ解説</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer">×</button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">
          {content ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-3 text-indigo-700 border-l-4 border-indigo-400 pl-3 bg-indigo-50 py-1 rounded-r-lg">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mt-5 mb-2 text-purple-700 border-l-4 border-purple-400 pl-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-1 text-teal-700">{children}</h3>,
                p: ({ children }) => <p className="text-sm text-gray-700 mb-3 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-indigo-600 bg-indigo-50 px-0.5 rounded">{children}</strong>,
                hr: () => <hr className="my-5 border-indigo-100" />,
                ul: ({ children }) => <ul className="list-none mb-3 space-y-1">{children}</ul>,
                li: ({ children }) => <li className="text-sm text-gray-700 pl-1 flex gap-1"><span>•</span><span>{children}</span></li>,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4 rounded-xl border border-indigo-100 shadow-sm">
                    <table className="text-sm border-collapse w-full">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="bg-indigo-100 text-indigo-800 px-3 py-2 text-left font-semibold">{children}</th>,
                td: ({ children }) => <td className="border-t border-indigo-50 px-3 py-2 text-gray-700">{children}</td>,
                code: ({ children }) => <code className="bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 text-sm font-mono text-amber-700">{children}</code>,
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

// ---- 判定結果表示 ----

function JudgePanel({
  result,
  sampleAnswer,
  pronunciation,
  explanation,
  templateNum,
  onNext,
  isLast,
}: {
  result: JudgeResult;
  sampleAnswer: string;
  pronunciation?: string;
  explanation?: string;
  templateNum: number;
  onNext: () => void;
  isLast: boolean;
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="space-y-4">
      {showExplanation && (
        <ExplanationModal templateNum={templateNum} onClose={() => setShowExplanation(false)} />
      )}
      <div className={`rounded-2xl border p-5 ${result.isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{result.isCorrect ? "✅" : "❌"}</span>
          <div>
            <p className="font-bold text-lg">{result.isCorrect ? "正解！" : "惜しい..."}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-lg ${i < result.score ? "text-yellow-400" : "text-gray-300"}`}>★</span>
              ))}
              <span className="text-sm text-gray-500 ml-1">({result.score}/5)</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700">{result.feedback}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-400 mb-1">回答</p>
        <p className="font-mono text-base font-semibold text-gray-800">{result.correction}</p>
        <p className="text-xs text-gray-400 mt-2 mb-0.5">模範解答</p>
        <p className="font-mono text-sm text-gray-600">{sampleAnswer}</p>
      </div>

      {pronunciation && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-xs font-semibold text-blue-700 mb-1">🔊 発音</p>
          <p className="text-sm text-blue-800 font-medium">{pronunciation}</p>
        </div>
      )}

      {explanation && (
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-xs font-semibold text-yellow-700 mb-1">💡 解説</p>
          <p className="text-sm text-yellow-800">{explanation}</p>
        </div>
      )}

      {result.goodPoints?.length > 0 && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs font-semibold text-green-700 mb-2">👍 良かった点</p>
          <ul className="space-y-1">
            {result.goodPoints.map((p, i) => <li key={i} className="text-sm text-green-800">• {p}</li>)}
          </ul>
        </div>
      )}
      {result.improvements?.length > 0 && (
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
          <p className="text-xs font-semibold text-orange-700 mb-2">💡 改善ポイント</p>
          <ul className="space-y-1">
            {result.improvements.map((p, i) => <li key={i} className="text-sm text-orange-800">• {p}</li>)}
          </ul>
        </div>
      )}

      <button
        onClick={() => setShowExplanation(true)}
        className="w-full py-3 rounded-xl border-2 border-indigo-300 text-indigo-600 font-bold text-base hover:bg-indigo-50 transition cursor-pointer"
      >
        📖 このテンプレの解説を見る
      </button>

      <button
        onClick={onNext}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition cursor-pointer"
      >
        {isLast ? "結果を見る 🏆" : "次の問題 →"}
      </button>
    </div>
  );
}

// ---- メインクイズコンポーネント ----

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const templateId = searchParams.get("templateId") ?? "";
  const level = Number(searchParams.get("level")) as Level;
  const template = getTemplateById(templateId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isJudging, setIsJudging] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [results, setResults] = useState<{ question: Question; result: JudgeResult }[]>([]);
  const [finished, setFinished] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        テンプレが見つかりません
      </div>
    );
  }

  const question = template.questions[currentIdx];
  const totalQuestions = template.questions.length;

  const submitAnswer = async (answer: string) => {
    if (isJudging) return;
    setIsJudging(true);
    setJudgeResult(null);

    // Level 1: テンプレの___に入力を埋めてフル文として判定
    const effectiveAnswer =
      level === 1 && template.pattern.includes("___")
        ? template.pattern.replace("___", answer.trim())
        : answer;

    const res = await fetch("/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptJa: question.promptJa,
        sampleAnswer: question.sampleAnswer,
        userAnswer: effectiveAnswer,
        pattern: template.pattern,
        level,
      }),
    });

    const data: JudgeResult = await res.json();
    setJudgeResult(data);
    setResults((prev) => [...prev, { question, result: data }]);
    setIsJudging(false);
  };

  // レベル4：選択肢を選んだ瞬間に即判定（入力なし）
  const handleLevel4Select = (choice: string) => {
    const isCorrect = choice === question.sampleAnswer;
    const result: JudgeResult = {
      score: isCorrect ? 5 : 1,
      isCorrect,
      feedback: isCorrect
        ? "正解です！"
        : `不正解です。正解は「${question.sampleAnswer}」でした。`,
      correction: question.sampleAnswer,
      goodPoints: isCorrect ? ["正しい選択肢を選べました！"] : [],
      improvements: isCorrect ? [] : [`正解: ${question.sampleAnswer}`],
    };
    setJudgeResult(result);
    setResults((prev) => [...prev, { question, result }]);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const newMessages = [...chatMessages, { role: "user" as const, content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: "assistant", content: data.reply || "エラーが発生しました。" }]);
    } catch {
      setChatMessages([...newMessages, { role: "assistant", content: "通信エラーが発生しました。" }]);
    }
    setChatLoading(false);
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= totalQuestions) {
      setFinished(true);
    } else {
      setCurrentIdx(nextIdx);
      setUserAnswer("");
      setJudgeResult(null);
      setChatMessages([]);
      setChatInput("");
    }
  };

  // ---- 結果画面 ----
  if (finished) {
    const totalScore = results.reduce((sum, r) => sum + r.result.score, 0);
    const maxScore = results.length * 5;
    const correctCount = results.filter((r) => r.result.isCorrect).length;

    return (
      <main className="min-h-screen px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🏆</div>
            <h1 className="text-2xl font-bold mb-1">クイズ終了！</h1>
            <p className="text-gray-500 text-sm font-mono">{template.pattern}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-1">
              {totalScore} / {maxScore}
            </div>
            <p className="text-gray-500 text-sm mb-4">正解数：{correctCount} / {totalQuestions}</p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-2xl ${i < Math.round((totalScore / maxScore) * 5) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {results.map(({ question: q, result: r }, i) => (
              <div key={i} className={`rounded-xl border p-4 ${r.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold ${r.isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {r.isCorrect ? "✓ 正解" : "✗ 不正解"} ({r.score}/5)
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{q.promptJa}</p>
                <p className="text-sm font-mono">{r.correction}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/templates?level=${level}`)}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
            >
              テンプレ一覧へ
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
            >
              トップへ
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ---- クイズ画面 ----
  const levelBadgeColors: Record<Level, string> = {
    1: "bg-green-100 text-green-700",
    2: "bg-blue-100 text-blue-700",
    3: "bg-red-100 text-red-700",
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* ナビ */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => router.push(`/templates?level=${level}`)}
            className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
          >
            ← テンプレ一覧
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelBadgeColors[level]}`}>
              Lv.{level}
            </span>
            <span className="text-sm text-gray-500">{currentIdx + 1} / {totalQuestions}</span>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* 問題文（全レベル共通） */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
          <p className="text-xs text-gray-400 mb-2">問題 {currentIdx + 1}</p>
          <p className="text-xl font-semibold">{question.promptJa}</p>
        </div>

        {/* レベル別入力UI */}
        {!judgeResult && (
          <>
            {level === 1 && !judgeResult && (
              <Level4Quiz
                question={question}
                onSelect={handleLevel4Select}
              />
            )}
            {(level === 2 || level === 3) && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="bg-green-50 border-b border-green-200 px-4 py-3">
                  <p className="text-sm font-bold text-green-800">✍️ クレイジーEnglish添削マシーン</p>
                  <p className="text-xs text-green-600">英語で回答を入力すると、クレイジーゆーたが添削してくれます！</p>
                </div>

                {level === 2 && (
                  <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-3">
                    <span className="text-indigo-400 text-xs block mb-0.5">テンプレ</span>
                    <span className="font-mono font-semibold text-indigo-700">{template.pattern}</span>
                  </div>
                )}

                <div className="px-4 py-3 space-y-3 max-h-[400px] overflow-y-auto">
                  {chatMessages.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">英語で回答を入力してみよう！</p>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-green-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-500">
                        添削中...✏️
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && chatInput.trim() && !chatLoading) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    placeholder="英語で答えてください..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || chatLoading}
                    className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex-shrink-0"
                  >
                    送信
                  </button>
                </div>

                {chatMessages.some((m) => m.role === "assistant") && !chatLoading && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={handleNext}
                      className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition cursor-pointer"
                    >
                      {currentIdx + 1 >= totalQuestions ? "結果を見る" : "次の問題 →"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 判定結果（選択式のみ） */}
        {judgeResult && level === 1 && (
          <JudgePanel
            result={judgeResult}
            sampleAnswer={question.sampleAnswer}
            pronunciation={question.pronunciation}
            explanation={question.explanation}
            templateNum={Number(template.id.replace("template-", ""))}
            onNext={handleNext}
            isLast={currentIdx + 1 >= totalQuestions}
          />
        )}
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizContent />
    </Suspense>
  );
}
