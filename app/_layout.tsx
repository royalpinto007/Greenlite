import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";
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
        <Stack.Screen
          name="index"
          options={{
            title: "Greenlite",
            headerRight: () => (
              <Link href="/chat" asChild>
                <Pressable
                  style={{
                    backgroundColor: C.accent,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: "#0c0a10", fontWeight: "700", fontSize: 13 }}>
                    Ask AI
                  </Text>
                </Pressable>
              </Link>
            ),
          }}
        />
        <Stack.Screen name="approval/[id]" options={{ title: "Review" }} />
        <Stack.Screen name="chat" options={{ title: "Assistant" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
