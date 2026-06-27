export type SoloPracticeAnswer = {
  id: string;
  topicId: string;
  userAnswer: string;
  correctionResult: string;
  createdAt: string;
  isFavorite?: boolean;
};

const STORAGE_KEY = "solo-practice-history";

function loadAll(): SoloPracticeAnswer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SoloPracticeAnswer[];
  } catch {
    return [];
  }
}

function saveAll(answers: SoloPracticeAnswer[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function saveAnswer(answer: SoloPracticeAnswer): void {
  const all = loadAll();
  all.unshift(answer);
  saveAll(all);
}

export function getAnswers(): SoloPracticeAnswer[] {
  return loadAll();
}

export function toggleFavorite(id: string): void {
  const all = loadAll();
  const target = all.find((a) => a.id === id);
  if (target) {
    target.isFavorite = !target.isFavorite;
    saveAll(all);
  }
}

export function getAnswersByTopicId(topicId: string): SoloPracticeAnswer[] {
  return loadAll().filter((a) => a.topicId === topicId);
}
