import { initDatabase } from "@/scripts/database";
import { SettingsProvider, useSettings } from "@/scripts/settingsContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

function Layout() {
  const { theme, colors } = useSettings();

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="save"
          options={{ presentation: "modal", title: "Reflect" }}
        />
        <Stack.Screen
          name="gallery"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar style={theme === "focus" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SettingsProvider>
      <Layout />
    </SettingsProvider>
  );
}
