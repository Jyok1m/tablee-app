import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
//import { addReviews } from "../reducers/restaurant";
import Header from "../components/Header";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { RFPercentage } from "react-native-responsive-fontsize";
import { addReviews } from "../reducers/restaurant";
import { BACKEND_URL } from "../backend_url";

export default function ReviewScreen() {
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurant.value);
  const [everyReviews, setEveryReviews] = useState([]);
  const { token } = restaurant;

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${BACKEND_URL}/restaurants/reviews/${token}`
      );
      const data = await response.json();
      if (data.result === true) {
        setEveryReviews(data.allReviews);
      }
    })();
  }, []);

  const myReviews = everyReviews.map((data, i) => {
    return (
      <View style={styles.reviewsContainer} key={i}>
        <View style={styles.counter}>
          <TouchableOpacity>
            <FontAwesome name="caret-up" style={styles.caretUp}></FontAwesome>
          </TouchableOpacity>
          <Text style={styles.count}>{data.upVotedBy.length}</Text>
          <TouchableOpacity>
            <FontAwesome
              name="caret-down"
              style={styles.caretDown}
            ></FontAwesome>
          </TouchableOpacity>
        </View>
        <View key={i} style={styles.reviews}>
          <View style={styles.nameDate}>
            <Text style={styles.name}>{data.writer}</Text>
            <Text style={styles.date}>{data.date}</Text>
          </View>
          <Text style={styles.description}>{data.description}</Text>
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View>{myReviews}</View>
      </ScrollView>
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
  reviewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: "5%",
    padding: 5,
    justifyContent: "space-around",
  },
  nameDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    alignItems: "baseline",
  },
  name: {
    fontSize: RFPercentage(3),
    fontWeight: "600",
    color: "#CDAB82",
  },
  date: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    color: "#CDAB82",
  },

  description: {
    color: "white",
    fontSize: RFPercentage(2),
    fontStyle: "italic",
  },
  caretUp: {
    color: "green",
    fontSize: 40,
  },
  caretDown: {
    color: "red",
    fontSize: 40,
  },
  counter: {
    width: "20%",
    alignItems: "center",
  },
  count: {
    color: "white",
    fontSize: 20,
  },
  reviews: {
    width: "80%",
  },
});
