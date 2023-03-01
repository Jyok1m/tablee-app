import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, removePhoto } from "../reducers/user";
import { RFPercentage } from "react-native-responsive-fontsize";
import { BACKEND_URL } from "../backend_url";
import Header from "../components/Header";

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const { token } = user;

  // Get all the data and update the state
  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/users/${token}`);
      const data = await response.json();
      const { result } = data;

      if (result === true) {
        setEmail(data.user.email);
        setUsername(data.user.username);
        setProfilePhoto(data.user.studentCard);
      } else {
        console.log("Error: no user connected");
      }
    })();
  }, []);

  // Logout
  function logout() {
    dispatch(logoutUser());
    dispatch(removePhoto());
    navigation.navigate("Landing");
  }

  let emailContent, usernameContent, photoContent;
  if (email) {
    emailContent = <Text style={styles.subtitle}>{email}</Text>;
  } else {
    emailContent = <Text style={styles.subtitle}>Description...</Text>;
  }
  if (username) {
    usernameContent = <Text style={styles.subtitle}>{username}</Text>;
  } else {
    usernameContent = <Text style={styles.subtitle}>Description...</Text>;
  }

  if (profilePhoto) {
    photoContent = (
      <Image style={styles.profilePic} source={{ uri: profilePhoto }} />
    );
  } else {
    photoContent = <Text style={styles.subtitle}>No Photo...</Text>;
  }

  return (
    <View style={styles.container}>
      <Header />
      {photoContent}
      <View style={styles.inputCard}>
        <View style={styles.cardTop}>
          <Text style={styles.title}>Nom d'utilisateur</Text>
          <TouchableOpacity>
            <Text style={styles.edit}>Modifier</Text>
          </TouchableOpacity>
        </View>
        {usernameContent}
      </View>
      <View style={styles.inputCard}>
        <Text style={styles.title}>Bio</Text>
        <Text style={styles.subtitle}>Description...</Text>
      </View>
      <View style={styles.inputCard}>
        <View style={styles.cardTop}>
          <Text style={styles.title}>Email</Text>
          <TouchableOpacity>
            <Text style={styles.edit}>Modifier</Text>
          </TouchableOpacity>
        </View>
        {emailContent}
      </View>
      <View style={styles.inputCard}>
        <Text style={styles.title}>Mot de passe</Text>
        <Text style={styles.subtitle}>Description...</Text>
      </View>
      <View style={styles.inputCard}>
        <Text style={styles.title}>Moyen de paiement</Text>
        <Text style={styles.subtitle}>Description...</Text>
      </View>
      <View style={styles.inputCard}>
        <Text style={styles.title}>Historique</Text>
        <Text style={styles.subtitle}>Description...</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RestaurantTabNavigator")}
      >
        <Text style={styles.buttonText}>Go to restaurant screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
  profilePic: {
    height: 100,
    width: 100,
    marginBottom: "5%",
    borderRadius: 50,
    borderColor: "#CDAB82",
    borderWidth: 1,
  },
  inputCard: {
    width: "100%",
    minHeight: "2%",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: "5%",
    padding: 5,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  subtitle: {
    fontSize: RFPercentage(1.6),
    fontWeight: "400",
    color: "#FFF",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
    minHeight: "7%",
    backgroundColor: "#b42133",
    borderColor: "#b42133",
    borderWidth: 3,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
  },
});
