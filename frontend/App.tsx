import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { MetricCard } from "./src/components/MetricCard";
import { SectionHeader } from "./src/components/SectionHeader";
import {
  nearbyQueues,
  queueInsights,
  returnTimeline,
  staffQueue,
  type QueueStop
} from "./src/data/queue";
import { colors, shadow } from "./src/theme/colors";

type Tab = "pass" | "staff" | "insights";

const iconColor = {
  mint: colors.mint,
  blue: colors.blue,
  gold: colors.gold,
  coral: colors.coral
};

export default function App() {
  const [tab, setTab] = useState<Tab>("pass");
  const [activeQueue, setActiveQueue] = useState<QueueStop>(nearbyQueues[0]);
  const [checkedIn, setCheckedIn] = useState(true);
  const [distance, setDistance] = useState(310);

  const remainingRadius = Math.max(activeQueue.radius - distance, 0);
  const returnIn = Math.max(activeQueue.wait - 9, 4);
  const queueHealth = useMemo(() => {
    if (distance > activeQueue.radius) return "Outside radius";
    if (remainingRadius < 80) return "Near boundary";
    return "Within radius";
  }, [activeQueue.radius, distance, remainingRadius]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <Header />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {tab === "pass" ? (
            <UserPass
              activeQueue={activeQueue}
              setActiveQueue={setActiveQueue}
              checkedIn={checkedIn}
              setCheckedIn={setCheckedIn}
              distance={distance}
              setDistance={setDistance}
              remainingRadius={remainingRadius}
              returnIn={returnIn}
              queueHealth={queueHealth}
            />
          ) : null}

          {tab === "staff" ? <StaffConsole /> : null}
          {tab === "insights" ? <Insights /> : null}
        </ScrollView>

        <TabBar active={tab} setActive={setTab} />
      </View>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>wAItless</Text>
        <Text style={styles.tagline}>Wait virtually. Arrive when needed.</Text>
      </View>
      <Pressable style={styles.qrButton}>
        <Ionicons name="qr-code-outline" size={22} color={colors.panel} />
      </Pressable>
    </View>
  );
}

type UserPassProps = {
  activeQueue: QueueStop;
  setActiveQueue: (queue: QueueStop) => void;
  checkedIn: boolean;
  setCheckedIn: (value: boolean) => void;
  distance: number;
  setDistance: (value: number) => void;
  remainingRadius: number;
  returnIn: number;
  queueHealth: string;
};

