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
import { C } from "@/lib/theme";

export default function ApprovalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Approval | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchApprovals().then((all) => {
      setItem(all.find((a) => a.id === id) ?? null);
    });
  }, [id]);

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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Field label="from agent" value={item.source} />
        <Field label="request" value={item.title} />
        <Field label="message" value={item.detail} />
        <Field label="proposed action" value={item.proposedAction} highlight />
        {item.reason ? <Field label="why escalated" value={item.reason} /> : null}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          padding: 16,
          borderTopColor: C.border,
          borderTopWidth: 1,
        }}
      >
        <Button label="Deny" tone={C.bad} disabled={busy} onPress={() => act(false)} />
        <Button
          label="Approve"
          tone={C.good}
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
        backgroundColor: C.surface,
        borderColor: highlight ? C.warn : C.border,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
      }}
    >
      <Text
        style={{
          color: C.muted,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text style={{ color: highlight ? C.warn : C.text, fontSize: 14 }}>
        {value}
      </Text>
    </View>
  );
}

function Button({
  label,
  tone,
  onPress,
  disabled,
}: {
  label: string;
  tone: string;
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
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#0a0a0b", fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}
