import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { colors, cardShadow } from "../theme/colors";

export function ProfileScreen() {
  const { user, signOut, activeToken } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Profile</Text>
        <Text style={styles.title}>{user?.displayName}</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>

        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={40} color={colors.mint} />
        </View>

        <View style={styles.panel}>
          <InfoRow label="Phone" value={user?.phoneNumber ?? "—"} />
          <InfoRow
            label="Role"
            value={user?.role === "staff" ? "Staff" : "Consumer"}
          />
          <InfoRow
            label="Active token"
            value={activeToken ? `#${activeToken.tokenNumber}` : "None"}
          />
          <InfoRow label="Notifications" value="SMS + Push enabled" />
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingRow icon="notifications-outline" label="SMS alerts" />
          <SettingRow icon="location-outline" label="Geofence monitoring" />
          <SettingRow icon="sparkles-outline" label="AI ETA updates" />
        </View>

        <Pressable style={styles.signOutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SettingRow({
  icon,
  label
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={18} color={colors.mint} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  eyebrow: {
    marginTop: 8,
    fontSize: 14,
    color: colors.muted
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 4
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 4
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24
  },
  panel: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
    ...cardShadow
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 14
  },
  infoValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 8
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  settingLabel: {
    fontSize: 15,
    color: colors.ink,
    fontWeight: "600"
  },
  signOutButton: {
    marginTop: 8,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.mint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  }
});
