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
  const [isHome, setIsHome] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Set the nam of the scren we are on.
  useEffect(() => {
    if (route.name === "Restaurant") {
      setIsBack(true);
    } else {
      setIsBack(false);
    }
    if (route.name === "Home") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, []);

  // Conditional setting of the icons depending on which screen we are on.
  let goBackIcon, favoriteIcon;
  if (isBack) {
    goBackIcon = (
      <TouchableOpacity
        style={styles.sideContainerBack}
        onPress={() => navigation.navigate("TabNavigator")}
      >
        <FontAwesomeIcon icon={faArrowLeftLong} color="#CDAB82" size={24} />
      </TouchableOpacity>
    );
    favoriteIcon = (
      <TouchableOpacity style={styles.sideContainerLeft}>
        <FontAwesomeIcon icon={faHeartCirclePlus} color="#CDAB82" size={24} />
      </TouchableOpacity>
    );
  } else {
    goBackIcon = <View style={styles.sideContainerBack} />;
    favoriteIcon = <View style={styles.sideContainerLeft} />;
  }

  return (
    <View
      style={
        isHome
          ? {
              flexDirection: "row",
              width: "100%",
              height: "10%",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 20,
              zIndex: 1,
            }
          : styles.header
      }
    >
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
    justifyContent: "space-between",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  sideContainerBack: {
    width: "15%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: "2%",
    zIndex: 1,
  },
  sideContainerLeft: {
    width: "15%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: "83%",
    zIndex: 1,
  },
});
