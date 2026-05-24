import { KANJIVG_VIEWBOX, kanjiPaths } from "./kanjiPaths.generated";

export { KANJIVG_VIEWBOX };

export type KanjiVGItem = {
  kanji: string;
  strokes: string[];
};

export function getKanjiData(kanji: string): KanjiVGItem | null {
  const strokes = kanjiPaths[kanji];
  if (!strokes) return null;
  return { kanji, strokes };
}

export function hasKanjiData(kanji: string): boolean {
  return Boolean(kanjiPaths[kanji]);
}
