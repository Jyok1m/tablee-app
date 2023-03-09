import React from "react";
import {Text} from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";
import {NavigationContainer} from "@react-navigation/native";
import {RootSiblingParent} from "react-native-root-siblings";
import {SafeAreaView} from "react-native-safe-area-context";
import {LogBox} from "react-native";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

// Navigation:
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

// Stack screens:
import LandingScreen from "./screens/LandingScreen";
import SignupScreen from "./screens/SignupScreen";
import ScanScreen from "./screens/ScanScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import ReviewScreen from "./screens/ReviewScreen";
import MenuScreen from "./screens/MenuScreen";
import BookingScreen from "./screens/BookingScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import NewReviewScreen from "./screens/NewReviewScreen";

// Tab nav screens:
import HomeScreen from "./screens/HomeScreen";
import MessageScreen from "./screens/MessageScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import CalendarScreen from "./screens/CalendarScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";

// Font Awesome:
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
  faHouse,
  faEnvelope,
  faHeart,
  faCalendarCheck,
  faCircleUser,
  faInfoCircle,
  faCheck,
  faBookOpen,
  faCalendarDays
} from "@fortawesome/free-solid-svg-icons";

// Import store persistance modules:
import {Provider} from "react-redux";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import user from "./reducers/user";
import restaurant from "./reducers/restaurant";
import booking from "./reducers/booking";
import {persistStore, persistReducer} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnapScreen from "./screens/SnapScreen";

// Configure the store:
const reducers = combineReducers({user, restaurant, booking});
const persistConfig = {
  key: "tablee",
  storage: AsyncStorage,
  blacklist: ["token", "bookingId"]
};
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false})
});
const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#1D2C3B"}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: () => {
            let iconName;

            if (route.name === "Home") {
              iconName = faHouse;
            } else if (route.name === "Messages") {
              iconName = faEnvelope;
            } else if (route.name === "Favorites") {
              iconName = faHeart;
            } else if (route.name === "Calendar") {
              iconName = faCalendarCheck;
            } else if (route.name === "Profile") {
              iconName = faCircleUser;
            }

            return (
              <FontAwesomeIcon icon={iconName} size={20} color={"#CDAB82"}/>
            );
          },
          tabBarLabel: ({focused}) => {
            let bottomWidth, bottomColor, labelName;
            let weight = "400";

            if (route.name === "Home") {
              labelName = "Accueil";
            } else if (route.name === "Messages") {
              labelName = "Messages";
            } else if (route.name === "Favorites") {
              labelName = "Favoris";
            } else if (route.name === "Calendar") {
              labelName = "Résas";
            } else if (route.name === "Profile") {
              labelName = "Profil";
            }

            if (focused) {
              bottomWidth = 2;
              bottomColor = "#CDAB82";
              weight = "800";
            } else {
              bottomWidth = 2;
              bottomColor = "#1D2C3B";
            }

            return (
              <Text
                style={{
                  color: "#CDAB82",
                  fontSize: RFPercentage(1.6),
                  fontWeight: weight,
                  textAlign: "center",
                  borderBottomWidth: bottomWidth,
                  borderBottomColor: bottomColor,
                  paddingBottom: 5,
                  width: "90%"
                }}
              >
                {labelName}
              </Text>
            );
          },

          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#1D2C3B",
            borderTopWidth: null,
            height: RFPercentage(8),
            paddingBottom: RFPercentage(0.5),
            paddingTop: RFPercentage(0.6)
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Messages" component={ChatRoomScreen}/>
        <Tab.Screen name="Favorites" component={FavoriteScreen}/>
        <Tab.Screen name="Calendar" component={CalendarScreen}/>
        <Tab.Screen name="Profile" component={ProfileScreen}/>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

function RestaurantTabNavigator() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#1D2C3B"}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: () => {
            let iconName;
            let iconColor = "#CDAB82";

            if (route.name === "Restaurant") {
              iconName = faInfoCircle;
            } else if (route.name === "Reviews") {
              iconName = faCheck;
            } else if (route.name === "Menu") {
              iconName = faBookOpen;
            } else if (route.name === "Bookings") {
              iconName = faCalendarDays;
              iconColor = "#ff7500";
            }

            return (
              <FontAwesomeIcon icon={iconName} size={20} color={iconColor}/>
            );
          },
          tabBarLabel: ({focused}) => {
            let bottomWidth, bottomColor, labelName;
            let labelColor = "#CDAB82";
            let weight = "400";

            if (route.name === "Restaurant") {
              labelName = "Infos";
            } else if (route.name === "Reviews") {
              labelName = "Avis";
            } else if (route.name === "Menu") {
              labelName = "Menu";
            } else if (route.name === "Bookings") {
              labelName = "Réserver";
              labelColor = "#ff7500";
            }

            if (focused && route.name === "Bookings") {
              bottomWidth = 2;
              bottomColor = "#ff7500";
              weight = "800";
            } else if (focused) {
              bottomWidth = 2;
              bottomColor = "#CDAB82";
              weight = "800";
            } else {
              bottomWidth = 2;
              bottomColor = "#1D2C3B";
            }

            return (
              <Text
                style={{
                  color: labelColor,
                  fontSize: RFPercentage(1.6),
                  fontWeight: weight,
                  textAlign: "center",
                  borderBottomWidth: bottomWidth,
                  borderBottomColor: bottomColor,
                  paddingBottom: 5,
                  width: "90%"
                }}
              >
                {labelName}
              </Text>
            );
          },

          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#1D2C3B",
            borderTopWidth: null,
            height: RFPercentage(8),
            paddingBottom: RFPercentage(0.5),
            paddingTop: RFPercentage(0.6)
          }
        })}
      >
        <Tab.Screen name="Restaurant" component={RestaurantScreen}/>
        <Tab.Screen name="Reviews" component={ReviewScreen}/>
        <Tab.Screen name="Menu" component={MenuScreen}/>
        <Tab.Screen name="Bookings" component={BookingScreen}/>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaView style={{flex: 1, backgroundColor: "#1D2C3B"}}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Landing" component={LandingScreen}/>
                <Stack.Screen name="Signup" component={SignupScreen}/>
                <Stack.Screen name="Scan" component={ScanScreen}/>
                <Stack.Screen name="Snap" component={SnapScreen}/>
                <Stack.Screen name="TabNavigator" component={TabNavigator}/>
                <Stack.Screen name="MessageScreen" component={MessageScreen}/>
                <Stack.Screen name="Checkout" component={CheckoutScreen}/>
                <Stack.Screen
                  name="RestaurantTabNavigator"
                  component={RestaurantTabNavigator}
                />
                <Stack.Screen name="NewReview" component={NewReviewScreen}/>
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </PersistGate>
      </Provider>
    </RootSiblingParent>
  );
}
