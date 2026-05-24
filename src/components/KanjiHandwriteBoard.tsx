import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  G,
  Path,
  Polyline,
  Text as SvgText,
} from "react-native-svg";

import {
  KANJIVG_VIEWBOX,
  KanjiVGItem,
  getKanjiData,
} from "../data/kanjiVGData";
import { CheckResult, Point, Stroke } from "../types/stroke";
import { checkKanjiWriting } from "../utils/strokeCompare";

type Props = {
  kanji: string;
  size?: number;
  showGuide?: boolean;
  onComplete?: (result: CheckResult) => void;
};

function getPathStart(d: string): Point | null {
  const m = d.match(/^\s*[Mm]\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/);
  if (!m) return null;
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

export function KanjiHandwriteBoard({
  kanji,
  size = 300,
  showGuide = true,
  onComplete,
}: Props) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [message, setMessage] = useState("");

  const target: KanjiVGItem | null = useMemo(
    () => getKanjiData(kanji),
    [kanji],
  );
  const scale = KANJIVG_VIEWBOX / size;

  function toViewBox(x: number, y: number): Point {
    return {
      x: Math.max(0, Math.min(KANJIVG_VIEWBOX, x * scale)),
      y: Math.max(0, Math.min(KANJIVG_VIEWBOX, y * scale)),
    };
  }

  function handleStart(e: any) {
    const { locationX, locationY } = e.nativeEvent;
    setCurrentStroke([toViewBox(locationX, locationY)]);
    setMessage("");
  }

  function handleMove(e: any) {
    const { locationX, locationY } = e.nativeEvent;
    setCurrentStroke((prev) => [...prev, toViewBox(locationX, locationY)]);
  }

  function handleEnd() {
    if (currentStroke.length === 0) return;
    setStrokes((prev) => [...prev, currentStroke]);
    setCurrentStroke([]);
  }

  function clearBoard() {
    setStrokes([]);
    setCurrentStroke([]);
    setMessage("");
  }

  function undoLast() {
    if (strokes.length === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
    setMessage("");
  }

  function checkAnswer() {
    const result = checkKanjiWriting(kanji, strokes);
    setMessage(result.message);
    onComplete?.(result);
  }

  function strokeToPoints(stroke: Stroke) {
    return stroke.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  }

  const standardCount = target?.strokes.length ?? 0;
  const userCount = strokes.length;
  const nextIndex = userCount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kanji Stroke Order Board</Text>

      <View style={styles.headerRow}>
        <Text style={styles.kanji}>{kanji}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.subtitle}>
            {target
              ? `${standardCount} ${standardCount === 1 ? "stroke" : "strokes"}`
              : "No KanjiVG data"}
          </Text>
          <Text style={styles.progress}>
            Progress: {userCount} / {standardCount || "-"}
          </Text>
        </View>
      </View>

      <View
        style={[styles.board, { width: size, height: size }]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleStart}
        onResponderMove={handleMove}
        onResponderRelease={handleEnd}
        onResponderTerminate={handleEnd}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${KANJIVG_VIEWBOX} ${KANJIVG_VIEWBOX}`}
        >
          <Path
            d={`M0 ${KANJIVG_VIEWBOX / 2} L${KANJIVG_VIEWBOX} ${KANJIVG_VIEWBOX / 2} M${KANJIVG_VIEWBOX / 2} 0 L${KANJIVG_VIEWBOX / 2} ${KANJIVG_VIEWBOX}`}
            stroke="#e5e7eb"
            strokeWidth={0.3}
            strokeDasharray="2,2"
            fill="none"
          />

          {showGuide &&
            target?.strokes.map((d, i) => {
              const isDone = i < userCount;
              const isNext = i === nextIndex;
              const color = isDone ? "#e5e7eb" : isNext ? "#fb923c" : "#cbd5e1";
              return (
                <Path
                  key={`guide-${i}`}
                  d={d}
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              );
            })}

          {showGuide &&
            target?.strokes.map((d, i) => {
              const start = getPathStart(d);
              if (!start) return null;
              const isDone = i < userCount;
              const isNext = i === nextIndex;
              const bg = isDone ? "#cbd5e1" : isNext ? "#fb923c" : "#1f2937";
              return (
                <G key={`num-${i}`}>
                  <Circle
                    cx={start.x}
                    cy={start.y}
                    r={3.6}
                    fill={bg}
                    fillOpacity={0.95}
                  />
                  <SvgText
                    x={start.x}
                    y={start.y + 1.7}
                    fontSize={4.6}
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    {i + 1}
                  </SvgText>
                </G>
              );
            })}

          {strokes.map((stroke, index) => (
            <Polyline
              key={`user-${index}`}
              points={strokeToPoints(stroke)}
              stroke="#111827"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {currentStroke.length > 0 && (
            <Polyline
              points={strokeToPoints(currentStroke)}
              stroke="#111827"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[
            styles.button,
            styles.undoButton,
            strokes.length === 0 && styles.buttonDisabled,
          ]}
          onPress={undoLast}
          disabled={strokes.length === 0}
        >
          <Text style={styles.buttonText}>Undo</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.clearButton]}
          onPress={clearBoard}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.checkButton]}
          onPress={checkAnswer}
        >
          <Text style={styles.buttonText}>Check</Text>
        </Pressable>
      </View>

      {message.length > 0 && (
        <Text
          style={[
            styles.message,
            standardCount > 0 && userCount === standardCount
              ? styles.messageOk
              : styles.messageWarn,
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  kanji: {
    fontSize: 56,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 64,
  },
  headerInfo: {
    gap: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  progress: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  board: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  undoButton: {
    backgroundColor: "#6b7280",
  },
  clearButton: {
    backgroundColor: "#374151",
  },
  checkButton: {
    backgroundColor: "#16a34a",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  message: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  messageOk: {
    color: "#16a34a",
  },
  messageWarn: {
    color: "#dc2626",
  },
});
