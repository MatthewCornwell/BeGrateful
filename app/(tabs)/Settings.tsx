import { PALETTES, useSettings } from "@/scripts/settingsContext";
import Slider from "@react-native-community/slider";
import * as SQLite from "expo-sqlite";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const db = SQLite.openDatabaseSync("begrateful.db");

const THEMES = ["serenity", "empathy", "focus"];

export default function SettingsScreen() {
  const {
    theme,
    setTheme,
    colors,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
  } = useSettings();

  const font = fontFamily === "System" ? undefined : fontFamily.toLowerCase();

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.label,
              { color: colors.text, fontFamily: font, fontSize },
            ]}
          >
            Theme
          </Text>
          <View style={styles.list}>
            {THEMES.map((key) => {
              const isActive = theme === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setTheme(key)}
                  style={[
                    styles.btn,
                    {
                      backgroundColor: isActive
                        ? colors.tint
                        : colors.background,
                      borderColor: isActive ? colors.primary : "transparent",
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: font,
                      fontSize,
                      color: isActive ? "#FFF" : colors.text,
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    {PALETTES[key].name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.label,
              { color: colors.text, fontFamily: font, fontSize },
            ]}
          >
            Size: {Math.round(fontSize)}
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={12}
              maximumValue={32}
              step={1}
              value={fontSize}
              onValueChange={setFontSize}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.tint}
              thumbTintColor={colors.primary}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.label,
              { color: colors.text, fontFamily: font, fontSize },
            ]}
          >
            Font Style
          </Text>
          <View style={styles.row}>
            {["System", "Serif", "Monospace"].map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFontFamily(f as any)}
                style={[
                  styles.btn,
                  {
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: colors.background,
                    borderWidth: fontFamily === f ? 1 : 0,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: f === "System" ? undefined : f.toLowerCase(),
                    fontSize,
                    color: fontFamily === f ? colors.primary : colors.text,
                  }}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => db.execSync("DELETE FROM moments")}
        >
          <Text
            style={{
              color: "red",
              textAlign: "center",
              fontFamily: font,
              fontSize,
            }}
          >
            Clear All Data
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 10,
    padding: 15,
  },
  label: {
    fontWeight: "500",
    marginBottom: 5,
  },
  list: {
    gap: 10,
    marginTop: 10,
  },
  btn: {
    padding: 12,
    borderRadius: 8,
  },
  sliderContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
