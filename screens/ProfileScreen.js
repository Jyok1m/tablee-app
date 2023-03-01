import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, removePhoto } from "../reducers/user";
import { RFPercentage } from "react-native-responsive-fontsize";
import { BACKEND_URL } from "../backend_url";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

export default function ProfileScreen({ navigation }) {
  /* -------------------------------------------------------------------------- */
  /*                                    Logic                                   */
  /* -------------------------------------------------------------------------- */

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [history, setHistory] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState("");
  const [inputType, setInputType] = useState("");
  const [sendState, setSendState] = useState(false);

  const navigate = useNavigation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const { token } = user;

  /* ---------------- Get all the data and update the state ---------------- */

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/users/${token}`);
      const data = await response.json();
      const { result } = data;
      const { studentCard, bio, username, email, password, history } =
        data.user;

      if (result) {
        setProfilePhoto(studentCard);
        setBio(bio);
        setUsername(username);
        setEmail(email);
        setPassword(password);
        setHistory(history);
      }
    })();
  }, [sendState]);

  /* ------------------------------- Show Modal ------------------------------ */

  const displayInputField = (inputType) => {
    setInputType(inputType);
    setIsFocused(inputType);
  };

  const closeInputField = () => {
    setIsFocused("");
    setInputValue("");
    setInputType("");
  };

  /* ------------------------------- Handle Edit ------------------------------ */

  async function saveInput() {
    const response = await fetch(`${BACKEND_URL}/users/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [inputType]: inputValue }),
    });
    const data = await response.json();
    if (data) alert("Entrée sauvegardée !");
    setSendState(!sendState);
    setIsFocused("");
    setInputValue("");
    setInputType("");
  }

  /* --------------------------------- Logout --------------------------------- */

  function logout() {
    dispatch(logoutUser());
    dispatch(removePhoto());
    navigation.navigate("Landing");
  }

  /* --------------------------------- Handle restaurant history --------------------------------- */

  const restaurantHistory = history.map((data, i) => {
    return (
      <ScrollView style={styles.scrollView}>
        <Text key={i} style={styles.content}>
          {`\u2022 ${data.restaurant.name}`}
        </Text>
      </ScrollView>
    );
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View style={styles.container}>
      {/* Header */}

      <Header />

      {/* Title container*/}

      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>
          Bienvenue, {username && <Text>{username} !</Text>}
        </Text>
      </View>

      {/* User container */}

      <View style={styles.userContainer}>
        <View style={styles.photoContainer}>
          {profilePhoto && (
            <Image style={styles.profilePic} source={{ uri: profilePhoto }} />
          )}
          <TouchableOpacity style={styles.editPhoto}>
            <Text style={styles.edit}>Modifier</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bioContainer}>
          <View style={styles.inputCard}>
            <View style={styles.cardTop}>
              <Text style={styles.title}>Bio</Text>
              {isFocused === "bio" ? (
                <View style={styles.editFocused}>
                  <TouchableOpacity onPress={() => closeInputField()}>
                    <Text style={styles.edit}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => saveInput()}>
                    <Text style={styles.edit}>Sauvegarder</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    displayInputField("bio");
                  }}
                >
                  <Text style={styles.edit}>Modifier</Text>
                </TouchableOpacity>
              )}
            </View>
            {isFocused === "bio" ? (
              <ScrollView style={styles.editViewTop}>
                <TextInput
                  style={styles.editContent}
                  onChangeText={(value) => setInputValue(value)}
                  value={inputValue}
                  multiline={true}
                />
              </ScrollView>
            ) : bio ? (
              <ScrollView style={styles.scrollView}>
                <Text style={styles.content}>{bio}</Text>
              </ScrollView>
            ) : (
              <Text style={styles.noContent}>Racontez votre histoire...</Text>
            )}
          </View>
        </View>
      </View>

      {/* Main container */}

      <View style={styles.mainContainer}>
        <View style={styles.inputCard}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>Email</Text>
            {isFocused === "email" ? (
              <View style={styles.editFocusedMain}>
                <TouchableOpacity onPress={() => closeInputField()}>
                  <Text style={styles.edit}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveInput()}>
                  <Text style={styles.edit}>Sauvegarder</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  displayInputField("email");
                }}
              >
                <Text style={styles.edit}>Modifier</Text>
              </TouchableOpacity>
            )}
          </View>
          {isFocused === "email" ? (
            <ScrollView style={styles.editViewTop}>
              <TextInput
                style={styles.editContent}
                onChangeText={(value) => setInputValue(value)}
                value={inputValue}
                multiline={true}
              />
            </ScrollView>
          ) : (
            email && <Text style={styles.content}>{email}</Text>
          )}
        </View>

        <View style={styles.inputCard}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>Mot de passe</Text>
            {isFocused === "password" ? (
              <View style={styles.editFocusedMain}>
                <TouchableOpacity onPress={() => closeInputField()}>
                  <Text style={styles.edit}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveInput()}>
                  <Text style={styles.edit}>Sauvegarder</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  displayInputField("password");
                }}
              >
                <Text style={styles.edit}>Modifier</Text>
              </TouchableOpacity>
            )}
          </View>
          {isFocused === "password" ? (
            <ScrollView style={styles.editViewTop}>
              <TextInput
                style={styles.editContent}
                onChangeText={(value) => setInputValue(value)}
                value={inputValue}
                multiline={true}
              />
            </ScrollView>
          ) : (
            password && <Text style={styles.content}>********</Text>
          )}
        </View>
        <View style={styles.inputCard}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>Moyen de paiement</Text>
            <TouchableOpacity>
              <Text style={styles.edit}>Modifier</Text>
            </TouchableOpacity>
          </View>
          {password && <Text style={styles.content}>********</Text>}
        </View>
        <View style={styles.inputCard}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>Historique</Text>
          </View>
          {history.length ? (
            restaurantHistory
          ) : (
            <ScrollView style={styles.scrollView}>
              <Text style={styles.noContent}>Pas encore de restaurant...</Text>
            </ScrollView>
          )}
        </View>
      </View>

      {/* Bot container = boutons */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => logout()}>
          <Text style={styles.pressableText}>Déconnexion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("RestaurantTabNavigator")}
        >
          <Text style={styles.pressableText}>Test page restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Style                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },

  /* ----------------------------- Title Container ----------------------------- */

  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%",
  },
  screenTitle: {
    fontSize: RFPercentage(3.5),
    color: "#CDAB82",
    fontWeight: "500",
  },

  /* ------------------------------ User container ----------------------------- */

  userContainer: {
    flexDirection: "row",
    width: "100%",
    height: "20%",
    alignItems: "center",
    marginBottom: "5%",
  },
  photoContainer: {
    width: "30%",
    height: "100%",
    marginRight: "5%",
  },
  profilePic: {
    height: "70%",
    width: "100%",
    borderRadius: 50,
    borderColor: "#CDAB82",
    borderWidth: 1,
  },
  editPhoto: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  bioContainer: {
    justifyContent: "space-between",
    width: "65%",
    height: "100%",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 5,
  },

  /* ----------------------------- Main container ----------------------------- */

  mainContainer: {
    width: "100%",
    height: "55%",

    marginBottom: "3%",
    padding: 5,
  },
  inputCard: {
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    marginBottom: "2%",
    padding: 5,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#CDAB82",
    borderBottomWidth: 1,
    marginBottom: "2%",
  },
  title: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#CDAB82",
  },
  edit: {
    fontSize: RFPercentage(1.6),
    fontWeight: "500",
    color: "#CDAB82",
    textDecorationLine: "underline",
    fontStyle: "italic",
  },
  editFocused: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  editFocusedMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "20%",
    width: "60%",
  },
  editContent: {
    borderBottomWidth: 1,
    borderBottomColor: "#CDAB82",
    fontSize: RFPercentage(1.6),
    fontWeight: "400",
    color: "#FFF",
  },
  editViewTop: {
    maxHeight: "80%",
  },
  content: {
    fontSize: RFPercentage(1.6),
    fontWeight: "400",
    color: "#FFF",
  },
  noContent: {
    fontSize: RFPercentage(1.6),
    fontWeight: "400",
    color: "grey",
    fontStyle: "italic",
  },
  scrollView: {
    height: "40%",
  },

  /* ----------------------------- Button container ----------------------------- */

  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  pressableText: {
    textDecorationLine: "underline",
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#CDAB82",
  },
});
