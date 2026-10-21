import test from 'node:test';
import assert from 'node:assert/strict';
import { recordAnswer, summarizeAnswers, isJudgeResult } from '../lib/quizResult.ts';
import { saveTemplateSession, loadProgress, markTemplateCompleted } from '../lib/progress.ts';

const grade = (score = 5) => ({ score, isCorrect: score >= 4, feedback: 'OK', correction: 'I have a book.', goodPoints: [], improvements: [] });
const answer = (i, score = 5) => ({ question: { id: `q${i}`, promptJa: '本を持っています', sampleAnswer: 'I have a book.', hint: '', choices: [] }, result: grade(score) });
function storage() {
  const map = new Map();
  globalThis.window = {};
  globalThis.localStorage = { getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v) };
}

test('30 successful answers produce a real score and accuracy', () => {
  const answers = Array.from({ length: 30 }, (_, i) => answer(i, i < 24 ? 5 : 2));
  assert.deepEqual(summarizeAnswers(answers), { totalScore: 132, maxScore: 150, answeredCount: 30, correctCount: 24, correctRate: 80, stars: 4 });
});
test('practice and duplicate clicks cannot inflate totals', () => {
  const first = recordAnswer([], answer(1, 2));
  assert.equal(recordAnswer(first, answer(1, 5)), first);
  assert.equal(summarizeAnswers(first).correctRate, 0);
});
test('unrecorded legacy answers are not counted as wrong or divided by zero', () => {
  assert.equal(summarizeAnswers([]).correctRate, null);
  assert.equal(summarizeAnswers([]).stars, 0);
  assert.equal(summarizeAnswers([answer(30)]).correctRate, 100);
});
test('reload and switching templates preserve grades and question position by level', () => {
  storage();
  const first = Array.from({ length: 15 }, (_, i) => answer(i));
  saveTemplateSession(2, 'template-1', { currentQuestionIdx: 15, results: first, finished: false });
  saveTemplateSession(2, 'template-2', { currentQuestionIdx: 1, results: [answer(1, 2)], finished: false });
  const restored = loadProgress('beginner', 2).sessions['template-1'];
  assert.equal(restored.currentQuestionIdx, 15);
  assert.equal(restored.results.length, 15);
  assert.equal(loadProgress('beginner', 1), null);
  const all = [...restored.results, ...Array.from({ length: 15 }, (_, i) => answer(i + 15))];
  assert.equal(summarizeAnswers(all).totalScore, 150);
  markTemplateCompleted('beginner', 2, 'template-1');
  saveTemplateSession(2, 'template-1', { currentQuestionIdx: 29, results: all, finished: true });
  assert.equal(loadProgress('beginner', 2).sessions['template-1'].finished, true);
  assert.deepEqual(loadProgress('beginner', 2).completedTemplates, ['template-1']);
});
test('legacy progress and completed markers survive adding sessions and restarting', () => {
  storage();
  localStorage.setItem('progress-beginner-3', JSON.stringify({ currentTemplateId: 'template-1', currentQuestionIdx: 12, completedTemplates: ['template-2'] }));
  assert.equal(loadProgress('beginner', 3).currentQuestionIdx, 12);
  saveTemplateSession(3, 'template-1', { currentQuestionIdx: 12, results: [], finished: false });
  assert.deepEqual(loadProgress('beginner', 3).completedTemplates, ['template-2']);
  saveTemplateSession(3, 'template-1', { currentQuestionIdx: 0, results: [], finished: false });
  assert.equal(loadProgress('beginner', 3).sessions['template-1'].currentQuestionIdx, 0);
});
test('API failures and malformed grades cannot be recorded as valid grades', () => {
  for (const bad of [{ error: 'Unavailable' }, { ...grade(), score: 10 }, { ...grade(), isCorrect: false }, { ...grade(), score: '5' }, null]) assert.equal(isJudgeResult(bad), false);
  assert.equal(isJudgeResult(grade()), true);
});
