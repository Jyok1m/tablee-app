import {StyleSheet, Text, View, ScrollView, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import {BACKEND_URL} from "../backend_url";
import Header from "../components/Header";
import {addRestaurant} from "../reducers/restaurant";

export default function RestaurantScreen({navigation}) {
  const dispatch = useDispatch();
  const [name, setName] = useState(null);
  const [cuisineTypes, setCuisineTypes] = useState(null);
  const [description, setDescription] = useState(null);
  const [perks, setPerks] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [phone, setPhone] = useState(null);
  const [availabilities, setAvailabilities] = useState(null);
  const [address, setAddress] = useState(null);

  const restaurant = useSelector((state) => state.restaurant.value);
  const {token} = restaurant;

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/restaurants/${token}`);
      const data = await response.json();
      const {result} = data;
      if (result === true) {
        setName(data.restaurant.name);
        setCuisineTypes(data.restaurant.cuisineTypes);
        setPhotos(data.restaurant.photos[0]);
        showPhoto(data.restaurant.photos[0]);
        setDescription(data.restaurant.description);
        setPerks(data.restaurant.perks);
        setAvailabilities(data.restaurant.availabilities.join(", "));
        setPhone(data.restaurant.phone);
        const {streetNumber, streetName, postCode, city} =
          data.restaurant.address;
        const restaurantAddress = `${streetNumber} ${streetName} ${postCode} ${city}`;
        setAddress(restaurantAddress);
      } else {
        console.log("Error: restaurant not found");
      }
    })();
  }, []);

  function showPhoto(photo) {
    return (
      <Image
        style={styles.pictures}
        source={{uri: photo, width: 300, height: 150}}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.cuisine}>{cuisineTypes}</Text>
        {photos && showPhoto(photos)}
      </View>
      <ScrollView style={{width: "100%"}}>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.subtitle}>{description}</Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Avantages</Text>
          <Text style={styles.subtitle}>{perks}</Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Validité des avantages</Text>
          <Text style={styles.subtitle}>{availabilities}</Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Téléphone</Text>
          <Text style={styles.subtitle}>+33(0){phone}</Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Adresse</Text>
          <Text style={styles.subtitle}>{address}</Text>
        </View>
      </ScrollView>
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
  header: {
    alignItems: "center"
  },
  pictures: {
    borderColor: "#fffff",
    paddingVertical: 10,
    marginVertical: 15,
    borderRadius: 10
  },
  subtitle: {
    fontSize: RFPercentage(2),
    fontWeight: "400",
    color: "#ffffff",
    textAlign: "justify"
  },
  title: {
    fontSize: RFPercentage(2.5),
    fontWeight: "500",
    color: "#CDAB82"
  },
  name: {
    fontSize: RFPercentage(5),
    fontWeight: "600",
    color: "#CDAB82"
  },
  cuisine: {
    fontSize: RFPercentage(3),
    fontStyle: "italic",
    fontWeight: "500",
    color: "#ffffff"
  },
  inputCard: {
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: "5%",
    padding: 10
  }
});
