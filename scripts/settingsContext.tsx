import React, { createContext, useContext, useState } from "react";

export const PALETTES: any = {
  serenity: {
    name: "Serenity",
    background: "#90A4AE",
    card: "#CFD8DC",
    text: "#102027",
    primary: "#37474F",
    tint: "#546E7A",
  },
  empathy: {
    name: "Empathy",
    background: "#A5D6A7",
    card: "#C8E6C9",
    text: "#1B5E20",
    primary: "#2E7D32",
    tint: "#4CAF50",
  },
  focus: {
    name: "Focus",
    background: "#102A43",
    card: "#243B53",
    text: "#F0F4F8",
    primary: "#33C3F0",
    tint: "#486581",
  },
};

const SettingsContext = createContext<any>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("focus");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("System");

  return (
    <SettingsContext.Provider
      value={{
        theme,
        colors: PALETTES[theme],
        fontSize,
        fontFamily,
        setTheme,
        setFontSize,
        setFontFamily,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  return ctx;
};
