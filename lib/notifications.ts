import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Register for push notifications so an agent can buzz the phone the moment it
// needs a decision. Returns the Expo push token (store it server-side to target
// this device), or null if permission was denied / on web.
export async function registerForPush(): Promise<string | null> {
  const settings = await Notifications.getPermissionsAsync();
  let granted = settings.granted;
  if (!granted) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.granted;
  }
  if (!granted) return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("approvals", {
      name: "Approvals",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}
