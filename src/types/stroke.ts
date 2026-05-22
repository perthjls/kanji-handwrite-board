export type Point = {
  x: number;
  y: number;
};

export type Stroke = Point[];

export type CheckResult = {
  kanji: string;
  userStrokeCount: number;
  standardStrokeCount: number;
  isCorrect: boolean;
  message: string;
};
