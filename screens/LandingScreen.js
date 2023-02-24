import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";

export default function LandingScreen({ navigation }) {
  const [usernameInput, setUsernameInput] = useState({
    value: "",
    isValid: true,
  });
  const [passwordInput, setPasswordInput] = useState({
    value: "",
    isValid: true,
  });

  //Redirige vers la signup screen
  function signup() {
    navigation.navigate("SignupScreen");
  }

  return (
    <View style={styles.container}>
      <Image source={require("../public/logo.jpg")} style={styles.logo} />
      <TextInput
        placeholder="Pseudo"
        textContentType="username"
        style={
          usernameInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) =>
          setUsernameInput({ ...usernameInput, usernameInput: value })
        }
        value={usernameInput}
      />
      <TextInput
        placeholder="Password"
        textContentType="password"
        style={
          passwordInput.isValid ? styles.validInputBox : styles.invalidInputBox
        }
        onChangeText={(value) =>
          setPasswordInput({ ...passwordInput, passwordInput: value })
        }
        value={passwordInput}
      />
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
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  logo: {
    width: "100%",
    height: 300,
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
  },
  validInputBox: {
    justifyContent: "center",
    maxPadding: 20,
    width: "100%",
    height: "7%",
    backgroundColor: "#fff",
    color: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
  },
  invalidInputBox: {
    maxPadding: 20,
    width: "100%",
    height: "7%",
    backgroundColor: "#fff",
    borderColor: "red",
    borderWidth: 3,
    borderRadius: 5,
  },
});
