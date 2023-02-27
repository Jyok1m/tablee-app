import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export default function SignupScreen({ navigation }) {
  //Redirige vers le scan screen
  function scanCard() {
    navigation.navigate("Scan");
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput placeholder="Nom d'utilisateur" textContentType="username" />
      <TextInput placeholder="Prénom" textContentType="firstname" />
      <TextInput placeholder="Email universitaire" textContentType="email" />
      <TextInput placeholder="Mot de passe" textContentType="password" />
      <TextInput
        placeholder="Répéter mot de passe"
        textContentType="password"
      />

      <TouchableOpacity onPress={() => scanCard()}>
        <Text style={{ color: "white" }}>Go to scan screen</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D2C3B",
    alignItems: "center",
    justifyContent: "center",
  },
});
