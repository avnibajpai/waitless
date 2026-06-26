import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VenueCard } from "../components/VenueCard";
import { useApp } from "../context/AppContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { colors } from "../theme/colors";

export function DiscoverScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { venues, refreshVenues, isLoading } = useApp();

  const onRefresh = useCallback(async () => {
    await refreshVenues();
  }, [refreshVenues]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Discover</Text>
          <Text style={styles.title}>Venues near you</Text>
        </View>
        <Pressable style={styles.sparkleButton}>
          <Ionicons name="sparkles" size={20} color={colors.mint} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {venues.length === 0 && isLoading ? (
          <ActivityIndicator color={colors.mint} style={styles.loader} />
        ) : (
          venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onPress={() =>
                navigation.navigate("VenueDetail", { venueId: venue.id })
              }
            />
          ))
        )}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  headerCopy: {
    flex: 1
  },
  eyebrow: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5
  },
  sparkleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  loader: {
    marginTop: 40
  }
});
