import { Level } from "./mockData";

export type CourseType = "beginner" | "intermediate";

export interface CourseProgress {
  currentTemplateId: string;
  currentQuestionIdx: number;
  completedTemplates: string[];
}

function getKey(course: CourseType, level: Level): string {
  return `progress-${course}-${level}`;
}

export function loadProgress(course: CourseType, level: Level): CourseProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getKey(course, level));
    if (!raw) return null;
    return JSON.parse(raw) as CourseProgress;
  } catch {
    return null;
  }
}

export function saveProgress(
  course: CourseType,
  level: Level,
  data: Partial<CourseProgress>
): void {
  if (typeof window === "undefined") return;
  const existing = loadProgress(course, level);
  const merged: CourseProgress = {
    currentTemplateId: data.currentTemplateId ?? existing?.currentTemplateId ?? "",
    currentQuestionIdx: data.currentQuestionIdx ?? existing?.currentQuestionIdx ?? 0,
    completedTemplates: data.completedTemplates ?? existing?.completedTemplates ?? [],
  };
  localStorage.setItem(getKey(course, level), JSON.stringify(merged));
}

export function markTemplateCompleted(
  course: CourseType,
  level: Level,
  templateId: string
): void {
  const existing = loadProgress(course, level);
  const completed = existing?.completedTemplates ?? [];
  if (!completed.includes(templateId)) {
    completed.push(templateId);
  }
  saveProgress(course, level, { completedTemplates: completed });
}

export function getCompletedTemplates(course: CourseType, level: Level): string[] {
  const p = loadProgress(course, level);
  return p?.completedTemplates ?? [];
}
