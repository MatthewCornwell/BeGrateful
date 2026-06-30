import { useSettings } from "@/scripts/settingsContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { colors, fontSize, fontFamily } = useSettings();

  const fontStyle =
    fontFamily === "System" ? undefined : fontFamily.toLowerCase();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: fontStyle,
          fontSize: fontSize + 10,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.tint,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: {
          fontFamily: fontStyle,
          fontSize: fontSize - 4,
        },
      }}
    >
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="settings-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Capture",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="camera-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Reflect"
        options={{
          title: "Reflect",
          headerTitle: "Reflect",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="book-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
