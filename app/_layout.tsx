import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { C } from "@/lib/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.bg },
          headerShadowVisible: false,
          headerTitleStyle: { color: C.text, fontWeight: "700" },
          headerTintColor: C.accent,
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: C.accent,
                  }}
                >
                  <Text style={{ color: C.bg, fontWeight: "900", fontSize: 17 }}>✓</Text>
                </View>
                <View>
                  <Text style={{ color: C.text, fontWeight: "800", fontSize: 16 }}>
                    Greenlite
                  </Text>
                  <Text style={{ color: C.faint, fontSize: 10, marginTop: -1 }}>
                    Approval cockpit
                  </Text>
                </View>
              </View>
            ),
            headerRight: () => (
              <Link href="/chat" asChild>
                <Pressable
                  accessibilityLabel="Open AI assistant"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 13,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: C.surface2,
                    borderColor: C.border,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: C.accent2, fontWeight: "800", fontSize: 18 }}>✦</Text>
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
