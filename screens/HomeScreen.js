import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removePhoto } from "../reducers/user";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removePhoto());
  }, []);

  return (
    <View style={styles.container}>
      <Header />
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
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
});
