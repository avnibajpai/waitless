import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VenueCard } from "../components/VenueCard";
import { useApp } from "../context/AppContext";
import { colors } from "../theme/colors";
import type { Venue } from "../types";

type Props = {
  onVenuePress: (venue: Venue) => void;
};

export function DiscoverScreen({ onVenuePress }: Props) {
  const { venues } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Discover</Text>
          <Text style={styles.title}>Venues near you</Text>
        </View>
        <View style={styles.aiButton}>
          <Ionicons name="sparkles" size={18} color={colors.mint} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            onPress={() => onVenuePress(venue)}
          />
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16
  },
  headerCopy: {
    flex: 1
  },
  eyebrow: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
    marginBottom: 4
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5
  },
  aiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24
  }
});
