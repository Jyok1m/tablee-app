import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Navigation:
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens:
import LandingScreen from "./screens/LandingScreen";
import ScanScreen from "./screens/ScanScreen";
import SignupScreen from "./screens/SignupScreen";
import AgendaScreen from "./screens/AgendaScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import HomeScreen from "./screens/HomeScreen";
import MessageScreen from "./screens/MessageScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RestaurantScreen from "./screens/RestaurantScreen";

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
              <Stack.Screen name="Restaurant" component={RestaurantScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
