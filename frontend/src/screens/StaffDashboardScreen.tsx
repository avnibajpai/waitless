import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MetricCard } from "../components/MetricCard";
import { queueInsights, staffQueue } from "../data/venues";
import { useApp } from "../context/AppContext";
import { colors, cardShadow } from "../theme/colors";

const statusColors: Record<string, string> = {
  serving: colors.mint,
  in_queue: colors.blue,
  out_of_bounds_warning: colors.amber,
  paused: colors.gold
};

export function StaffDashboardScreen() {
  const { pauseActiveQueue, signOut } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>Staff Console</Text>
            <Text style={styles.title}>Queue dashboard</Text>
          </View>
          <Pressable onPress={signOut} style={styles.signOutBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.muted} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View>
            <Text style={styles.heroNumber}>51</Text>
            <Text style={styles.heroLabel}>people in virtual queue</Text>
          </View>
          <View style={styles.heroActions}>
            <Pressable style={styles.actionBtn}>
              <Ionicons name="flash-outline" size={16} color="#FFFFFF" />
              <Text style={styles.actionText}>VIP boost</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionBtnLight]}
              onPress={() => pauseActiveQueue(15)}
            >
              <Ionicons name="pause-outline" size={16} color={colors.mint} />
              <Text style={[styles.actionText, styles.actionTextLight]}>
                Pause queue
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.metricsRow}>
          {queueInsights.map((item) => (
            <MetricCard
              key={item.label}
              label={item.label}
              value={item.value}
              tone={item.color}
              icon={
                <Ionicons
                  name={
                    item.color === "mint"
                      ? "time-outline"
                      : item.color === "blue"
                        ? "analytics-outline"
                        : item.color === "gold"
                          ? "locate-outline"
                          : "warning-outline"
                  }
                  size={18}
                  color={
                    item.color === "mint"
                      ? colors.mint
                      : item.color === "blue"
                        ? colors.blue
                        : item.color === "gold"
                          ? colors.gold
                          : colors.coral
                  }
                />
              }
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Live token board</Text>
        <View style={styles.board}>
          {staffQueue.map((person, index) => (
            <View
              key={person.token}
              style={[styles.boardRow, index < staffQueue.length - 1 && styles.boardBorder]}
            >
              <View style={styles.tokenBadge}>
                <Text style={styles.tokenBadgeText}>{person.token}</Text>
              </View>
              <View style={styles.personCopy}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text
                  style={[
                    styles.personStatus,
                    { color: statusColors[person.tokenStatus] ?? colors.muted }
                  ]}
                >
                  {person.status}
                </Text>
              </View>
              <Text style={styles.personEta}>{person.eta}</Text>
            </View>
          ))}
        </View>

        <View style={styles.overridePanel}>
          <Text style={styles.overrideTitle}>Quick overrides</Text>
          <View style={styles.overrideGrid}>
            <OverrideChip icon="time-outline" label="Inject delay" />
            <OverrideChip icon="swap-horizontal-outline" label="Reassign" />
            <OverrideChip icon="megaphone-outline" label="Broadcast SMS" />
            <OverrideChip icon="sparkles-outline" label="AI forecast" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OverrideChip({
  icon,
  label
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <Pressable style={styles.chip}>
      <Ionicons name={icon} size={18} color={colors.mint} />
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20
  },
  signOutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center"
  },
  eyebrow: {
    fontSize: 13,
    color: colors.muted
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink
  },
  hero: {
    backgroundColor: colors.slate,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  heroNumber: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900"
  },
  heroLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 4
  },
  heroActions: {
    gap: 8,
    width: 130
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.coral,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  actionBtnLight: {
    backgroundColor: colors.mintSoft
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800"
  },
  actionTextLight: {
    color: colors.mint
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 12
  },
  board: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    ...cardShadow,
    marginBottom: 20
  },
  boardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12
  },
  boardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  tokenBadge: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  tokenBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800"
  },
  personCopy: {
    flex: 1
  },
  personName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink
  },
  personStatus: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600"
  },
  personEta: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.blue
  },
  overridePanel: {
    backgroundColor: colors.mintSoft,
    borderRadius: 14,
    padding: 16
  },
  overrideTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.mint,
    marginBottom: 12
  },
  overrideGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.panel,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink
  }
});
