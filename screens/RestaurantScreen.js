import { StyleSheet, View } from "react-native";
import React from "react";
import Header from "../components/Header";

export default function RestaurantScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.container}></View>
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
