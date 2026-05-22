export type KanjiVGItem = {
  kanji: string;
  strokes: string[];
};

export const kanjiVGData: Record<string, KanjiVGItem> = {
  日: {
    kanji: "日",
    strokes: [
      "M70 50 L230 50",
      "M230 50 L230 250",
      "M70 150 L230 150",
      "M70 50 L70 250",
    ],
  },

  一: {
    kanji: "一",
    strokes: ["M60 150 L240 150"],
  },

  二: {
    kanji: "二",
    strokes: ["M80 100 L220 100", "M60 200 L240 200"],
  },

  三: {
    kanji: "三",
    strokes: ["M80 80 L220 80", "M90 150 L210 150", "M60 230 L240 230"],
  },
};
