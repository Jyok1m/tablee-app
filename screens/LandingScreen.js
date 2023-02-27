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

  //Fonction signin pour login le user
  async function signin() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const userData = { username, password };

    setUsernameInput({ ...usernameInput, isValid: true, error: "" });
    setPasswordInput({ ...passwordInput, isValid: true, error: "" });
    setField({ isMissing: false, error: "" });

    const response = await fetch(
      "https://tablee-backend.vercel.app/users/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    if (data.result === true) {
      dispatch(signinUser({ username, token: data.token }));
      setUsernameInput({ value: "", isValid: true, error: "" });
      setPasswordInput({ value: "", isValid: true, error: "" });
      setField({ isMissing: false, error: "" });
    } else if (data.errorSrc === "username") {
      setUsernameInput({ ...usernameInput, isValid: false, error: data.error });
    } else if (data.errorSrc === "password") {
      setPasswordInput({ ...passwordInput, isValid: false, error: data.error });
    } else {
      setField({ isMissing: true, error: data.error });
    }
  }

  //Redirige vers la signup screen
  function signup() {
    navigation.navigate("Signup");
  }

  let errorMessage = <View />;
  if (field.isMissing) {
    errorMessage = <Text style={styles.errorText}>{field.error}</Text>;
  } else if (usernameInput.isValid === false) {
    errorMessage = <Text style={styles.errorText}>{usernameInput.error}</Text>;
  } else if (passwordInput.isValid === false) {
    errorMessage = <Text style={styles.errorText}>{passwordInput.error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={styles.logo} />
      {errorMessage}
      <TextInput
        placeholder="Nom d'utilisateur"
        value={usernameInput}
        textContentType="username"
        style={
          usernameInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) => setUsernameInput({ ...usernameInput, value })}
        onFocus={() => setField({ isMissing: false, error: "data.error" })}
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
        onFocus={() => setField({ isMissing: false, error: "data.error" })}
      />
      <TouchableOpacity onPress={() => signin()} style={styles.button}>
        <Text style={styles.text}>Connection</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => signup()} style={styles.button}>
        <Text style={styles.text}>S'enregistrer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("TabNavigator")}>
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
  textContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#1D2C3B",
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
