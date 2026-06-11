import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { askAI } from "@/lib/ai";
import { C } from "@/lib/theme";

type Msg = { role: "user" | "assistant"; content: string };
const SUGGESTIONS = [
  "What needs attention?",
  "Explain the refund risk",
  "Which action is safest?",
];

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! Ask me about the agent suite, escalations, or what an action means before you approve it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<FlatList<Msg>>(null);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setBusy(true);
    const reply = await askAI(q);
    setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    setBusy(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [input, busy]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 10 }}
        ListHeaderComponent={
          <View
            style={{
              borderRadius: 18,
              borderWidth: 1,
              borderColor: C.border,
              backgroundColor: C.surface,
              padding: 16,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: C.accent2, fontSize: 11, fontWeight: "900", letterSpacing: 0.8 }}>
              DECISION COPILOT
            </Text>
            <Text style={{ color: C.text, fontSize: 20, lineHeight: 25, fontWeight: "900", marginTop: 9 }}>
              Get a second opinion before an agent acts.
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {SUGGESTIONS.map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    onPress={() => setInput(suggestion)}
                    style={{
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: C.border,
                      backgroundColor: C.surface2,
                      paddingHorizontal: 11,
                      paddingVertical: 7,
                    }}
                  >
                    <Text style={{ color: C.muted, fontSize: 11 }}>{suggestion}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              backgroundColor: item.role === "user" ? C.accent : C.surface2,
              borderColor: C.border,
              borderWidth: item.role === "user" ? 0 : 1,
              borderRadius: 18,
              paddingHorizontal: 13,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: item.role === "user" ? C.bg : C.text,
                fontSize: 14,
                lineHeight: 21,
              }}
            >
              {item.content}
            </Text>
          </View>
        )}
        ListFooterComponent={
          busy ? (
            <View style={{ flexDirection: "row", gap: 8, padding: 8 }}>
              <ActivityIndicator color={C.accent} size="small" />
              <Text style={{ color: C.muted }}>thinking…</Text>
            </View>
          ) : null
        }
      />
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          padding: 12,
          paddingBottom: 16,
          borderTopColor: C.border,
          borderTopWidth: 1,
          backgroundColor: C.bg,
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask the assistant…"
          placeholderTextColor={C.muted}
          onSubmitEditing={send}
          style={{
            flex: 1,
            backgroundColor: C.surface2,
            borderColor: C.border,
            borderWidth: 1,
            borderRadius: 15,
            color: C.text,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        />
        <Pressable
          onPress={send}
          disabled={busy}
          style={{
            backgroundColor: C.accent,
            width: 48,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            opacity: busy ? 0.5 : 1,
          }}
        >
          <Text style={{ color: C.bg, fontWeight: "900", fontSize: 19 }}>↑</Text>
        </Pressable>
      </View>
    </View>
  );
}
