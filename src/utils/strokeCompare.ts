import { getKanjiData } from "../data/kanjiVGData";
import { CheckResult, Stroke } from "../types/stroke";

export function checkKanjiWriting(
  kanji: string,
  userStrokes: Stroke[],
): CheckResult {
  const target = getKanjiData(kanji);

  if (!target) {
    return {
      kanji,
      userStrokeCount: userStrokes.length,
      standardStrokeCount: 0,
      isCorrect: false,
      message: `No KanjiVG data for "${kanji}".`,
    };
  }

  const standardStrokeCount = target.strokes.length;
  const userStrokeCount = userStrokes.length;
  const isCorrect = userStrokeCount === standardStrokeCount;
  const strokeWord = (n: number) => (n === 1 ? "stroke" : "strokes");

  return {
    kanji,
    userStrokeCount,
    standardStrokeCount,
    isCorrect,
    message: isCorrect
      ? `Great! Correct stroke count (${standardStrokeCount} ${strokeWord(standardStrokeCount)}).`
      : `Try again. Standard is ${standardStrokeCount} ${strokeWord(standardStrokeCount)}, you wrote ${userStrokeCount} ${strokeWord(userStrokeCount)}.`,
  };
}
