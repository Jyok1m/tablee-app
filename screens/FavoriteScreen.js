import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { BACKEND_URL } from "../backend_url";

export default function FavoriteScreen() {
  const user = useSelector((state) => state.user.value);
  const { token } = user;
  const [resto, setResto] = useState([]);

  let Resto;

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/users/${token}`);
      const data = await response.json();
      const restoLiked = data.user.likes;
      Resto = restoLiked.map((data, i) => {
        const { name, price, cuisineTypes, description } = data;
        return (
          <View key={i} style={styles.inputCard}>
            <View style={styles.entete}>
              <View style={styles.imgPlaceholder}>
                <Text>Photo</Text>
              </View>
              <View style={styles.infos}>
                <Text style={styles.title}>{name}</Text>
                <Text style={[styles.whiteText, styles.smallText]}>
                  {cuisineTypes}
                </Text>
                <Text style={[styles.whiteText, styles.smallText]}>
                  Prix moyen: {price}€
                </Text>
              </View>
            </View>

            <Text style={[styles.whiteText, styles.smallText]}>
              {description}
            </Text>
          </View>
        );
      });
      setResto(Resto);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>{resto}</ScrollView>
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
  entete: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    justifyItems: "center",
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
    justifyContent: "space-between",
  },
  imgPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#CDAB82",
    fontSize: 20,
  },
  infos: {
    alignItems: "flex-end",
    fontSize: 12,
  },
  whiteText: {
    color: "white",
  },
  smallText: {
    fontSize: 12,
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
});
