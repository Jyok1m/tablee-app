import {useEffect, useState} from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import MapView, {Marker, PROVIDER_GOOGLE, Callout} from "react-native-maps";
import {Dimensions} from "react-native";
import {mapStyle} from "../components/MapStyle";
import * as Location from "expo-location";
import {RFPercentage} from "react-native-responsive-fontsize";

import {useDispatch, useSelector} from "react-redux";
import {sendToken} from "../reducers/restaurant";
import {BACKEND_URL} from "../backend_url";
import Header from "../components/Header";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Toast from "react-native-root-toast";

export default function HomeScreen({navigation}) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filtreRestaurant, setFiltreRestaurant] = useState([]);
  const [rechercheInput, setRechercheInput] = useState("");
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  // Demande de l'autorisation et fetch de la route pour avoir les coordonnées de tous les restaurants
  useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await Location.watchPositionAsync({distanceInterval: 10}, (location) => {
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

  // Filtrer les restaurants lors du press sur le bouton recherche
  function handleSearch(resto) {
    let lowercase = resto.toLowerCase();
    let filtered = allRestaurants.filter(
      (e) =>
        e.name.toLowerCase() == lowercase ||
        e.cuisineTypes.toLowerCase() == lowercase
    );
    setFiltreRestaurant(filtered);
  }

  // Redirige vers la page du resto lors du click sur le modal
  function handleRestaurantPage(restoToken) {
    dispatch(sendToken(restoToken));
    navigation.navigate("RestaurantTabNavigator");

  }

  // Affiche les markers en fonction de la recherche
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
        token
      } = data;
      return (
        <Marker key={i} coordinate={{latitude, longitude}} title={name}>
          <Callout style={styles.calloutContainer} tooltip={true} onPress={() => handleRestaurantPage(token)}>
            <View style={styles.calloutTop}>
              <Text style={styles.calloutTitle}>{name}</Text>
              <View style={styles.calloutInfos}>
                <Text style={[styles.whiteText, styles.smallText]}>
                  {cuisineTypes}
                </Text>
                <Text style={[styles.whiteText, styles.smallText]}>
                  Prix moyen: {averagePrice}€
                </Text>
              </View>
            </View>
            <Text style={[styles.calloutDescription, styles.whiteText]} numberOfLines={3}>
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
        token
      } = data;
      return (
        <Marker key={i} coordinate={{latitude, longitude}} title={name}>
          <Callout style={styles.calloutContainer} tooltip={true} onPress={() => handleRestaurantPage(token)}>
            <View style={styles.calloutTop}>
              <Text style={styles.calloutTitle}>{name}</Text>
              <View style={styles.calloutInfos}>
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
      <Header/>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="De quoi as-tu envie ?"
          placeholderTextColor="grey"
          style={styles.recherche}
          onChangeText={(value) => setRechercheInput(value)}
        />
        {searchButton()}
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        region={{
          latitude: currentPosition ? currentPosition.latitude : 48.866667,
          longitude: currentPosition ? currentPosition.longitude : 2.333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}>
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
    backgroundColor: "#1D2C3B"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    alignItems: "center"
  },
  inputContainer: {
    width: "100%",
    position: "absolute",
    top: -5,
    left: "5%",
    zIndex: 3,
    alignItems: "center"
  },
  recherche: {
    backgroundColor: "white",
    marginTop: "25%",
    width: "80%",
    minHeight: "3%",
    borderWidth: 2,
    borderColor: "#CDAB82",
    borderRadius: 10,
    padding: 5,
    paddingLeft: 10
  },

  boutonRecherche: {
    backgroundColor: "#CDAB82",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    color: "#1D2C3B",
    transition: 1,
    width: "50%",
    alignItems: "center"
  },
  boutonRechercheVide: {
    display: "none"
  },
  calloutContainer: {
    backgroundColor: "#1D2C3B",
    borderRadius: 10,
    width: 300,
    height: 250,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    color: "white",
    justifyContent: "flex-end"
  },
  calloutTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginBottom: 20
  },
  calloutInfos: {
    alignItems: "flex-end",
    fontSize: RFPercentage(2)
  },
  calloutDescription: {
    marginBottom: 20,
    width: "90%"
  },
  calloutTitle: {
    color: "#CDAB82",
    fontSize: RFPercentage(2.5)
  },
  whiteText: {
    color: "white",
    fontSize: RFPercentage(2),
    textAlign: "justify"
  },
  smallText: {
    fontSize: RFPercentage(1.75),
    fontStyle: "italic"
  },
  calloutLink: {
    borderWidth: 1,
    borderColor: "#CDAB82",
    borderRadius: 10,
    padding: 5
  },
  calloutLinkText: {
    color: "#CDAB82"
  }
});
