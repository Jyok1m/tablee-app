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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import React from "react";
import { addRestaurant } from "../reducers/restaurant";
import { BACKEND_URL } from "../backend_url";
import { Dimensions } from "react-native";

export default function RestaurantScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const restaurant = useSelector((state) => state.restaurant.value);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState("");
  const [allRestaurant, setAllRestaurant] = useState([]);
  const [restaurantPosition, setRestaurantPosition] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
    fetch(`${BACKEND_URL}/restaurants`)
      .then((response) => response.json())
      .then((data) => {
        data.result && setAllRestaurant(data);
      });
  }, []);

  useEffect(() => {
    // récuperer toutes les adresses
    for (const resto of allRestaurant) {
      const addresses = `${resto.address.streetNumber} ${resto.address.streetName} ${resto.address.postCode}`;
      console.log(addresses);
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${addresses}`)
        .then((response) => response.json())
        .then((data) => {
          const restau = data.features[0];
          console.log(data);
          setRestaurantPosition([
            ...allRestaurant,
            {
              latitude: restau.geometry.coordinates[1],
              longitude: restau.geometry.coordinates[0],
            },
          ]);
        });
    }
  }, [allRestaurant]);
  const markers = restaurantPosition.map((data, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: data.latitude, longitude: data.longitude }}
        title={data.name}
      />
    );
  });
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <MapView style={styles.map}>
          {currentPosition && (
            <Marker
              coordinate={currentPosition}
              title="My position"
              pinColor="#fecb2d"
            />
          )}
          {markers}
        </MapView>
      </View>
    </SafeAreaView>
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
  },
});
