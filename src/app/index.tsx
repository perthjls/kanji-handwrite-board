import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { KanjiHandwriteBoard } from "../components/KanjiHandwriteBoard";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <KanjiHandwriteBoard
            kanji="見"
            size={320}
            showGuide={true}
            onComplete={(result) => {
              console.log("Check result:", result);
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
