import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { askAI } from "@/lib/ai";
import { C } from "@/lib/theme";

type Msg = { role: "user" | "assistant"; content: string };

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
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              backgroundColor: item.role === "user" ? C.accent : C.surface,
              borderColor: C.border,
              borderWidth: item.role === "user" ? 0 : 1,
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 9,
            }}
          >
            <Text
              style={{
                color: item.role === "user" ? "#0c0a10" : C.text,
                fontSize: 14,
                lineHeight: 20,
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
          borderTopColor: C.border,
          borderTopWidth: 1,
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
            backgroundColor: C.surface,
            borderColor: C.border,
            borderWidth: 1,
            borderRadius: 10,
            color: C.text,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />
        <Pressable
          onPress={send}
          disabled={busy}
          style={{
            backgroundColor: C.accent,
            borderRadius: 10,
            paddingHorizontal: 16,
            justifyContent: "center",
            opacity: busy ? 0.5 : 1,
          }}
        >
          <Text style={{ color: "#0c0a10", fontWeight: "700" }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
