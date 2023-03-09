import {StyleSheet, Text, View, ScrollView, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {RFPercentage} from "react-native-responsive-fontsize";
import {BACKEND_URL} from "../backend_url";
import Header from "../components/Header";

export default function MenuScreen({navigation}) {
  const dispatch = useDispatch();
  const [name, setName] = useState(null);
  const [cuisineTypes, setCuisineTypes] = useState(null);
  const [menu, setMenu] = useState(null);

  const restaurant = useSelector((state) => state.restaurant.value);

  const {token} = restaurant;

  let Menu;
  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/restaurants/${token}`);
      const data = await response.json();
      const {result} = data;
      //console.log(data.restaurant.menuItems);
      if (result === true) {
        setName(data.restaurant.name);
        setCuisineTypes(data.restaurant.cuisineTypes);
        Menu = data.restaurant.menuItems.map((data, i) => {
          const {name, price, description} = data;
          return (
            <View key={i} style={styles.inputCard}>
              <View style={styles.menuPrice}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.title}>{price}€</Text>
              </View>
              <Text style={styles.subtitle}>{description}</Text>
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
      <Header/>
      <View style={styles.header}>
        <Text style={styles.name}>Menu</Text>
      </View>
      <ScrollView style={{width: "100%"}}>
        <View>{menu}</View>
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
  subtitle: {
    fontSize: RFPercentage(2),
    fontWeight: "400",
    color: "#ffffff"
  },
  title: {
    fontSize: RFPercentage(2.5),
    fontWeight: "500",
    color: "#CDAB82"
  },
  inputCard: {
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10
  },
  header: {
    alignItems: "center"
  },
  menuPrice: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  name: {
    fontSize: RFPercentage(5),
    fontWeight: "600",
    color: "#CDAB82",
    marginBottom: 20
  }
});
