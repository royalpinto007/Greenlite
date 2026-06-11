import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { decide, fetchApprovals, type Approval } from "@/lib/api";
import { askAI } from "@/lib/ai";
import { C } from "@/lib/theme";

export default function ApprovalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Approval | null>(null);
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovals().then((all) => {
      setItem(all.find((a) => a.id === id) ?? null);
    });
  }, [id]);

  async function askAdvice() {
    if (!item) return;
    setAiBusy(true);
    setAdvice(null);
    const reply = await askAI(
      `A support agent escalated this and proposes: "${item.proposedAction}". ` +
        `Customer message: "${item.detail}". Reason: "${item.reason ?? ""}". ` +
        `In 2 sentences, should a human approve it? Note any risk.`,
    );
    setAdvice(reply);
    setAiBusy(false);
  }

  async function act(approve: boolean) {
    if (!item) return;
    setBusy(true);
    const ok = await decide(item, approve);
    setBusy(false);
    if (ok) {
      router.back();
    } else {
      Alert.alert("Could not submit", "Please try again.");
    }
  }

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={C.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 12 }}>
        <View
          style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#4C3D1F",
            backgroundColor: "#1C1810",
            padding: 17,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <Text style={{ color: C.warn, fontSize: 10, fontWeight: "900", letterSpacing: 0.9 }}>
              HUMAN DECISION REQUIRED
            </Text>
            <Text style={{ color: C.faint, fontSize: 10, textTransform: "uppercase" }}>{item.source}</Text>
          </View>
          <Text style={{ color: C.text, fontSize: 23, lineHeight: 29, fontWeight: "900", marginTop: 12 }}>
            {item.title}
          </Text>
          <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 7 }}>
            Review the proposed action and policy reason before allowing the agent to continue.
          </Text>
        </View>
        <Field label="from agent" value={item.source} />
        <Field label="message" value={item.detail} />
        <Field label="proposed action" value={item.proposedAction} highlight />
        {item.reason ? <Field label="why escalated" value={item.reason} /> : null}

        <Pressable
          onPress={askAdvice}
          disabled={aiBusy}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderColor: "#31486A",
            borderWidth: 1,
            backgroundColor: "#111B2B",
            borderRadius: 15,
            paddingHorizontal: 14,
            paddingVertical: 13,
            opacity: aiBusy ? 0.6 : 1,
          }}
        >
          <Text style={{ color: C.accent2, fontWeight: "900", fontSize: 16 }}>✦</Text>
          <Text style={{ color: C.accent, fontWeight: "800", fontSize: 13 }}>
            {aiBusy ? "Reviewing risk..." : "Ask AI for a second opinion"}
          </Text>
        </Pressable>
        {advice ? (
          <View
            style={{
              backgroundColor: C.surface2,
              borderColor: "#31486A",
              borderWidth: 1,
              borderRadius: 16,
              padding: 14,
            }}
          >
              <Text style={{ color: C.accent2, fontSize: 10, fontWeight: "900", letterSpacing: 0.8, marginBottom: 7 }}>
                AI RISK REVIEW
              </Text>
              <Text style={{ color: C.text, fontSize: 14, lineHeight: 21 }}>
                {advice}
              </Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          padding: 16,
          paddingBottom: 20,
          borderTopColor: C.border,
          borderTopWidth: 1,
          backgroundColor: C.bg,
        }}
      >
        <Button label="Deny" tone={C.surface2} textTone={C.bad} disabled={busy} onPress={() => act(false)} />
        <Button
          label="Approve"
          tone={C.good}
          textTone={C.bg}
          disabled={busy}
          onPress={() => act(true)}
        />
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: highlight ? "#1C1810" : C.surface,
        borderColor: highlight ? C.warn : C.border,
        borderWidth: 1,
        borderRadius: 15,
        padding: 14,
      }}
    >
      <Text
        style={{
          color: C.muted,
          fontSize: 10,
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text style={{ color: highlight ? C.warn : C.text, fontSize: 14, lineHeight: 21 }}>
        {value}
      </Text>
    </View>
  );
}

function Button({
  label,
  tone,
  textTone,
  onPress,
  disabled,
}: {
  label: string;
  tone: string;
  textTone: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: 1,
        backgroundColor: tone,
        opacity: disabled ? 0.5 : 1,
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: "center",
      }}
    >
      <Text style={{ color: textTone, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
}
