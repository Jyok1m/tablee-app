import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser, removePhoto } from "../reducers/user";
import Header from "../components/Header";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  function logout() {
    dispatch(logoutUser());
    dispatch(removePhoto());
    navigation.navigate("Landing");
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={{ color: "white" }}>ProfileScreen</Text>
      <TouchableOpacity onPress={() => logout()}>
        <Text style={{ color: "white" }}>Logout</Text>
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
