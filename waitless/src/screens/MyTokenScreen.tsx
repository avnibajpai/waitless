import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MetricCard } from "../components/MetricCard";
import { useApp } from "../context/AppContext";
import { colors, cardShadow } from "../theme/colors";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function statusLabel(status: string) {
  switch (status) {
    case "in_queue":
      return "In queue";
    case "out_of_bounds_warning":
      return "Outside geofence";
    case "serving":
      return "Your turn!";
    case "paused":
      return "Queue paused";
    case "auto_purged":
      return "Token released";
    default:
      return status;
  }
}

export function MyTokenScreen() {
  const {
    activeToken,
    isLoading,
    simulateQueueAdvance,
    simulateMoveOutside,
    releaseToken,
    refreshToken
  } = useApp();

  const warningActive = activeToken?.status === "out_of_bounds_warning";
  const purged = activeToken?.status === "auto_purged";

  const statusColor = useMemo(() => {
    if (!activeToken) {
      return colors.muted;
    }
    if (warningActive) {
      return colors.amber;
    }
    if (activeToken.status === "serving") {
      return colors.mint;
    }
    if (purged) {
      return colors.coral;
    }
    return colors.blue;
  }, [activeToken, warningActive, purged]);

  if (!activeToken) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Ionicons name="ticket-outline" size={34} color={colors.mint} />
          </View>
          <Text style={styles.emptyTitle}>No active token</Text>
          <Text style={styles.emptyText}>
            Browse venues and join a queue to get your virtual place in line.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>My Token</Text>
        <Text style={styles.title}>{activeToken.venueName}</Text>
        <Text style={styles.subtitle}>{activeToken.queueName}</Text>

        <View style={[styles.hero, { borderColor: statusColor }]}>
          <Text style={styles.tokenLabel}>Token</Text>
          <Text style={styles.tokenNumber}>#{activeToken.tokenNumber}</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {statusLabel(activeToken.status)}
          </Text>
        </View>

        {warningActive ? (
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={22} color={colors.amber} />
            <View style={styles.warningCopy}>
              <Text style={styles.warningTitle}>
                You've left the queue area
              </Text>
              <Text style={styles.warningText}>
                Return within{" "}
                {activeToken.graceRemainingSeconds ?? 180} seconds to keep
                your spot.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.metricsRow}>
          <MetricCard
            label="Position"
            value={`#${activeToken.position}`}
            tone="mint"
            icon={
              <Ionicons name="people-outline" size={18} color={colors.mint} />
            }
          />
          <MetricCard
            label="Estimated wait"
            value={`${activeToken.estimatedWaitMinutes}m`}
            tone="blue"
            icon={
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={colors.blue}
              />
            }
          />
        </View>

        <View style={styles.panel}>
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>Expected turn</Text>
            <Text style={styles.panelValue}>
              {formatTime(activeToken.estimatedServiceTime)}{" "}
              {activeToken.aiConfidenceWindow}
            </Text>
          </View>
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>Geofence</Text>
            <Text style={styles.panelValue}>
              {activeToken.distanceMeters} m ·{" "}
              {activeToken.geofenceStatus.replace("_", " ")}
            </Text>
          </View>
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>Ahead of you</Text>
            <Text style={styles.panelValue}>{activeToken.aheadCount}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => void refreshToken()}
          >
            <Ionicons name="refresh-outline" size={18} color={colors.mint} />
            <Text style={styles.secondaryText}>Refresh status</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => void simulateQueueAdvance()}
          >
            <Ionicons name="play-forward-outline" size={18} color={colors.mint} />
            <Text style={styles.secondaryText}>Simulate advance</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => void simulateMoveOutside()}
          >
            <Ionicons name="walk-outline" size={18} color={colors.amber} />
            <Text style={styles.secondaryText}>Simulate leave area</Text>
          </Pressable>

          <Pressable
            style={styles.dangerButton}
            onPress={() => void releaseToken()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.dangerText}>Release token</Text>
              </>
            )}
          </Pressable>
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
    marginTop: 4,
    marginBottom: 20
  },
  hero: {
    backgroundColor: colors.panel,
    borderRadius: 20,
    borderWidth: 2,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    ...cardShadow
  },
  tokenLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "600"
  },
  tokenNumber: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: "900",
    color: colors.ink,
    marginTop: 4
  },
  status: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800"
  },
  warningBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.amberSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  warningCopy: {
    flex: 1
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink
  },
  warningText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16
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
  panelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  panelLabel: {
    color: colors.muted,
    fontSize: 14
  },
  panelValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    flex: 1
  },
  actions: {
    gap: 10
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  secondaryText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700"
  },
  dangerButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.coral,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4
  },
  dangerText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800"
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink
  },
  emptyText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center"
  }
});
