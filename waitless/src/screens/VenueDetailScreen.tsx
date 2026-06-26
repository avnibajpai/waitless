import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getVenueById } from "../data/venues";
import { useApp } from "../context/AppContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { colors, cardShadow } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "VenueDetail">;

export function VenueDetailScreen({ route, navigation }: Props) {
  const { venueId } = route.params;
  const { joinQueue, isLoading, activeToken } = useApp();
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);

  const venue = useMemo(() => getVenueById(venueId), [venueId]);

  if (!venue) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Venue not found.</Text>
      </SafeAreaView>
    );
  }

  const handleJoin = async () => {
    if (!selectedQueueId) {
      Alert.alert("Select a queue", "Choose a queue before joining.");
      return;
    }

    if (activeToken) {
      Alert.alert(
        "Active token exists",
        "Release your current token before joining another queue."
      );
      return;
    }

    try {
      await joinQueue(
        selectedQueueId,
        venue.latitude,
        venue.longitude
      );
      navigation.navigate("Main", { screen: "MyToken" });
    } catch {
      Alert.alert("Unable to join", "Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: venue.imageUrl }} style={styles.hero}>
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.8)"]}
            style={styles.heroGradient}
          >
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>

            <View>
              <Text style={styles.heroTitle}>{venue.name}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color="#FFFFFF" />
                <Text style={styles.metaText}>
                  {venue.address}, {venue.city}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Active queues</Text>
          <Text style={styles.sectionHint}>
            Choose a queue to receive your virtual token. Geofence radius:{" "}
            {venue.geofenceRadiusMeters} m.
          </Text>

          {venue.queues.map((queue) => {
            const selected = selectedQueueId === queue.id;
            return (
              <Pressable
                key={queue.id}
                onPress={() => setSelectedQueueId(queue.id)}
                style={[styles.queueCard, selected && styles.queueCardSelected]}
              >
                <View style={styles.queueHeader}>
                  <Text style={styles.queueName}>{queue.name}</Text>
                  {queue.queueType === "vip" ? (
                    <View style={styles.vipBadge}>
                      <Text style={styles.vipText}>VIP</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.queueDescription}>{queue.description}</Text>
                <Text style={styles.queueMeta}>
                  ~{queue.estimatedServiceTimeMinutes} min per person ·{" "}
                  {queue.totalInQueue} waiting
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            style={[styles.joinButton, isLoading && styles.joinDisabled]}
            onPress={() => void handleJoin()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="ticket-outline" size={20} color="#FFFFFF" />
                <Text style={styles.joinText}>Join queue</Text>
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
  hero: {
    height: 280
  },
  heroGradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8
  },
  metaText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14
  },
  body: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink
  },
  sectionHint: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted
  },
  queueCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
    ...cardShadow
  },
  queueCardSelected: {
    borderColor: colors.mint,
    backgroundColor: colors.mintSoft
  },
  queueHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  queueName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
    flex: 1
  },
  vipBadge: {
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  vipText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800"
  },
  queueDescription: {
    marginTop: 6,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20
  },
  queueMeta: {
    marginTop: 8,
    fontSize: 13,
    color: colors.mintDark,
    fontWeight: "700"
  },
  joinButton: {
    marginTop: 8,
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: colors.mint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  joinDisabled: {
    opacity: 0.7
  },
  joinText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800"
  },
  error: {
    padding: 20,
    color: colors.coral
  }
});
