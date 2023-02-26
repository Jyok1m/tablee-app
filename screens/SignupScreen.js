import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function SignupScreen({ navigation }) {
  //Redirige vers le scan screen
  function scanCard() {
    navigation.navigate("Scan");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => scanCard()}>
        <Text style={{ color: "white" }}>Go to scan screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
