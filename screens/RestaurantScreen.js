import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RFPercentage } from "react-native-responsive-fontsize";
import { BACKEND_URL } from "../backend_url";
import Header from "../components/Header";

export default function RestaurantScreen({ navigation }) {
  const [name, setName] = useState(null);
  const [cuisineTypes, setCuisineTypes] = useState(null);
  const [description, setDescription] = useState(null);
  const [perks, setPerks] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [phone, setPhone] = useState(null);
  const [availabilities, setavailabilities] = useState();
  const [address, setAddress] = useState(null);

  const restaurant = useSelector((state) => state.restaurant.value);
  const { token } = restaurant;

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/restaurants/${token}`);
      const data = await response.json();
      const { result } = data;
      if (result === true) {
        setName(data.restaurant.name);
        setCuisineTypes(data.restaurant.cuisineTypes);
        setPhotos(data.restaurant.photos[0]);
        setDescription(data.restaurant.description);
        setPerks(data.restaurant.perks);
        setavailabilities(data.restaurant.availabilities);
        setPhone(data.restaurant.phone);
        const { streetNumber, streetName, postCode, city } =
          data.restaurant.address;
        const restaurantAddress = `${streetNumber} ${streetName} ${postCode} ${city}`;
        setAddress(restaurantAddress);
      } else {
        console.log("Error: restaurant not found");
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.name}>MAXIMS{name}</Text>
        <Text style={styles.cuisine}>Française{cuisineTypes}</Text>
        <Image style={styles.pictures} source={require("../assets/plat.jpg")} />
      </View>
      <ScrollView>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.subtitle}>
            {description}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi repudiandae consequuntur
            voluptatum laborum numquam blanditiis harum
          </Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Avantages</Text>
          <Text style={styles.subtitle}>
            {perks}Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Maxime mollitia, molestiae quas vel sint commodi repudiandae
            consequuntur voluptatum laborum numquam blanditiis harum
          </Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Validité</Text>
          <Text style={styles.subtitle}>
            {availabilities}Lorem ipsum dolor sit amet consectetur adipisicing
            elit.
          </Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Phone</Text>
          <Text style={styles.subtitle}>0144826310{phone}</Text>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.title}>Adresse</Text>
          <Text style={styles.subtitle}>3 rue Royale 75008 Paris{address}</Text>
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
    backgroundColor: "#1D2C3B",
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
  },
  pictures: {
    width: 280,
    maxHeight: 150,
    padding: 10,
    margin: 10,
  },
  subtitle: {
    fontSize: RFPercentage(1.6),
    fontWeight: "400",
    color: "#ffffff",
  },
  title: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#CDAB82",
  },
  name: {
    fontSize: RFPercentage(5),
    fontWeight: "600",
    color: "#CDAB82",
  },
  cuisine: {
    fontSize: RFPercentage(3),
    fontStyle: "italic",
    fontWeight: "500",
    color: "#ffffff",
  },
  inputCard: {
    width: "100%",
    minHeight: "2%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: "5%",
    padding: 5,
  },
});