function UserPass({
  activeQueue,
  setActiveQueue,
  checkedIn,
  setCheckedIn,
  distance,
  setDistance,
  remainingRadius,
  returnIn,
  queueHealth
}: UserPassProps) {
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroKicker}>Digital presence token</Text>
          <Text style={styles.heroTitle}>Your place is held securely.</Text>
          <Text style={styles.heroText}>
            AI predicts the counter pace, watches the queue dynamics, and tells
            you when to head back.
          </Text>
        </View>
        <View style={styles.token}>
          <Text style={styles.tokenLabel}>Token</Text>
          <Text style={styles.tokenCode}>A-109</Text>
          <Text style={styles.tokenMeta}>{checkedIn ? "Active" : "Ready"}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <MetricCard
          label="Current position"
          value={`#${activeQueue.position}`}
          tone="mint"
          icon={<Ionicons name="people-outline" size={18} color={colors.mint} />}
        />
        <MetricCard
          label="AI predicted wait"
          value={`${activeQueue.wait}m`}
          tone="blue"
          icon={<Ionicons name="sparkles-outline" size={18} color={colors.blue} />}
        />
      </View>

      <SectionHeader
        eyebrow="Scan to join"
        title="Nearby virtual queues"
        action="Live"
      />
      <View style={styles.queueList}>
        {nearbyQueues.map((queue) => (
          <Pressable
            key={queue.id}
            onPress={() => {
              setActiveQueue(queue);
              setDistance(Math.min(distance, queue.radius - 60));
              setCheckedIn(true);
            }}
            style={[
              styles.queueCard,
              activeQueue.id === queue.id && styles.queueCardActive
            ]}
          >
            <View style={styles.queueIcon}>
              <MaterialCommunityIcons
                name={queue.sector === "Healthcare" ? "hospital-building" : queue.sector === "Banking" ? "bank-outline" : "school-outline"}
                size={22}
                color={colors.mint}
              />
            </View>
            <View style={styles.queueBody}>
              <Text style={styles.queueName}>{queue.name}</Text>
              <Text style={styles.queueMeta}>
                {queue.people} waiting · {queue.serviceRate}
              </Text>
            </View>
            <Text style={styles.queueWait}>{queue.wait}m</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader eyebrow="Return guidance" title="Smart notification plan" />
      <View style={styles.panel}>
        <View style={styles.noticeRow}>
          <View style={styles.noticeIcon}>
            <Ionicons name="notifications-outline" size={20} color={colors.coral} />
          </View>
          <View style={styles.noticeCopy}>
            <Text style={styles.noticeTitle}>Leave now, return in {returnIn} min</Text>
            <Text style={styles.noticeText}>
              You will receive an alert when the queue reaches position #3.
            </Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {returnTimeline.map((item, index) => (
            <View key={item.label} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  item.state === "done" && styles.timelineDone,
                  item.state === "active" && styles.timelineActive
                ]}
              />
              {index < returnTimeline.length - 1 ? (
                <View style={styles.timelineLine} />
              ) : null}
              <View style={styles.timelineText}>
                <Text style={styles.timelineLabel}>{item.label}</Text>
                <Text style={styles.timelineTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <SectionHeader eyebrow="Fairness guard" title="Geo-fenced queue radius" />
      <View style={styles.panel}>
        <View style={styles.geoTop}>
          <View>
            <Text style={styles.geoState}>{queueHealth}</Text>
            <Text style={styles.geoText}>
              {distance} m from facility · {remainingRadius} m buffer
            </Text>
          </View>
          <Pressable
            onPress={() =>
              setDistance(distance > activeQueue.radius ? 280 : distance + 70)
            }
            style={styles.smallButton}
          >
            <Ionicons name="walk-outline" size={18} color={colors.panel} />
            <Text style={styles.smallButtonText}>Move</Text>
          </Pressable>
        </View>
        <View style={styles.radiusTrack}>
          <View
            style={[
              styles.radiusFill,
              {
                width: `${Math.min((distance / activeQueue.radius) * 100, 100)}%`,
                backgroundColor:
                  distance > activeQueue.radius ? colors.coral : colors.mint
              }
            ]}
          />
        </View>
        <Pressable
          onPress={() => setCheckedIn(!checkedIn)}
          style={[styles.primaryButton, !checkedIn && styles.primaryButtonAlt]}
        >
          <Ionicons
            name={checkedIn ? "log-out-outline" : "checkmark-circle-outline"}
            size={20}
            color={colors.panel}
          />
          <Text style={styles.primaryButtonText}>
            {checkedIn ? "Release token" : "Hold my place"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function StaffConsole() {
  return (
    <View>
      <SectionHeader
        eyebrow="Human in the loop"
        title="Facility queue console"
        action="OPD 2"
      />
      <View style={styles.staffHero}>
        <View>
          <Text style={styles.staffNumber}>51</Text>
          <Text style={styles.staffLabel}>people in virtual queue</Text>
        </View>
        <View style={styles.staffActions}>
          <Pressable style={styles.staffButton}>
            <Ionicons name="flash-outline" size={18} color={colors.panel} />
            <Text style={styles.staffButtonText}>Emergency slot</Text>
          </Pressable>
          <Pressable style={[styles.staffButton, styles.staffButtonLight]}>
            <Ionicons name="megaphone-outline" size={18} color={colors.mint} />
            <Text style={[styles.staffButtonText, styles.staffButtonTextLight]}>
              Broadcast delay
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <MetricCard
          label="Predicted service pace"
          value="4.2m"
          tone="gold"
          icon={<Ionicons name="timer-outline" size={18} color={colors.gold} />}
        />
        <MetricCard
          label="Waiting room load"
          value="58%"
          tone="coral"
          icon={<Ionicons name="pulse-outline" size={18} color={colors.coral} />}
        />
      </View>

      <SectionHeader eyebrow="Now serving" title="Live token board" />
      <View style={styles.panel}>
        {staffQueue.map((person) => (
          <View key={person.token} style={styles.staffRow}>
            <View style={styles.staffToken}>
              <Text style={styles.staffTokenText}>{person.token}</Text>
            </View>
            <View style={styles.staffPerson}>
              <Text style={styles.staffName}>{person.name}</Text>
              <Text style={styles.staffStatus}>{person.status}</Text>
            </View>
            <Text style={styles.staffEta}>{person.eta}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Insights() {
  return (
    <View>
      <SectionHeader
        eyebrow="Institution dashboard"
        title="Operational intelligence"
        action="Today"
      />
      <View style={styles.insightGrid}>
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
                color={iconColor[item.color]}
              />
            }
          />
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.chartTitle}>Queue pressure forecast</Text>
        <View style={styles.chart}>
          {[48, 72, 59, 88, 64, 42, 35].map((height, index) => (
            <View key={index} style={styles.barWrap}>
              <View style={[styles.bar, { height }]} />
              <Text style={styles.barLabel}>{`${9 + index}`}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.chartTitle}>AI recommendations</Text>
        <View style={styles.recommendation}>
          <Ionicons name="bulb-outline" size={20} color={colors.gold} />
          <Text style={styles.recommendationText}>
            Open one extra OPD desk between 11:00 and 12:00 to reduce average ETA
            by 14 minutes.
          </Text>
        </View>
        <View style={styles.recommendation}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.mint} />
          <Text style={styles.recommendationText}>
            Tighten the radius to 420 m during peak load; current return
            compliance can support it.
          </Text>
        </View>
      </View>
    </View>
  );
}

function TabBar({
  active,
  setActive
}: {
  active: Tab;
  setActive: (tab: Tab) => void;
}) {
  const tabs = [
    { id: "pass" as const, label: "Pass", icon: "ticket-outline" },
    { id: "staff" as const, label: "Staff", icon: "desktop-outline" },
    { id: "insights" as const, label: "Insights", icon: "bar-chart-outline" }
  ] as const;

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const selected = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setActive(tab.id)}
            style={[styles.tab, selected && styles.tabActive]}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={selected ? colors.panel : colors.muted}
            />
            <Text style={[styles.tabText, selected && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper
  },
  shell: {
    flex: 1,
    backgroundColor: colors.paper
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  brand: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  tagline: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  qrButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 110
  },
  hero: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    padding: 18,
    minHeight: 188,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 14,
    marginBottom: 16
  },
  heroCopy: {
    flex: 1
  },
  heroKicker: {
    color: colors.goldSoft,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.panel,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    marginTop: 8
  },
  heroText: {
    color: "#D6DED9",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10
  },
  token: {
    width: 104,
    borderRadius: 8,
    borderColor: "rgba(255,255,255,0.24)",
    borderWidth: 1,
    padding: 12,
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  tokenLabel: {
    color: "#D6DED9",
    fontSize: 12,
    lineHeight: 16
  },
  tokenCode: {
    color: colors.panel,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900"
  },
  tokenMeta: {
    color: colors.goldSoft,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800"
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24
  },
  queueList: {
    gap: 10,
    marginBottom: 24
  },
  queueCard: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  queueCardActive: {
    borderColor: colors.mint,
    backgroundColor: "#FBFEFC"
  },
  queueIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  queueBody: {
    flex: 1
  },
  queueName: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  queueMeta: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  queueWait: {
    color: colors.blue,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900"
  },
  panel: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderColor: colors.line,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
    ...shadow
  },
  noticeRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start"
  },
  noticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.coralSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  noticeCopy: {
    flex: 1
  },
  noticeTitle: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900"
  },
  noticeText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2
  },
  timeline: {
    marginTop: 18
  },
  timelineItem: {
    minHeight: 46,
    flexDirection: "row"
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    marginTop: 3
  },
  timelineDone: {
    backgroundColor: colors.mint,
    borderColor: colors.mint
  },
  timelineActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold
  },
  timelineLine: {
    position: "absolute",
    left: 6,
    top: 18,
    bottom: 0,
    width: 2,
    backgroundColor: colors.line
  },
  timelineText: {
    marginLeft: 14,
    flex: 1
  },
  timelineLabel: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800"
  },
  timelineTime: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1
  },
  geoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  geoState: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900"
  },
  geoText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  },
  smallButton: {
    minWidth: 82,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12
  },
  smallButtonText: {
    color: colors.panel,
    fontSize: 13,
    fontWeight: "800"
  },
  radiusTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.line,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 14
  },
  radiusFill: {
    height: "100%",
    borderRadius: 6
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.mint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14
  },
  primaryButtonAlt: {
    backgroundColor: colors.ink
  },
  primaryButtonText: {
    color: colors.panel,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900"
  },
  staffHero: {
    backgroundColor: colors.slate,
    borderRadius: 8,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18
  },
  staffNumber: {
    color: colors.panel,
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "900"
  },
  staffLabel: {
    color: "#D6DED9",
    fontSize: 13,
    lineHeight: 18
  },
  staffActions: {
    width: 150,
    gap: 8
  },
  staffButton: {
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: colors.coral,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10
  },
  staffButtonLight: {
    backgroundColor: colors.mintSoft
  },
  staffButtonText: {
    color: colors.panel,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900"
  },
  staffButtonTextLight: {
    color: colors.mint
  },
  staffRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    gap: 12
  },
  staffToken: {
    width: 58,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center"
  },
  staffTokenText: {
    color: colors.panel,
    fontSize: 13,
    fontWeight: "900"
  },
  staffPerson: {
    flex: 1
  },
  staffName: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  staffStatus: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16
  },
  staffEta: {
    color: colors.blue,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  insightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24
  },
  chartTitle: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
    marginBottom: 14
  },
  chart: {
    height: 126,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10
  },
  barWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7
  },
  bar: {
    width: "100%",
    maxWidth: 30,
    borderRadius: 8,
    backgroundColor: colors.blue
  },
  barLabel: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700"
  },
  recommendation: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    paddingVertical: 10
  },
  recommendationText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    minHeight: 64,
    borderRadius: 8,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    padding: 7,
    gap: 7,
    ...shadow
  },
  tab: {
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  tabActive: {
    backgroundColor: colors.ink
  },
  tabText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800"
  },
  tabTextActive: {
    color: colors.panel
  }
});
