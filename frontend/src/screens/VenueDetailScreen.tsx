import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getQueuesForVenue } from "../services/mockApi";
import { colors, cardShadow } from "../theme/colors";
import type { Venue } from "../types";

type Props = {
  venue: Venue;
  onJoinQueue: (queueId: string) => void;
  onBack: () => void;
};

export function VenueDetailScreen({ venue, onJoinQueue, onBack }: Props) {
  const queues = getQueuesForVenue(venue.id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {venue.name}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={colors.muted} />
          <Text style={styles.address}>{venue.address}</Text>
        </View>

        <Text style={styles.sectionTitle}>Choose a queue</Text>
        <Text style={styles.sectionSub}>
          Up to {venue.queueCount} active queues · {venue.geofenceRadiusMeters}m
          geofence radius
        </Text>

        {queues.map((queue) => (
          <Pressable
            key={queue.id}
            style={styles.queueCard}
            onPress={() => onJoinQueue(queue.id)}
          >
            <View style={styles.queueTop}>
              <Text style={styles.queueName}>{queue.name}</Text>
              {queue.queueType === "vip" ? (
                <View style={styles.vipBadge}>
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.queueDesc}>{queue.description}</Text>
            <View style={styles.queueMeta}>
              <Ionicons name="time-outline" size={14} color={colors.muted} />
              <Text style={styles.queueMetaText}>
                ~{queue.estimatedServiceTimeMinutes} min per person
              </Text>
            </View>
            <View style={styles.joinRow}>
              <Text style={styles.joinText}>Join queue</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.mint} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center"
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24
  },
  address: {
    flex: 1,
    color: colors.muted,
    fontSize: 14
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink
  },
  sectionSub: {
    marginTop: 4,
    marginBottom: 20,
    color: colors.muted,
    fontSize: 14
  },
  queueCard: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    ...cardShadow
  },
  queueTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  queueName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink
  },
  vipBadge: {
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  vipText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "800"
  },
  queueDesc: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  queueMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10
  },
  queueMetaText: {
    color: colors.muted,
    fontSize: 13
  },
  joinRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12
  },
  joinText: {
    color: colors.mint,
    fontSize: 14,
    fontWeight: "700"
  }
});
