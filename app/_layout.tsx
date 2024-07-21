// app/_layout.tsx
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, Tabs } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    // <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Search" }}/>
        <Stack.Screen name="detail/[id]" options={{ title: "Detail" }}/>
        <Stack.Screen name="edit/[id]" options={{ title: "Edit" }}/>
      </Stack>
  );
}
