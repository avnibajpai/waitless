import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MetricCard } from "../components/MetricCard";
import { useApp } from "../context/AppContext";
import { mockApi } from "../services/mockApi";
import type { StaffMetrics, StaffToken } from "../types";
import { colors, cardShadow } from "../theme/colors";

function statusColor(status: StaffToken["status"]) {
  switch (status) {
    case "serving":
      return colors.mint;
    case "out_of_bounds_warning":
      return colors.amber;
    case "paused":
      return colors.blue;
    default:
      return colors.muted;
  }
}

function statusText(status: StaffToken["status"]) {
  return status.replace(/_/g, " ");
}

export function StaffDashboardScreen() {
  const { signOut } = useApp();
  const [tokens, setTokens] = useState<StaffToken[]>([]);
  const [metrics, setMetrics] = useState<StaffMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const [nextTokens, nextMetrics] = await Promise.all([
      mockApi.getStaffTokens(),
      mockApi.getStaffMetrics()
    ]);
    setTokens(nextTokens);
    setMetrics(nextMetrics);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handlePause = async () => {
    setActionLoading(true);
    await mockApi.pauseQueue("Staff shortage - shift change", 15);
    await loadDashboard();
    setActionLoading(false);
    Alert.alert("Queue paused", "SMS broadcast sent to affected users.");
  };

  const handleDelay = async () => {
    setActionLoading(true);
    await mockApi.injectDelay(10, "Operational delay");
    await loadDashboard();
    setActionLoading(false);
    Alert.alert("Delay injected", "10 minutes added to all ETAs.");
  };

  const handleResume = async () => {
    setActionLoading(true);
    await mockApi.resumeQueue();
    await loadDashboard();
    setActionLoading(false);
  };

  if (loading || !metrics) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.mint} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Staff dashboard</Text>
            <Text style={styles.title}>Queue console</Text>
          </View>
          <Pressable style={styles.signOut} onPress={signOut}>
            <Ionicons name="log-out-outline" size={20} color={colors.mint} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroNumber}>{metrics.totalInQueue}</Text>
          <Text style={styles.heroLabel}>tokens in queue</Text>
        </View>

        <View style={styles.metricsRow}>
          <MetricCard
            label="Avg wait"
            value={`${metrics.averageWaitMinutes}m`}
            tone="mint"
            icon={<Ionicons name="time-outline" size={18} color={colors.mint} />}
          />
          <MetricCard
            label="Tokens/hr"
            value={`${metrics.tokensPerHour}`}
            tone="blue"
            icon={
              <Ionicons name="analytics-outline" size={18} color={colors.blue} />
            }
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => void handlePause()}
            disabled={actionLoading}
          >
            <Ionicons name="pause-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Pause queue</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.actionSecondary]}
            onPress={() => void handleDelay()}
            disabled={actionLoading}
          >
            <Ionicons name="timer-outline" size={18} color={colors.mint} />
            <Text style={[styles.actionText, styles.actionTextSecondary]}>
              Inject delay
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.actionSecondary]}
            onPress={() => void handleResume()}
            disabled={actionLoading}
          >
            <Ionicons name="play-circle-outline" size={18} color={colors.mint} />
            <Text style={[styles.actionText, styles.actionTextSecondary]}>
              Resume queue
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Live token board</Text>
        <View style={styles.panel}>
          {tokens.map((token) => (
            <View key={token.id} style={styles.tokenRow}>
              <View style={styles.tokenBadge}>
                <Text style={styles.tokenBadgeText}>#{token.tokenNumber}</Text>
              </View>
              <View style={styles.tokenCopy}>
                <Text style={styles.tokenName}>{token.displayName}</Text>
                <Text style={[styles.tokenStatus, { color: statusColor(token.status) }]}>
                  {statusText(token.status)}
                </Text>
              </View>
              <Text style={styles.tokenEta}>{token.estimatedWaitMinutes}m</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.metricFootnote}>
            Geofence violation rate: {metrics.geofenceViolationRate}%
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  loader: {
    marginTop: 80
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16
  },
  eyebrow: {
    fontSize: 14,
    color: colors.muted
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.ink
  },
  signOut: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  hero: {
    backgroundColor: colors.mint,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16
  },
  heroNumber: {
    color: "#FFFFFF",
    fontSize: 52,
    lineHeight: 58,
    fontWeight: "900"
  },
  heroLabel: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    marginTop: 4
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16
  },
  actions: {
    gap: 10,
    marginBottom: 20
  },
  actionButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.mint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  actionSecondary: {
    backgroundColor: colors.mintSoft
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800"
  },
  actionTextSecondary: {
    color: colors.mint
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 12
  },
  panel: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
    ...cardShadow
  },
  tokenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  tokenBadge: {
    width: 54,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center"
  },
  tokenBadgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13
  },
  tokenCopy: {
    flex: 1
  },
  tokenName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink
  },
  tokenStatus: {
    fontSize: 12,
    marginTop: 2,
    textTransform: "capitalize"
  },
  tokenEta: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.blue
  },
  metricFootnote: {
    padding: 10,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center"
  }
});
