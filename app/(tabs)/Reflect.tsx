import { getMoments, Moment } from "@/scripts/database";
import { useSettings } from "@/scripts/settingsContext";
import { useFocusEffect, useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReflectScreen() {
  const [data, setData] = useState<Moment[]>([]);
  const router = useRouter();

  const { colors, fontSize, fontFamily } = useSettings();
  const fontStyle =
    fontFamily === "System" ? undefined : fontFamily.toLowerCase();

  const width = Dimensions.get("window").width;
  const screenPadding = 10;
  const gap = 5;
  const imageSize = (width - screenPadding * 2 - gap * 2) / 3;

  useFocusEffect(() => {
    setData(getMoments());
  });

  const renderItem = ({ item }: { item: Moment }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/gallery", params: { initialId: item.id } })
      }
      style={styles.itemContainer}
    >
      <Image
        source={{ uri: item.image_uri }}
        style={[
          styles.image,
          {
            width: imageSize,
            height: imageSize,
            borderColor: "white",
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[
        styles.container,
        { backgroundColor: colors.background, padding: screenPadding },
      ]}
    >
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={[
              styles.emptyText,
              { color: colors.text, fontSize, fontFamily: fontStyle },
            ]}
          >
            No moments yet. Go capture some!
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{ gap: 5 }}
          contentContainerStyle={{ gap: 5, paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    opacity: 0.7,
  },
  itemContainer: {},
  image: {
    borderWidth: 2,
    borderRadius: 12,
  },
});
