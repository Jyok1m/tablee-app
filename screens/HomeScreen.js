import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>HomeScreen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("RestaurantTabNavigator")}
      >
        <Text style={{ color: "white" }}>RestaurantScreen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
});
