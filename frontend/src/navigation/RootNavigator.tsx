import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { MyTokenScreen } from "../screens/MyTokenScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { StaffDashboardScreen } from "../screens/StaffDashboardScreen";
import { VenueDetailScreen } from "../screens/VenueDetailScreen";
import { colors } from "../theme/colors";

export type RootStackParamList = {
  Login: undefined;
  Main: { screen?: keyof ConsumerTabParamList } | undefined;
  VenueDetail: { venueId: string };
  StaffDashboard: undefined;
};

export type ConsumerTabParamList = {
  Venues: undefined;
  MyToken: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<ConsumerTabParamList>();

function ConsumerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.panel,
          borderTopColor: colors.line,
          height: 84,
          paddingTop: 8,
          paddingBottom: 20
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700"
        }
      }}
    >
      <Tab.Screen
        name="Venues"
        component={DiscoverScreen}
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

function MainScreen() {
  return <ConsumerTabs />;
}

export function RootNavigator() {
  const { user } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === "staff" ? (
          <Stack.Screen
            name="StaffDashboard"
            component={StaffDashboardScreen}
          />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen
              name="VenueDetail"
              component={VenueDetailScreen}
              options={{ presentation: "card" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
