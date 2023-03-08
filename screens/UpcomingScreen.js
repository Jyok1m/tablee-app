import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { RFPercentage } from "react-native-responsive-fontsize";
import { TextInput } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { BACKEND_URL } from "../backend_url";

export default function UpcomingScreen({ navigation }) {
  const dispatch = useDispatch();
  const [responseUpcoming, setResponseUpcoming] = useState([]);
  const [responseHistory, setResponseHistory] = useState([]);
  const user = useSelector((state) => state.user.value);
  const { token } = user;
  const moment = require("moment/moment");

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/bookings/upcoming/${token}`);
      const data = await response.json();
      if (data.result === true) {
        console.log(data.result);
        setResponseUpcoming(data.upcoming);
      }

      const historyResponse = await fetch(
        `${BACKEND_URL}/bookings/history/${token}`
      );
      const historyData = await historyResponse.json();
      if (historyData.result === true) {
        console.log(historyData.result);
        setResponseHistory(historyData.history);
      }

      console.log(responseHistory);
    })();
  }, []);

  const futuresResa = responseUpcoming.map((data, i) => {
    return (
      <View style={styles.inputCard} key={i}>
        <Text style={styles.name}>{data.initialData.title}</Text>
        <View styles={styles.recap}>
          <Text style={styles.whiteText}>
            le {moment(data.initialData.start).format("DD/MM/YYYY")} à{" "}
            {data.initialData.hourlyType} pour {data.guests} personnes
          </Text>
          <Text style={styles.whiteText}></Text>
          <Text style={styles.whiteText}></Text>
        </View>
        <Text style={styles.whiteText}>{data.specialRequests}</Text>
        <View style={styles.threeButtons}>
          <TouchableOpacity style={styles.littlebutton}>
            <Text>Supprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.littlebutton}>
            <Text>Commenter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.littlebutton}>
            <Text>Payer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  let historiques = [];
  if (responseHistory.length > 0) {
    historiques = responseHistory.map((data, i) => {
      return (
        <View style={styles.inputCard} key={i}>
          <Text style={styles.name}>{data.initialData.title}</Text>
          <View styles={styles.recap}>
            <Text style={styles.whiteText}>
              le {moment(data.initialData.start).format("DD/MM/YYYY")} à{" "}
              {data.initialData.hourlyType} pour {data.guests} personnes
            </Text>
            <Text style={styles.whiteText}></Text>
            <Text style={styles.whiteText}></Text>
          </View>
          <Text style={styles.whiteText}>{data.specialRequests}</Text>
          <View style={styles.threeButtons}>
            <TouchableOpacity style={styles.littlebutton}>
              <Text>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("NewReview")}
              style={styles.littlebutton}
            >
              <Text>Commenter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.littlebutton}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text>Payer</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.name}>Réservations à venir</Text>
      <ScrollView>{futuresResa}</ScrollView>

      <Text style={styles.name}>Historique</Text>
      <ScrollView>{historiques.length > 0 && historiques}</ScrollView>
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
  recap: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  whiteText: {
    color: "white",
    fontSize: RFPercentage(2.3),
  },
  threeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
    minHeight: "7%",
    backgroundColor: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: "10%",
  },
  littlebutton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    paddingVertical: 3,
    width: "32%",
    minHeight: "7%",
    backgroundColor: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: "5%",
    marginBottom: "2%",
  },

  entete: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    alignItems: "baseline",
  },
  name: {
    fontSize: RFPercentage(3),
    fontWeight: "600",
    color: "#CDAB82",
  },
  inputCard: {
    width: "100%",
    minHeight: "2%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: "5%",
    marginTop: "5%",
    padding: 5,
  },
});
