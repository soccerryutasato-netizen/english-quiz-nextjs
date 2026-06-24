import { rawTemplates } from "./rawTemplates";

export type Level = 1 | 2 | 3;

export interface Question {
  id: string;
  promptJa: string;
  hint: string;
  sampleAnswer: string;
  choices: string[];
  pronunciation?: string;
  explanation?: string;
}

export interface Template {
  id: string;
  pattern: string;
  patternJa: string;
  example: string;
  exampleJa: string;
  questions: Question[];
}

// Convert raw parsed data to Template format
export const templates: Template[] = rawTemplates.map((raw) => {
  const firstQ = raw.questions[0];
  return {
    id: `template-${raw.num}`,
    pattern: raw.pattern,
    patternJa: raw.pattern,
    example: firstQ.sampleAnswer,
    exampleJa: firstQ.promptJa,
    questions: raw.questions.map((q, i) => ({
      id: `t${raw.num}-q${i + 1}`,
      promptJa: q.promptJa,
      hint: q.hint,
      sampleAnswer: q.sampleAnswer,
      choices: q.choices,
      pronunciation: q.pronunciation || undefined,
      explanation: q.explanation || undefined,
    })),
  };
});

export function getAllTemplates(): Template[] {
  return templates;
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export const levelDescriptions: Record<Level, string> = {
  1: "選択式",
  2: "テンプレあり",
  3: "自由回答",
};

export const levelIcons: Record<Level, string> = {
  1: "🔢",
  2: "💡",
  3: "✍️",
};

export const levelDetails: Record<Level, string> = {
  1: "4択から正しい英文を選ぶ",
  2: "テンプレを見ながら英作文",
  3: "日本語だけ見て自由に英作文",
};
