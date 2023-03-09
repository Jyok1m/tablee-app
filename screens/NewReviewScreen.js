import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from "react-native";
import React, {useState} from "react";
import Header from "../components/Header";
import {RFPercentage} from "react-native-responsive-fontsize";
import {useSelector, useDispatch} from "react-redux";
import {BACKEND_URL} from "../backend_url";
import {refreshComponents} from "../reducers/booking";

export default function NewReviewScreen() {
  const [inputValue, setInputValue] = useState(null);
  const [newReviews, setNewReviews] = useState(null);
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurant.value);
  const booking = useSelector((state) => state.booking.value);
  const {bookingId} = booking;
  const token = {restaurant};
  const user = useSelector((state) => state.user.value);

  async function handleSubmit() {
    const response = await fetch(
      `${BACKEND_URL}/restaurants/reviews/${booking.bookingId}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({review: inputValue})
      }
    );
    const data = await response.json();
    if (data.result === true) {
      setNewReviews(null);
      dispatch(refreshComponents());
      alert("Commentaire sauvegardé");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header/>
      <Text style={styles.name}>{restaurant.name}</Text>
      <TextInput
        style={styles.content}
        placeholder="Écris ton avis sur le restaurant..."
        onChangeText={(value) => setInputValue(value)}
        multiline={true}
        textAlign="left"
        textAlignVertical="top"
        value={inputValue}
      />
      <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
        <Text style={styles.text}>Valider</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B"
  },
  name: {
    fontSize: RFPercentage(3),
    fontWeight: "600",
    color: "#CDAB82",
    padding: 20
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
    marginTop: "10%"
  },
  content: {
    alignContent: "flex-start",
    backgroundColor: "white",
    height: "50%",
    width: "100%",
    borderRadius: 10,
    padding: 10
  }
});
