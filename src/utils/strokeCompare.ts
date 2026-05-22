import { kanjiVGData } from "../data/kanjiVGData";
import { CheckResult, Stroke } from "../types/stroke";

export function checkKanjiWriting(
  kanji: string,
  userStrokes: Stroke[],
): CheckResult {
  const target = kanjiVGData[kanji];

  if (!target) {
    return {
      kanji,
      userStrokeCount: userStrokes.length,
      standardStrokeCount: 0,
      isCorrect: false,
      message: `don't have KanjiVG data for 「${kanji}」.`,
    };
  }

  const standardStrokeCount = target.strokes.length;
  const userStrokeCount = userStrokes.length;

  const isCorrect = userStrokeCount === standardStrokeCount;

  return {
    kanji,
    userStrokeCount,
    standardStrokeCount,
    isCorrect,
    message: isCorrect
      ? "Good! The number of strokes is correct."
      : `Try again. The standard is ${standardStrokeCount} strokes, but you wrote ${userStrokeCount} strokes.`,
  };
}
