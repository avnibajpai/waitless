import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { colors, cardShadow } from "../theme/colors";

export function ProfileScreen() {
  const { user, signOut, activeToken } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Profile</Text>
        <Text style={styles.title}>{user?.displayName ?? "Guest"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.card}>
          <Row
            icon="call-outline"
            label="Phone"
            value={user?.phoneNumber ?? "—"}
          />
          <Row
            icon="shield-checkmark-outline"
            label="Role"
            value={user?.role === "staff" ? "Staff" : "Consumer"}
          />
          <Row
            icon="notifications-outline"
            label="Notifications"
            value="SMS & Push enabled"
          />
          <Row
            icon="locate-outline"
            label="Geofence radius"
            value="200 m default"
            last
          />
        </View>

        {activeToken ? (
          <View style={styles.activeCard}>
            <Text style={styles.activeTitle}>Active token</Text>
            <Text style={styles.activeValue}>
              #{activeToken.tokenNumber} · {activeToken.venueName}
            </Text>
          </View>
        ) : null}

        <Pressable style={styles.signOut} onPress={signOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
  last
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Ionicons name={icon} size={20} color={colors.mint} />
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper
  },
  content: {
    padding: 20,
    paddingBottom: 32
  },
  eyebrow: {
    fontSize: 13,
    color: colors.muted
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 4
  },
  email: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 24
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    ...cardShadow
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  rowCopy: {
    flex: 1
  },
  rowLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600"
  },
  rowValue: {
    fontSize: 15,
    color: colors.ink,
    fontWeight: "700",
    marginTop: 2
  },
  activeCard: {
    marginTop: 16,
    backgroundColor: colors.mintSoft,
    borderRadius: 14,
    padding: 16
  },
  activeTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.mint
  },
  activeValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.mint,
    marginTop: 4
  },
  signOut: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line
  },
  signOutText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "700"
  }
});
