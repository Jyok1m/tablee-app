import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { signinUser } from "../reducers/user";
import { BACKEND_URL } from "../backend_url";

export default function LandingScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user.token) navigation.navigate("TabNavigator");
  }, []);

  // Fonction signin pour login le user
  async function signin() {
    const userData = { username, password };
    const response = await fetch(`${BACKEND_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    // Gérer la réponse + les alertes du fetch
    if (data.result === true) {
      dispatch(signinUser({ username, token: data.token }));
      setUsername("");
      setPassword("");
      alert("Connexion réussie !");
      navigation.navigate("TabNavigator");
    } else {
      alert(data.error);
    }
  }

  // Redirige vers la signup screen
  function signup() {
    navigation.navigate("Signup");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={styles.logo} />
      <TextInput
        placeholder="Nom d'utilisateur"
        textContentType="username"
        style={styles.inputBox}
        onChangeText={(value) => setUsername(value)}
        value={username}
      />
      <TextInput
        placeholder="Mot de passe"
        textContentType="newPassword"
        secureTextEntry={true}
        style={styles.inputBox}
        onChangeText={(value) => setPassword(value)}
        value={password}
      />
      <TouchableOpacity onPress={() => signin()} style={styles.button}>
        <Text style={styles.text}>Connection</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => signup()} style={styles.button}>
        <Text style={styles.text}>S'enregistrer</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.pressableText}>Mot de passe oublié</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("TabNavigator")}>
        <Text style={styles.pressableText}>Test</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
  logo: {
    width: "100%",
    maxHeight: "40%",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: 20,
  },
  inputBox: {
    paddingHorizontal: 20,
    width: "100%",
    minHeight: "7%",
    backgroundColor: "#fff",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: "5%",
    fontSize: RFPercentage(2.3),
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
    marginTop: "5%",
  },
  pressableText: {
    textDecorationLine: "underline",
    color: "#CDAB82",
    marginTop: "5%",
    fontSize: RFPercentage(2.3),
  },
  text: {
    fontSize: RFPercentage(2.3),
    fontWeight: "500",
  },
});
