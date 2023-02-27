import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signinUser } from "../reducers/user";

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const [usernameInput, setUsernameInput] = useState({
    value: "",
    isValid: true,
  });
  const [firstnameInput, setFirstnameInput] = useState({
    value: "",
    isValid: true,
  });
  const [emailInput, setEmailInput] = useState({
    value: "",
    isValid: true,
  });
  const [passwordInput, setPasswordInput] = useState({
    value: "",
    isValid: true,
  });
  const [studentCardInput, setStudentCardInput] = useState({
    value: "Test",
    isValid: true,
  });

  //Redirige vers le scan screen
  function scanCard() {
    navigation.navigate("Scan");
  }

  // Fonction signup
  async function signup() {
    const username = usernameInput.value;
    const firstname = firstnameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const studentCard = studentCardInput.value;
    const userData = { username, firstname, email, password, studentCard };

    // Fetch la route signup:
    const response = await fetch("http://192.168.10.125:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    // Reset fields on save
    setUsernameInput({ ...usernameInput, isValid: true });
    setFirstnameInput({ ...firstnameInput, isValid: true });
    setEmailInput({ ...emailInput, isValid: true });
    setPasswordInput({ ...passwordInput, isValid: true });

    // Gérer la réponse + les alertes du fetch
    if (data.result === true) {
      dispatch(signinUser({ username, token: data.token }));
      navigation.navigate("TabNavigator");

      // Reset fields
      setUsernameInput({ value: "", isValid: true });
      setFirstnameInput({ value: "", isValid: true });
      setEmailInput({ value: "", isValid: true });
      setPasswordInput({ value: "", isValid: true });
    } else if (data.errorSrc === "username") {
      setUsernameInput({ ...usernameInput, isValid: false });
      alert(data.error);
    } else if (data.errorSrc === "password") {
      setPasswordInput({ ...passwordInput, isValid: false });
      alert(data.error);
    } else if (data.errorSrc === "email") {
      setEmailInput({ ...emailInput, isValid: false });
      alert(data.error);
    } else if (data.errorSrc === "studentCard") {
      setPasswordInput({ ...passwordInput, isValid: false });
      alert(data.error);
    } else if (data.errorSrc === "field") {
      alert(data.error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/header_logo.png")}
        style={styles.logo}
      />
      <TextInput
        placeholder="Nom d'utilisateur"
        textContentType="username"
        style={
          usernameInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) => setUsernameInput({ isValid: true, value })}
        value={usernameInput}
      />
      <TextInput
        placeholder="Prénom"
        textContentType="givenName"
        style={styles.validInputBox}
        onChangeText={(value) => setFirstnameInput({ isValid: true, value })}
        value={firstnameInput}
      />
      <TextInput
        placeholder="Email universitaire"
        textContentType="emailAddress"
        style={
          emailInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) => setEmailInput({ isValid: true, value })}
        value={emailInput}
      />
      <TextInput
        placeholder="Mot de passe"
        textContentType="newPassword"
        style={
          passwordInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) => setPasswordInput({ isValid: true, value })}
        value={passwordInput}
      />

      <TouchableOpacity onPress={() => scanCard()} style={styles.button}>
        <Text style={styles.text}>Scanner la carte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => signup()} style={styles.button}>
        <Text style={styles.text}>S'enregistrer</Text>
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
    maxHeight: "10%",
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
