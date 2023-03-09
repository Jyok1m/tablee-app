import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React, {useState} from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
import {useDispatch, useSelector} from "react-redux";
import {signinUser, removePhoto} from "../reducers/user";
import {BACKEND_URL} from "../backend_url";
import Toast from "react-native-root-toast";

export default function SignupScreen({navigation}) {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  //Redirige vers le scan screen
  function scanCard() {
    navigation.navigate("Scan");
  }

  // Fonction signup
  async function signup() {
    // Fetch la route signup:
    const studentCard = user.photos;
    const userData = {username, firstname, lastname, email, password, studentCard};
    const response = await fetch(`${BACKEND_URL}/users/signup`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    });
    const data = await response.json();

    // Gérer la réponse + les alertes du fetch
    if (data.result === true) {
      dispatch(signinUser({username, token: data.token}));
      setUsername("");
      setLastname("");
      setEmail("");
      setPassword("");
      dispatch(removePhoto());
      navigation.navigate("TabNavigator");
      Toast.show(`Bienvenue dans Tablée, ${username} !`, {
        duration: Toast.durations.LONG,
        position: -10,
        textColor: "#1D2C3B",
        opacity: 1,
        shadow: true,
        backgroundColor: "#CDAB82",
        animation: true,
        delay: 500
      });
      setFirstname("");
    } else {
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
        style={styles.inputBox}
        onChangeText={(value) => setUsername(value)}
        value={username}
      />
      <TextInput
        placeholder="Prénom"
        textContentType="givenName"
        style={styles.inputBox}
        onChangeText={(value) => setFirstname(value)}
        value={firstname}
      />
      <TextInput
        placeholder="Nom"
        textContentType="familyName"
        style={styles.inputBox}
        onChangeText={(value) => setLastname(value)}
        value={lastname}
      />
      <TextInput
        placeholder="Email universitaire"
        textContentType="emailAddress"
        style={styles.inputBox}
        onChangeText={(value) => setEmail(value)}
        value={email}
      />
      <TextInput
        placeholder="Mot de passe"
        textContentType="newPassword"
        secureTextEntry={true}
        style={styles.inputBox}
        onChangeText={(value) => setPassword(value)}
        value={password}
      />

      <TouchableOpacity onPress={() => scanCard()} style={styles.button}>
        <Text style={styles.text}>Justificatif de scolarité</Text>
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
    backgroundColor: "#1D2C3B"
  },
  logo: {
    width: "100%",
    maxHeight: "10%"
  },
  inputBox: {
    paddingHorizontal: 20,
    width: "100%",
    minHeight: "7%",
    backgroundColor: "#fff",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 10,
    marginTop: "5%",
    fontSize: RFPercentage(2)
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
    borderRadius: 10,
    marginTop: "5%"
  },
  text: {
    fontSize: RFPercentage(2),
    fontWeight: "500"
  }
});
