import { getMoments } from "@/scripts/database";
import { useSettings } from "@/scripts/settingsContext";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const db = SQLite.openDatabaseSync("begrateful.db");

export default function GalleryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialId = params.initialId;

  const { fontSize, fontFamily } = useSettings();
  const font = fontFamily === "System" ? undefined : fontFamily.toLowerCase();

  const [moments, setMoments] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const data = getMoments();
    setMoments(data);
    const idx = data.findIndex((m) => m.id.toString() == initialId);
    if (idx >= 0) setCurrentIndex(idx);
  }, []);

  const handleSave = async () => {
    const item = moments[currentIndex];
    if (!item) return;
    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(item.image_uri);
      Alert.alert("Saved");
    } else {
      Alert.alert("Permission required");
    }
  };

  const handleDelete = () => {
    const item = moments[currentIndex];
    if (!item) return;

    db.runSync("DELETE FROM moments WHERE id = ?", [item.id]);

    const newMoments = moments.filter((m) => m.id !== item.id);
    setMoments(newMoments);

    if (newMoments.length === 0) router.back();
    else if (currentIndex >= newMoments.length)
      setCurrentIndex(newMoments.length - 1);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.pageContainer}>
      <Image
        source={{ uri: item.image_uri }}
        style={styles.fullImage}
        resizeMode="contain"
      />

      <View style={styles.overlay}>
        <Text style={[styles.date, { fontFamily: font }]}>
          {new Date(item.date_created).toDateString()}
        </Text>

        <Text
          style={[styles.caption, { fontFamily: font, fontSize: fontSize + 4 }]}
        >
          "{item.caption}"
        </Text>

        <View style={styles.metaRow}>
          {item.location_label ? (
            <Text style={[styles.tag, { fontFamily: font, fontSize }]}>
              📍 {item.location_label}
            </Text>
          ) : null}

          {item.weather_temp ? (
            <Text style={[styles.tag, { fontFamily: font, fontSize }]}>
              🌤 {item.weather_temp}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Top Bar Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleSave}>
          <Ionicons name="save-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={28} color="#ff4444" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { marginLeft: 20 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {moments.length > 0 && (
        <FlatList
          data={moments}
          horizontal
          pagingEnabled
          initialScrollIndex={currentIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  pageContainer: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: width,
    height: height,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 50,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  date: {
    color: "#ccc",
    fontSize: 12,
    marginBottom: 4,
  },
  caption: {
    color: "white",
    fontWeight: "600",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    color: "#ffffffff",
    fontWeight: "bold",
    marginRight: 15,
  },
  topBar: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
  },
});
