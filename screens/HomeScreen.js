import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import React from "react";
import { addRestaurant } from "../reducers/restaurant";
import { BACKEND_URL } from "../backend_url";
import { Dimensions } from "react-native";
import { mapStyle } from "../components/MapStyle";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  // Demande de l'autorisation et fetch de la route pour avoir les coordonnées de tous les restaurants
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
      // Modification de l'état Coordinates en fonction de la réponse du backend
      const response = await fetch(`${BACKEND_URL}/restaurants/all`);
      const data = await response.json();
      if (data.result) setCoordinates(data.allRestaurants);
    })();
  }, []);

  // Map des coordonnées des markers en fonction du résultat du fetch
  const restaurantMarkers = coordinates.map((data, i) => {
    const { restaurantName, latitude, longitude } = data;
    return (
      <Marker
        key={i}
        coordinate={{ latitude, longitude }}
        title={restaurantName}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Header />
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        region={{
          latitude: currentPosition ? currentPosition.latitude : 48.866667,
          longitude: currentPosition ? currentPosition.longitude : 2.333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title="Ma position"
            pinColor="#fecb2d"
          />
        )}
        {restaurantMarkers}
      </MapView>

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("RestaurantTabNavigator")}
        >
          <Text style={{ color: "white" }}>RestaurantScreen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    borderRadius: 50,
  },
});
