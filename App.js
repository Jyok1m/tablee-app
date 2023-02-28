import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Navigation:
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Stack screens:
import LandingScreen from "./screens/LandingScreen";
import SignupScreen from "./screens/SignupScreen";
import ScanScreen from "./screens/ScanScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import ReviewScreen from "./screens/ReviewScreen";
import MenuScreen from "./screens/MenuScreen";
import BookingScreen from "./screens/BookingScreen";

// Tab nav screens:
import HomeScreen from "./screens/HomeScreen";
import MessageScreen from "./screens/MessageScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import AgendaScreen from "./screens/AgendaScreen";
import ProfileScreen from "./screens/ProfileScreen";

// Font Awesome:
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faEnvelope,
  faHeart,
  faCalendarCheck,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

// Import store persistance modules:
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure the store:
const reducers = combineReducers({ user });
const persistConfig = { key: "face-up", storage: AsyncStorage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = faHouse;
          } else if (route.name === "Messages") {
            iconName = faEnvelope;
          } else if (route.name === "Favorites") {
            iconName = faHeart;
          } else if (route.name === "Agenda") {
            iconName = faCalendarCheck;
          } else if (route.name === "Profile") {
            iconName = faCircleUser;
          }

          return <FontAwesomeIcon icon={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: "#1D2C3B",
        tabBarInactiveTintColor: "#CDAB82",
        tabBarActiveBackgroundColor: "#CDAB82",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1D2C3B",
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Messages" component={MessageScreen} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RestaurantTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName = "";

          if (route.name === "Restaurant") {
            iconName = faHouse;
          } else if (route.name === "Reviews") {
            iconName = faEnvelope;
          } else if (route.name === "Menu") {
            iconName = faHeart;
          } else if (route.name === "Bookings") {
            iconName = faCalendarCheck;
          }

          return <FontAwesomeIcon icon={iconName} size={30} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let labelColor;
          let bottomWidth;
          let bottomColor;

          /*
          if (route.name === "Restaurant") {
            iconColor = focused ? "yellow" : "#CDAB82";
          } else if (route.name === "Reviews") {
            iconName = faEnvelope;
          } else if (route.name === "Menu") {
            iconName = faHeart;
          } else if (route.name === "Bookings") {
            iconName = faCalendarCheck;
          }
          */

          if (focused) {
            labelColor = "yellow";
            bottomWidth = 2;
            bottomColor = "#CDAB82";
          } else {
            labelColor = "#CDAB82";
          }

          return (
            <Text
              style={{
                color: labelColor,
                fontSize: 12,
                textAlign: "center",
                marginTop: 0,
                borderBottomWidth: bottomWidth,
                borderBottomColor: bottomColor,
              }}
            >
              {route.name}
            </Text>
          );
        },

        tabBarActiveTintColor: "#1D2C3B",
        tabBarInactiveTintColor: "#CDAB82",
        // tabBarActiveBackgroundColor: "#CDAB82",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#1D2C3B",
          borderTopWidth: 0,
          height: 75,
        },
      })}
    >
      <Tab.Screen name="Restaurant" component={RestaurantScreen} />
      <Tab.Screen name="Reviews" component={ReviewScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Bookings" component={BookingScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Scan" component={ScanScreen} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen
                name="RestaurantTabNavigator"
                component={RestaurantTabNavigator}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
