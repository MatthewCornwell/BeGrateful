import { getContext } from "@/scripts/contextService";
import { addMoment } from "@/scripts/database";
import { useSettings } from "@/scripts/settingsContext";
import * as Location from "expo-location"; 
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SaveScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

  const { colors, fontSize, fontFamily } = useSettings();
  const font = fontFamily === "System" ? undefined : fontFamily.toLowerCase();

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onGetLocation() {
    setIsLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      const data = await getContext();
      if (data) {
        setLocation(data.location);
        setWeather(data.weather);
      }
    } else {
      alert("Permission required to get location");
    }

    setIsLoading(false);
  }

  function onSave() {
    if (imageUri) {
      addMoment(imageUri, caption, location, weather);
      router.dismissAll();
      router.replace("/(tabs)/Reflect");
    }
  }

  function onCancel() {
    router.back();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text
              style={[
                styles.label,
                { color: colors.text, fontFamily: font, fontSize: fontSize },
              ]}
            >
              What are you grateful for?
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.primary,
                  borderColor: colors.tint,
                  fontFamily: font,
                  fontSize: fontSize,
                },
              ]}
              placeholder="Type here..."
              placeholderTextColor={colors.tint}
              value={caption}
              onChangeText={setCaption}
              multiline
            />

            {location ? (
              <View style={styles.metaRow}>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: font,
                    fontSize: fontSize,
                  }}
                >
                  📍 {location}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: font,
                    fontSize: fontSize,
                  }}
                >
                  🌤 {weather}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={onGetLocation}
              style={[styles.dashedBtn, { borderColor: colors.primary }]}
              disabled={isLoading}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: font,
                  fontSize,
                }}
              >
                {isLoading ? "Loading..." : "Get Location and Weather"}
              </Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={onCancel}
                style={[
                  styles.btn,
                  { borderColor: colors.tint, borderWidth: 1 },
                ]}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: font,
                    fontSize: fontSize,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSave}
                style={[styles.btn, { backgroundColor: colors.primary }]}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: font,
                    fontSize: fontSize,
                  }}
                >
                  Save Moment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#ccc",
  },
  card: {
    margin: 20,
    borderRadius: 15,
    padding: 20,
    gap: 15,
  },
  label: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  metaRow: {
    flexDirection: "row",
    gap: 15,
  },
  dashedBtn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  row: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
