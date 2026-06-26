import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MetricCard } from "../components/MetricCard";
import { useApp } from "../context/AppContext";
import { formatEta } from "../services/mockApi";
import { colors, cardShadow } from "../theme/colors";

export function MyTokenScreen() {
  const {
    activeToken,
    distanceMeters,
    moveOutsideRadius,
    moveInsideRadius,
    releaseActiveToken
  } = useApp();

  if (!activeToken) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Ionicons name="ticket-outline" size={36} color={colors.muted} />
          </View>
          <Text style={styles.emptyTitle}>No active token</Text>
          <Text style={styles.emptyText}>
            Browse venues and join a queue to get your virtual token.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isWarning = activeToken.status === "out_of_bounds_warning";
  const isPurged = activeToken.status === "auto_purged";
  const isPaused = activeToken.status === "paused";
  const radius = 200;
  const buffer = Math.max(radius - distanceMeters, 0);

  const statusLabel = isPurged
    ? "Token released"
    : isPaused
      ? "Queue paused"
      : isWarning
        ? "Outside geofence"
        : activeToken.status === "serving"
          ? "Your turn!"
          : "In queue";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.eyebrow}>My Token</Text>
        <Text style={styles.title}>{activeToken.venueName}</Text>
        <Text style={styles.subtitle}>{activeToken.queueName}</Text>

        <View style={styles.tokenHero}>
          <View>
            <Text style={styles.tokenLabel}>Token</Text>
            <Text style={styles.tokenNumber}>#{activeToken.tokenNumber}</Text>
            <Text style={styles.tokenStatus}>{statusLabel}</Text>
          </View>
          <View style={styles.etaBlock}>
            <Text style={styles.etaLabel}>Expected turn</Text>
            <Text style={styles.etaValue}>
              {formatEta(activeToken.estimatedServiceTime)}
            </Text>
            <Text style={styles.etaWindow}>
              {activeToken.aiConfidenceWindow}
            </Text>
          </View>
        </View>

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
            label="AI wait"
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

        {isWarning ? (
          <View style={styles.alertBox}>
            <Ionicons name="warning-outline" size={22} color={colors.amber} />
            <View style={styles.alertCopy}>
              <Text style={styles.alertTitle}>
                You've left the queue area
              </Text>
              <Text style={styles.alertText}>
                Return within{" "}
                {activeToken.graceRemainingSeconds ?? 180} seconds to keep your
                spot.
              </Text>
            </View>
          </View>
        ) : null}

        {isPurged ? (
          <View style={[styles.alertBox, styles.alertDanger]}>
            <Ionicons
              name="close-circle-outline"
              size={22}
              color={colors.danger}
            />
            <View style={styles.alertCopy}>
              <Text style={styles.alertTitle}>Token auto-purged</Text>
              <Text style={styles.alertText}>
                Your token was released due to absence outside the geofence.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Geofence status</Text>
          <Text style={styles.geoState}>
            {distanceMeters > radius
              ? "Outside radius"
              : buffer < 80
                ? "Near boundary"
                : "Within radius"}
          </Text>
          <Text style={styles.geoMeta}>
            {distanceMeters} m from venue · {buffer} m buffer
          </Text>

          <View style={styles.radiusTrack}>
            <View
              style={[
                styles.radiusFill,
                {
                  width: `${Math.min((distanceMeters / radius) * 100, 100)}%`,
                  backgroundColor:
                    distanceMeters > radius ? colors.amber : colors.mint
                }
              ]}
            />
          </View>

          {!isPurged ? (
            <View style={styles.geoActions}>
              <Pressable style={styles.geoButton} onPress={moveOutsideRadius}>
                <Text style={styles.geoButtonText}>Simulate leave</Text>
              </Pressable>
              <Pressable
                style={[styles.geoButton, styles.geoButtonAlt]}
                onPress={moveInsideRadius}
              >
                <Text style={[styles.geoButtonText, styles.geoButtonTextAlt]}>
                  Return
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Notification plan</Text>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, styles.dotDone]} />
            <View>
              <Text style={styles.timelineLabel}>Token issued</Text>
              <Text style={styles.timelineTime}>Just now</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.dot,
                activeToken.position <= 5 ? styles.dotActive : styles.dotNext
              ]}
            />
            <View>
              <Text style={styles.timelineLabel}>Return alert</Text>
              <Text style={styles.timelineTime}>When position ≤ 5</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, styles.dotNext]} />
            <View>
              <Text style={styles.timelineLabel}>Ready to serve</Text>
              <Text style={styles.timelineTime}>
                {formatEta(activeToken.estimatedServiceTime)}
              </Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.releaseButton} onPress={releaseActiveToken}>
          <Text style={styles.releaseText}>Release token</Text>
        </Pressable>
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
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 20
  },
  tokenHero: {
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  tokenLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600"
  },
  tokenNumber: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 46
  },
  tokenStatus: {
    color: colors.mintLight,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4
  },
  etaBlock: {
    alignItems: "flex-end",
    justifyContent: "center"
  },
  etaLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12
  },
  etaValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4
  },
  etaWindow: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16
  },
  alertBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.amberSoft,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  alertDanger: {
    backgroundColor: "#FEE2E2"
  },
  alertCopy: {
    flex: 1
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink
  },
  alertText: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
    lineHeight: 18
  },
  panel: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
    ...cardShadow
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 12
  },
  geoState: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink
  },
  geoMeta: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
    marginBottom: 12
  },
  radiusTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.line,
    overflow: "hidden"
  },
  radiusFill: {
    height: "100%",
    borderRadius: 5
  },
  geoActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  geoButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.amberSoft,
    alignItems: "center"
  },
  geoButtonAlt: {
    backgroundColor: colors.mintSoft
  },
  geoButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.amber
  },
  geoButtonTextAlt: {
    color: colors.mint
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.line
  },
  dotDone: {
    backgroundColor: colors.mint,
    borderColor: colors.mint
  },
  dotActive: {
    backgroundColor: colors.amber,
    borderColor: colors.amber
  },
  dotNext: {
    backgroundColor: colors.panel
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink
  },
  timelineTime: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2
  },
  releaseButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 14,
    alignItems: "center"
  },
  releaseText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "700"
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink
  },
  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22
  }
});
