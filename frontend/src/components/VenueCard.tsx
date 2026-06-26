import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import type { Venue } from "../types";
import { colors } from "../theme/colors";

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
            <View style={styles.row}>
              <Ionicons name="location-outline" size={14} color="#FFFFFF" />
              <Text style={styles.meta}>{venue.address}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="list-outline" size={14} color="#FFFFFF" />
              <Text style={styles.meta}>
                {venue.queueCount} queue{venue.queueCount !== 1 ? "s" : ""}
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
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
    height: 220
  },
  image: {
    flex: 1,
    justifyContent: "flex-end"
  },
  imageRadius: {
    borderRadius: 18
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16
  },
  badge: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  badgeText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "700"
  },
  content: {
    gap: 6
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  meta: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    fontWeight: "500",
    flex: 1
  }
});
