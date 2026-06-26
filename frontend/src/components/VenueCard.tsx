import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Venue } from "../types";
import { colors, cardShadow } from "../theme/colors";

type Props = {
  venue: Venue;
  onPress: () => void;
};

export function VenueCard({ venue, onPress }: Props) {
  const queueLabel =
    venue.totalInQueue === 0
      ? "0 in queue"
      : `${venue.totalInQueue} in queue`;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <ImageBackground
        source={{ uri: venue.imageUrl }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.75)"]}
          style={styles.gradient}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{queueLabel}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.name}>{venue.name}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color="#FFFFFF" />
              <Text style={styles.metaText}>
                {venue.address}, {venue.city}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="list-outline" size={14} color="#FFFFFF" />
              <Text style={styles.metaText}>
                {venue.queueCount}{" "}
                {venue.queueCount === 1 ? "queue" : "queues"}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    ...cardShadow
  },
  image: {
    height: 220,
    justifyContent: "space-between"
  },
  imageRadius: {
    borderRadius: 20
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16
  },
  badge: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  badgeText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700"
  },
  content: {
    gap: 6
  },
  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  metaText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 18
  }
});
