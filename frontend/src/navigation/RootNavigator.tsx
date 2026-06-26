import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps
} from "@react-navigation/native-stack";
import {
  CompositeNavigationProp,
  NavigationProp,
  NavigatorScreenParams,
  useNavigation
} from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { MyTokenScreen } from "../screens/MyTokenScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { StaffDashboardScreen } from "../screens/StaffDashboardScreen";
import { VenueDetailScreen } from "../screens/VenueDetailScreen";
import { colors } from "../theme/colors";
import type { Venue } from "../types";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  StaffDashboard: undefined;
  VenueDetail: { venue: Venue };
};

export type MainTabParamList = {
  Venues: undefined;
  MyToken: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.line,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 64
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2
        }
      }}
    >
      <Tab.Screen
        name="Venues"
        component={VenuesTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="MyToken"
        component={MyTokenScreen}
        options={{
          title: "My Token",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function VenuesTab() {
  type Nav = CompositeNavigationProp<
    NavigationProp<MainTabParamList, "Venues">,
    NavigationProp<RootStackParamList>
  >;
  const navigation = useNavigation<Nav>();

  return (
    <DiscoverScreen
      onVenuePress={(venue) => navigation.navigate("VenueDetail", { venue })}
    />
  );
}

function VenueDetailRoute({
  navigation,
  route
}: NativeStackScreenProps<RootStackParamList, "VenueDetail">) {
  const { joinQueueAt } = useApp();

  return (
    <VenueDetailScreen
      venue={route.params.venue}
      onBack={() => navigation.goBack()}
      onJoinQueue={(queueId) => {
        joinQueueAt(queueId);
        navigation.navigate("MainTabs", { screen: "MyToken" });
      }}
    />
  );
}

export function RootNavigator() {
  const { user } = useApp();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login">
          {() => <LoginScreen onCreateAccount={() => {}} />}
        </Stack.Screen>
      ) : user.role === "staff" ? (
        <Stack.Screen name="StaffDashboard" component={StaffDashboardScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="VenueDetail" options={{ presentation: "card" }}>
            {(props) => <VenueDetailRoute {...props} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
