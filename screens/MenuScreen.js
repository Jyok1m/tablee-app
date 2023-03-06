import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RFPercentage } from "react-native-responsive-fontsize";
import { BACKEND_URL } from "../backend_url";
import Header from "../components/Header";

export default function MenuScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(null);
  const [cuisineTypes, setCuisineTypes] = useState(null);
  const [menu, setMenu] = useState(null);

  const restaurant = useSelector((state) => state.restaurant.value);

  const { token } = restaurant;

  let Menu;
  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/restaurants/${token}`);
      const data = await response.json();
      const { result } = data;
      //console.log(data.restaurant.menuItems);
      if (result === true) {
        setName(data.restaurant.name);
        setCuisineTypes(data.restaurant.cuisineTypes);
        Menu = data.restaurant.menuItems.map((data, i) => {
          const { name, price, description } = data;
          return (
            <View key={i} style={styles.card}>
              <View>
                <View style={styles.inputCard}>
                  <View style={styles.menuPrice}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.title}>{data.price}€</Text>
                  </View>
                  <Text style={styles.subtitle}>{data.description}</Text>
                </View>
              </View>
            </View>
          );
        });
        setMenu(Menu);
      } else {
        console.log("Error: restaurant not found");
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.cuisine}>{cuisineTypes}</Text>
      </View>
      <View style={styles.menuContainer}>{menu}</View>
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
  subtitle: {
    fontSize: RFPercentage(1.6),
    fontWeight: "400",
    color: "#ffffff",
  },
  title: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "white",
  },
  menuContainer: {
    width: "90%",
    height: "70%",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 5,
  },
  inputCard: {
    width: "100%",
    minHeight: "2%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderBottomWidth: 1,
    marginBottom: "5%",
    padding: 5,
    paddingBottom: 15,
    paddingTop: 15,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  menuPrice: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
});
