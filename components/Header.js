import {StyleSheet, Image, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import React, {useEffect, useState} from "react";
import {
  faArrowLeftLong,
  faHeartCirclePlus
} from "@fortawesome/free-solid-svg-icons";
import {useRoute} from "@react-navigation/native";
import {useNavigation} from "@react-navigation/native";
import {BACKEND_URL} from "../backend_url";
import {useDispatch, useSelector} from "react-redux";
import {refreshComponents} from "../reducers/booking";

export default function Header() {
  const dispatch = useDispatch();
  const [isBack, setIsBack] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const restaurant = useSelector((state) => state.restaurant.value);
  const user = useSelector((state) => state.user.value);
  const booking = useSelector((state) => state.booking.value);
  const {refresher} = booking;
  const navigation = useNavigation();
  const route = useRoute();

  const handleLike = async () => {
    const response = await fetch(`${BACKEND_URL}/users/like/${user.token}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        restaurantToken: restaurant.token
      })
    });
    const data = await response.json();
    if (data.result) {
      dispatch(refreshComponents());
      setRefresh(!refresh);
      alert("Restaurant ajouté aux favoris !");
    } else {
      dispatch(refreshComponents());
      setRefresh(!refresh);
      alert("Restaurant retiré des favoris !");
    }
  };

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
    (async () => {
      const response = await fetch(`${BACKEND_URL}/users/${user.token}/${restaurant.token}`);
      const data = await response.json();
      data.result ? setIsFavorite(true) : setIsFavorite(false);
    })();
  }, [refresher, refresh]);

  // Conditional setting of the icons depending on which screen we are on.
  let goBackIcon, favoriteIcon;
  if (isBack) {
    goBackIcon = (
      <TouchableOpacity
        style={styles.sideContainerBack}
        onPress={() => navigation.navigate("TabNavigator")}
      >
        <FontAwesomeIcon icon={faArrowLeftLong} color="#CDAB82" size={24}/>
      </TouchableOpacity>
    );
    favoriteIcon = (
      <TouchableOpacity
        style={styles.sideContainerLeft}
        onPress={() => handleLike()}
      >
        <FontAwesomeIcon icon={faHeartCirclePlus} color={isFavorite ? "red" : "#CDAB82"} size={24}/>
      </TouchableOpacity>
    );
  } else {
    goBackIcon = <View style={styles.sideContainerBack}/>;
    favoriteIcon = <View style={styles.sideContainerLeft}/>;
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
            zIndex: 1
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
    justifyContent: "space-between"
  },
  logo: {
    width: "100%",
    height: "100%"
  },
  sideContainerBack: {
    width: "15%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: "2%",
    zIndex: 1
  },
  sideContainerLeft: {
    width: "15%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: "83%",
    zIndex: 1
  }
});
