import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../components/Header";

export default function BookingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={{ color: "white" }}>Réservations</Text>
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
});
