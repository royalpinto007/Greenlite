import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { fetchApprovals, type Approval } from "@/lib/api";
import { C } from "@/lib/theme";

export default function ApprovalsScreen() {
  const [items, setItems] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchApprovals();
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={C.accent} />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
          tintColor={C.accent}
        />
      }
      ListHeaderComponent={
        <Text style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>
          {items.length} action{items.length === 1 ? "" : "s"} waiting for your
          approval.
        </Text>
      }
      ListEmptyComponent={
        <Text style={{ color: C.muted, textAlign: "center", marginTop: 48 }}>
          Nothing waiting. Your agents are handling things.
        </Text>
      }
      renderItem={({ item }) => (
        <Link href={{ pathname: "/approval/[id]", params: { id: item.id } }} asChild>
          <Pressable
            style={{
              backgroundColor: C.surface,
              borderColor: C.border,
              borderWidth: 1,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text style={{ color: C.text, fontWeight: "600" }}>
                {item.title}
              </Text>
              <Text style={{ color: C.muted, fontSize: 11 }}>{item.source}</Text>
            </View>
            <Text style={{ color: C.warn, fontSize: 13 }} numberOfLines={1}>
              {item.proposedAction}
            </Text>
            {item.reason ? (
              <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                {item.reason}
              </Text>
            ) : null}
          </Pressable>
        </Link>
      )}
    />
  );
}
