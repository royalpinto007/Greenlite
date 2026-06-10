import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { C } from "@/lib/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.bg },
          headerTitleStyle: { color: C.text, fontWeight: "600" },
          headerTintColor: C.accent,
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: "greenlite." }} />
        <Stack.Screen name="approval/[id]" options={{ title: "Review" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
