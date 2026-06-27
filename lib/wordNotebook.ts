export type SavedWord = {
  id: string;
  word: string;
  answer: string;
  createdAt: string;
};

const STORAGE_KEY = "word-notebook";

function loadAll(): SavedWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedWord[];
  } catch {
    return [];
  }
}

function saveAll(words: SavedWord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

export function saveWord(word: SavedWord): void {
  const all = loadAll();
  all.unshift(word);
  saveAll(all);
}

export function getWords(): SavedWord[] {
  return loadAll();
}

export function deleteWord(id: string): void {
  const all = loadAll().filter((w) => w.id !== id);
  saveAll(all);
}
