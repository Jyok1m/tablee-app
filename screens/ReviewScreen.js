import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
//import { addReviews } from "../reducers/restaurant";
import Header from "../components/Header";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {RFPercentage} from "react-native-responsive-fontsize";
import {BACKEND_URL} from "../backend_url";
import {refreshComponents} from "../reducers/booking";

export default function ReviewScreen() {
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurant.value);
  const user = useSelector((state) => state.user.value);
  const {token} = restaurant;
  const booking = useSelector((state) => state.booking.value);
  const {refresher} = booking;
  const [everyReviews, setEveryReviews] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${BACKEND_URL}/restaurants/reviews/${token}`
      );
      const data = await response.json();
      console.log(data);
      if (data.result === true) {
        setEveryReviews(data.allReviews.sort((a, b) => (b.upVotedBy.length - b.downVotedBy.length) - (a.upVotedBy.length - a.downVotedBy.length)));
      }
    })();
  }, [refresher]);

  async function handleUpVote(reviewId) {
    await fetch(
      `${BACKEND_URL}/restaurants/upVote/${user.token}/${reviewId}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({restaurantToken: restaurant.token})
      }
    );
    dispatch(refreshComponents());
  }

  async function handleDownVote(reviewId) {
    await fetch(
      `${BACKEND_URL}/restaurants/downVote/${user.token}/${reviewId}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({restaurantToken: restaurant.token})
      }
    );
    dispatch(refreshComponents());
  }

  const myReviews = everyReviews.map((data, i) => {
    return (
      <View style={styles.reviewsContainer} key={i}>
        <View style={styles.counter}>
          <TouchableOpacity onPress={() => handleUpVote(data._id)}>
            <FontAwesome name="caret-up" style={styles.caretUp}></FontAwesome>
          </TouchableOpacity>
          <Text style={styles.count}>
            {(everyReviews.length > 0) && data.upVotedBy.length - data.downVotedBy.length}
          </Text>
          <TouchableOpacity onPress={() => handleDownVote(data._id)}>
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
      <Header/>
      <Text style={styles.title}>Avis</Text>
      <ScrollView>
        {(everyReviews.length > 0) ? myReviews : <Text style={styles.name}>Pas encore d'avis !</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B"
  },
  reviewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: "5%",
    padding: 5,
    justifyContent: "space-around",
    minHeight: 100
  },
  nameDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    alignItems: "baseline"
  },
  name: {
    fontSize: RFPercentage(2.5),
    fontWeight: "600",
    color: "#CDAB82"
  },
  date: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    color: "#CDAB82",
    marginRight: 10
  },
  description: {
    color: "white",
    fontSize: RFPercentage(2)
  },
  caretUp: {
    color: "green",
    fontSize: 40
  },
  caretDown: {
    color: "red",
    fontSize: 40
  },
  counter: {
    width: "20%",
    alignItems: "center"
  },
  count: {
    color: "white",
    fontSize: RFPercentage(2.5)
  },
  reviews: {
    width: "80%"
  },
  title: {
    fontSize: RFPercentage(5),
    fontWeight: "600",
    color: "#CDAB82",
    marginBottom: 20
  }
});
