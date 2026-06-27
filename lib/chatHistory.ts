export type SavedChatSession = {
  id: string;
  type: "solo-practice" | "simulation";
  topicId: string;
  topicTitle: string;
  topicEmoji: string;
  messages: { role: string; content: string; type?: string }[];
  createdAt: string;
};

const STORAGE_KEY = "chat-history";

function loadAll(): SavedChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedChatSession[];
  } catch {
    return [];
  }
}

function saveAll(sessions: SavedChatSession[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function saveChatSession(session: SavedChatSession): void {
  const all = loadAll();
  all.unshift(session);
  saveAll(all);
}

export function getChatSessions(): SavedChatSession[] {
  return loadAll();
}

export function deleteChatSession(id: string): void {
  const all = loadAll().filter((s) => s.id !== id);
  saveAll(all);
}
