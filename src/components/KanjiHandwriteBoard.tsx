import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Polyline } from "react-native-svg";

import { kanjiVGData } from "../data/kanjiVGData";
import { CheckResult, Point, Stroke } from "../types/stroke";
import { checkKanjiWriting } from "../utils/strokeCompare";

type Props = {
  kanji: string;
  size?: number;
  showGuide?: boolean;
  onComplete?: (result: CheckResult) => void;
};

export function KanjiHandwriteBoard({
  kanji,
  size = 300,
  showGuide = true,
  onComplete,
}: Props) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [message, setMessage] = useState("");

  const target = kanjiVGData[kanji];

  function handleStart(e: any) {
    const { locationX, locationY } = e.nativeEvent;

    setCurrentStroke([
      {
        x: locationX,
        y: locationY,
      },
    ]);
  }

  function handleMove(e: any) {
    const { locationX, locationY } = e.nativeEvent;

    setCurrentStroke((prev) => [
      ...prev,
      {
        x: locationX,
        y: locationY,
      },
    ]);
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

  function checkAnswer() {
    const result = checkKanjiWriting(kanji, strokes);
    setMessage(result.message);
    onComplete?.(result);
  }

  function strokeToPoints(stroke: Stroke) {
    return stroke.map((point: Point) => `${point.x},${point.y}`).join(" ");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kanji Handwrite Board</Text>

      <Text style={styles.kanji}>{kanji}</Text>

      <Text style={styles.subtitle}>
        Standard strokes: {target ? target.strokes.length : "No data"}
      </Text>

      <View
        style={[
          styles.board,
          {
            width: size,
            height: size,
          },
        ]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleStart}
        onResponderMove={handleMove}
        onResponderRelease={handleEnd}
        onResponderTerminate={handleEnd}
      >
        <Svg width={size} height={size}>
          {showGuide &&
            target?.strokes.map((path, index) => (
              <Path
                key={`guide-${index}`}
                d={path}
                stroke="#dddddd"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}

          {strokes.map((stroke, index) => (
            <Polyline
              key={`stroke-${index}`}
              points={strokeToPoints(stroke)}
              stroke="black"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {currentStroke.length > 0 && (
            <Polyline
              points={strokeToPoints(currentStroke)}
              stroke="black"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Your strokes: {strokes.length}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.checkButton]}
          onPress={checkAnswer}
        >
          <Text style={styles.buttonText}>Check</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.clearButton]}
          onPress={clearBoard}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
      </View>

      {message.length > 0 && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  kanji: {
    fontSize: 64,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  board: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 16,
    overflow: "hidden",
  },
  infoBox: {
    marginTop: 12,
  },
  infoText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  checkButton: {
    backgroundColor: "#16a34a",
  },
  clearButton: {
    backgroundColor: "#374151",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
    textAlign: "center",
  },
});
