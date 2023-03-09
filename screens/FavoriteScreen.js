import {StyleSheet, Text, View, ScrollView} from "react-native";
import React, {useState} from "react";
import Header from "../components/Header";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {BACKEND_URL} from "../backend_url";
import {RFPercentage} from "react-native-responsive-fontsize";

export default function FavoriteScreen() {
  const user = useSelector((state) => state.user.value);
  const {token} = user;
  const booking = useSelector((state) => state.booking.value);
  const {refresher} = booking;
  const [resto, setResto] = useState([]);

  let Resto;

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/users/${token}`);
      const data = await response.json();
      const restoLiked = data.user.likes;
      Resto = restoLiked.map((data, i) => {
        const {name, averagePrice, cuisineTypes, description} = data;
        return (
          <View key={i} style={styles.inputCard}>
            <View style={styles.entete}>
              <Text style={styles.title}>{name}</Text>
              <View style={styles.calloutInfos}>
                <Text style={styles.whiteText}>
                  {cuisineTypes} {"\n"}
                  <Text style={styles.whiteText}>Prix moyen: {averagePrice}€</Text>
                </Text>
              </View>
            </View>
            <Text style={styles.whiteText}>
              {description}
            </Text>
          </View>
        );
      });
      setResto(Resto);
    })();
  }, [refresher]);

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.header}>
        <Text style={styles.name}>Favoris</Text>
      </View>
      <ScrollView style={{width: "100%"}}>
        <View>{resto}</View>
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
  entete: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    justifyItems: "center"
  },
  inputCard: {
    width: "100%",
    minHeight: "2%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    justifyContent: "space-between",
    borderRadius: 10
  },

  title: {
    color: "#CDAB82",
    fontSize: RFPercentage(3),
    fontWeight: "500"
  },
  infos: {
    alignItems: "flex-end",
    fontSize: RFPercentage(2)
  },
  whiteText: {
    fontSize: RFPercentage(2),
    color: "white",
    marginBottom: 10
  },
  calloutContainer: {
    backgroundColor: "#1D2C3B",
    borderRadius: 5,
    width: 300,
    height: 250,
    borderWidth: 2,
    borderColor: "#CDAB82",
    alignItems: "center",
    padding: 10,
    color: "white"
  },
  header: {
    alignItems: "center"
  },
  name: {
    fontSize: RFPercentage(4),
    fontWeight: "600",
    color: "#CDAB82",
    marginBottom: 20
  }
});
