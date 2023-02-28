import { StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import {
  faArrowLeftLong,
  faHeartCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const [isBack, setIsBack] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Set the nam of the scren we are on.
  useEffect(() => {
    if (route.name === "Restaurant") {
      setIsBack(true);
    } else {
      setIsBack(false);
    }
  }, []);

  // Conditional setting of the icons depending on which screen we are on.
  let goBackIcon, favoriteIcon;
  if (isBack) {
    goBackIcon = (
      <TouchableOpacity
        style={styles.sideContainer}
        onPress={() => navigation.navigate("TabNavigator")}
      >
        <FontAwesomeIcon icon={faArrowLeftLong} color="#CDAB82" size={24} />
      </TouchableOpacity>
    );
    favoriteIcon = (
      <TouchableOpacity style={styles.sideContainer} onPress={() => goBack()}>
        <FontAwesomeIcon icon={faHeartCirclePlus} color="#CDAB82" size={24} />
      </TouchableOpacity>
    );
  } else {
    goBackIcon = <View style={styles.sideContainer} />;
    favoriteIcon = <View style={styles.sideContainer} />;
  }

  return (
    <View style={styles.header}>
      {goBackIcon}
      <Image
        source={require("../assets/header_logo.png")}
        style={styles.logo}
      />
      {favoriteIcon}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "90%",
    height: "100%",
    marginHorizontal: -8,
  },
  sideContainer: {
    width: "5%",
  },
});
