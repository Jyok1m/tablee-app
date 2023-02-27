import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { signinUser } from "../reducers/user";

export default function LandingScreen({ navigation }) {
  const dispatch = useDispatch();
  const [usernameInput, setUsernameInput] = useState({
    value: "",
    isValid: true,
    error: "",
  });
  const [passwordInput, setPasswordInput] = useState({
    value: "",
    isValid: true,
    error: "",
  });
  const [field, setField] = useState({
    isMissing: false,
    error: "",
  });

  // Fonction signin pour login le user
  async function signin() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const userData = { username, password };

    setUsernameInput({ ...usernameInput, isValid: true, error: "" });
    setPasswordInput({ ...passwordInput, isValid: true, error: "" });
    setField({ isMissing: false, error: "" });

    // Fetch la route signin:
    const response = await fetch(
      "https://tablee-backend.vercel.app/users/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();

    // Gérer la réponse + les alertes du fetch
    if (data.result === true) {
      dispatch(signinUser({ username, token: data.token }));
      setUsernameInput({ value: "", isValid: true, error: "" });
      setPasswordInput({ value: "", isValid: true, error: "" });
      setField({ isMissing: false, error: "" });
    } else if (data.errorSrc === "username") {
      setUsernameInput({ ...usernameInput, isValid: false, error: data.error });
      alert(usernameInput.error);
    } else if (data.errorSrc === "password") {
      setPasswordInput({ ...passwordInput, isValid: false, error: data.error });
      alert(passwordInput.error);
    } else {
      setField({ isMissing: true, error: data.error });
      alert(field.error);
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
        value={usernameInput}
        textContentType="username"
        style={
          usernameInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) => setUsernameInput({ ...usernameInput, value })}
      />
      <TextInput
        placeholder="Mot de passe"
        value={passwordInput}
        textContentType="password"
        secureTextEntry={true}
        style={
          passwordInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) => setPasswordInput({ ...passwordInput, value })}
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
  validInputBox: {
    paddingHorizontal: 20,
    width: "100%",
    minHeight: "7%",
    backgroundColor: "#fff",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: 20,
    fontSize: 16,
  },
  invalidInputBox: {
    paddingHorizontal: 20,
    width: "100%",
    minHeight: "7%",
    backgroundColor: "#fff",
    borderColor: "red",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: 20,
    fontSize: 16,
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
    marginTop: 20,
  },
  pressableText: {
    textDecorationLine: "underline",
    color: "#CDAB82",
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
