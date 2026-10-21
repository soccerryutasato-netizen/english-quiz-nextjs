import type { Question } from "./mockData";

export type JudgeResult = {
  score: number;
  isCorrect: boolean;
  feedback: string;
  correction: string;
  goodPoints: string[];
  improvements: string[];
};

export type QuizAnswer = { question: Question; result: JudgeResult };

export function isJudgeResult(value: unknown): value is JudgeResult {
  if (!value || typeof value !== "object") return false;
  const r = value as JudgeResult;
  return Number.isInteger(r.score) && r.score >= 1 && r.score <= 5
    && typeof r.isCorrect === "boolean" && r.isCorrect === (r.score >= 4)
    && typeof r.feedback === "string" && typeof r.correction === "string"
    && Array.isArray(r.goodPoints) && r.goodPoints.every(p => typeof p === "string")
    && Array.isArray(r.improvements) && r.improvements.every(p => typeof p === "string");
}

// Keep the first successful answer per question; practice must not inflate totals.
export function recordAnswer(answers: QuizAnswer[], answer: QuizAnswer): QuizAnswer[] {
  return answers.some(a => a.question.id === answer.question.id)
    ? answers : [...answers, answer];
}

export function summarizeAnswers(answers: QuizAnswer[]) {
  const totalScore = answers.reduce((sum, a) => sum + a.result.score, 0);
  const answeredCount = answers.length;
  const correctCount = answers.filter(a => a.result.isCorrect).length;
  return {
    totalScore, maxScore: answeredCount * 5, answeredCount, correctCount,
    correctRate: answeredCount ? Math.round(correctCount / answeredCount * 100) : null,
    stars: answeredCount ? Math.round(totalScore / answeredCount) : 0,
  };
}
