import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { Dimensions } from "react-native";
import { mapStyle } from "../components/MapStyle";
import * as Location from "expo-location";

import { useDispatch, useSelector } from "react-redux";
import { addRestaurant } from "../reducers/restaurant";
import { BACKEND_URL } from "../backend_url";
import Header from "../components/Header";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

export default function HomeScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filtreRestaurant, setFiltreRestaurant] = useState([]);
  const [rechercheInput, setRechercheInput] = useState("");
  const [visible, setVisible] = useState(false);

  // Demande de l'autorisation et fetch de la route pour avoir les coordonnées de tous les restaurants
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
      // Modification de l'état allRestaurants en fonction de la réponse du backend
      const response = await fetch(`${BACKEND_URL}/restaurants/all`);
      const data = await response.json();
      if (data.result) setAllRestaurants(data.allRestaurants);
    })();
  }, []);

  //Bouton recherche qui apparait quand l'input n'est pas vide
  function searchButton() {
    if (rechercheInput.length > 0) {
      return (
        <TouchableOpacity
          style={styles.boutonRecherche}
          onPress={() => handleSearch(rechercheInput)}
        >
          <Text>Rechercher</Text>
        </TouchableOpacity>
      );
    } else if (rechercheInput.length === 0) {
      return (
        <TouchableOpacity style={styles.boutonRechercheVide}></TouchableOpacity>
      );
    }
  }

  // Filtrer les restaurant lors du press sur le boutton recherche
  function handleSearch(resto) {
    let lowercase = resto.toLowerCase();
    let filtered = allRestaurants.filter(
      (e) =>
        e.name.toLowerCase() == lowercase ||
        e.cuisineTypes.toLowerCase() == lowercase
    );
    setFiltreRestaurant(filtered);
  }

  // Affiche les markeurs en fonction de la recherche
  let restaurantMarkers;
  if (rechercheInput.length == 0) {
    restaurantMarkers = allRestaurants.map((data, i) => {
      let {
        name,
        latitude,
        longitude,
        description,
        cuisineTypes,
        averagePrice,
      } = data;
      return (
        <Marker key={i} coordinate={{ latitude, longitude }} title={name}>
          <Callout style={styles.calloutContainer} tooltip={true}>
            <View style={styles.calloutTop}>
              <View style={styles.imgPlaceholder}>
                <Text>Photo</Text>
              </View>
              <Text style={styles.calloutTitle}>{name}</Text>
              <View style={styles.calloutinfos}>
                <Text style={[styles.whiteText, styles.smallText]}>
                  {cuisineTypes}
                </Text>
                <Text style={[styles.whiteText, styles.smallText]}>
                  Prix moyen: {averagePrice}€
                </Text>
              </View>
            </View>

            <Text style={[styles.calloutDescription, styles.whiteText]}>
              {description}
            </Text>
            <Pressable
              onPress={() => navigation.navigate("RestaurantTabNavigator")}
            >
              <TouchableOpacity style={styles.calloutLink}>
                <Text style={styles.calloutLinkText}>En savoir plus</Text>
              </TouchableOpacity>
            </Pressable>
          </Callout>
        </Marker>
      );
    });
  } else {
    restaurantMarkers = filtreRestaurant.map((data, i) => {
      let {
        name,
        latitude,
        longitude,
        description,
        cuisineTypes,
        averagePrice,
      } = data;
      return (
        <Marker key={i} coordinate={{ latitude, longitude }} title={name}>
          <Callout style={styles.calloutContainer} tooltip={true}>
            <View style={styles.calloutTop}>
              <View style={styles.imgPlaceholder}>
                <Text>Photo</Text>
              </View>
              <Text style={styles.calloutTitle}>{name}</Text>
              <View style={styles.calloutinfos}>
                <Text style={[styles.whiteText, styles.smallText]}>
                  {cuisineTypes}
                </Text>
                <Text style={[styles.whiteText, styles.smallText]}>
                  Prix moyen: {averagePrice}€
                </Text>
              </View>
            </View>

            <Text style={[styles.calloutDescription, styles.whiteText]}>
              {description}
            </Text>
            <Pressable
              onPress={() => navigation.navigate("RestaurantTabNavigator")}
            >
              <TouchableOpacity style={styles.calloutLink}>
                <Text style={styles.calloutLinkText}>En savoir plus</Text>
              </TouchableOpacity>
            </Pressable>
          </Callout>
        </Marker>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="De quoi avez-vous envie ?"
          style={styles.recherche}
          onChangeText={(value) => setRechercheInput(value)}
        />
        {searchButton()}
      </View>

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
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    position: "absolute",
    top: "5%",
    left: "5%",
    zIndex: 1,
    alignItems: "center",
  },
  recherche: {
    backgroundColor: "white",
    marginTop: "25%",
    width: "80%",
    minHeight: "3%",
    borderWidth: 2,
    borderColor: "#CDAB82",
    borderRadius: 3,
    padding: 5,
  },

  boutonRecherche: {
    backgroundColor: "#CDAB82",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    color: "#1D2C3B",
    transition: 1,
    width: "50%",
    alignItems: "center",
  },
  boutonRechercheVide: {
    display: "none",
  },
  calloutContainer: {
    backgroundColor: "#1D2C3B",
    borderRadius: 5,
    width: 300,
    height: 250,
    borderWidth: 2,
    borderColor: "#CDAB82",
    //justifyContent: 'center',
    alignItems: "center",
    padding: 10,
    color: "white",
  },
  calloutTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  calloutinfos: {
    alignItems: "flex-end",
    fontSize: 12,
  },
  imgPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  calloutDescription: {
    marginBottom: 15,
  },
  calloutTitle: {
    color: "#CDAB82",
    fontSize: 16,
  },
  whiteText: {
    color: "white",
  },
  smallText: {
    fontSize: 12,
  },
  calloutLink: {
    borderWidth: 1,
    borderColor: "#CDAB82",
    borderRadius: 3,
    padding: 5,
  },
  calloutLinkText: {
    color: "#CDAB82",
  },
});
