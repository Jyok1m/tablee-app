import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React from "react";

export default function LandingScreen({ navigation }) {
  //Redirige vers la signup screen
  function signup() {
    navigation.navigate("SignupScreen");
  }

  return (
    <View style={styles.container}>
      <Image source={require("../public/logo.jpg")} />
      <TextInput placeholder="Pseudo" />
      <TouchableOpacity onPress={() => signup()}>
        <Text>LandingScreen</Text>
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
