import {StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, ActivityIndicator} from "react-native";
import React, {useState, useRef, useEffect} from "react";
import Header from "../components/Header";
import {RFPercentage} from "react-native-responsive-fontsize";
import {useDispatch, useSelector} from "react-redux";
import {BACKEND_URL} from "../backend_url";
import {refreshComponents} from "../reducers/booking";

const moment = require("moment");

export default function CheckoutScreen({navigation}) {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking.value);
  const [visible, setVisible] = useState(true);
  const [directPaymentVisible, setDirectPaymentVisible] = useState(false);
  const [tableePaymentVisible, setTableePaymentVisible] = useState(false);
  const [amount, setAmount] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [bookingNumber, setBookingNumber] = useState("");
  const [bookerName, setBookerName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const booking_id = booking.bookingId;

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/bookings/${booking_id}`);
      const data = await response.json();
      const booking = data.booking;
      setBookerName(booking.booker.firstname);
      setBookingDate(booking.date);
      setBookingTime(booking.date);
      setRestaurantName(booking.restaurant.name);
      setNumberOfPeople(booking.guests);
      setBookingNumber(booking._id.valueOf());
    })();
  }, []);

  // Handle close direct payment
  async function handleCloseDirectPaymentModal() {
    setDirectPaymentVisible(false);
    dispatch(refreshComponents());
    navigation.navigate("TabNavigator");
  }

  // Handle tablée payment
  async function handleTableePayment() {
    setLoading(true);
    const response = await fetch(`${BACKEND_URL}/cards/pay/${booking_id}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({chargeableAmount: amount})
    });
    const data = await response.json();
    setValidationMessage(data.message);
    setLoading(false);
    setTableePaymentVisible(true);
  }

  // Handle close tablee payment
  async function handleCloseTableePaymentModal() {
    setTableePaymentVisible(false);
    dispatch(refreshComponents());
    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.title}>
        <Text style={styles.heading}>Paiement</Text>
      </View>

      {/* Modal */}
      <Modal visible={visible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.textContent}>
              <Text style={styles.paragraph}>Cher {bookerName}, {"\n"}{"\n"}
                Nous espérons que tu as passé un bon moment chez {restaurantName}.{"\n"}{"\n"}
                Deux choix cruciaux s'offrent maintenant à toi, à savoir soit: {"\n"}{"\n"}
                👉 régler le restaurant directement {"\n"}{"\n"}
                👉 payer le restaurant en utilisant le moyen de paiement renseigné lors le ta réservation {"\n"}{"\n"}
                Nous ne prenons aucune commission sur ton paiement 😉 {"\n"}{"\n"}
                À toi de jouer ! 💸
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              onPressOut={() => inputRef.current.focus()}
              style={styles.modalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.modalTextButton}>J'ai compris !</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Screen Direct payment */}
      <Modal visible={directPaymentVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.confModalView}>
            <View style={styles.textContent}>
              <Text style={styles.bigParagraph}>
                Merci d'avoir utilisé Tablée pour ta réservation ! {"\n"}{"\n"}À très vite !
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCloseDirectPaymentModal()}
              onPressOut={() => inputRef.current.focus()}
              style={styles.confModalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.confModalTextButton}>Retour vers la carte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Screen Tablée payment */}
      <Modal visible={tableePaymentVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.confModalView}>
            <View style={styles.textContent}>
              <Text style={styles.bigParagraph}>
                🫶 Merci d'avoir utilisé Tablée pour ta réservation ! {"\n"}{"\n"}
                📧 {validationMessage}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCloseTableePaymentModal()}
              onPressOut={() => inputRef.current.focus()}
              style={styles.confModalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.confModalTextButton}>Retour vers la carte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={loading} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <ActivityIndicator size="large" color="#CDAB82"/>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main container */}
      <View style={styles.mainContainer}>

        {/* Payment Amount */}
        <View style={styles.content}>
          <TextInput style={styles.input}
                     placeholder="0"
                     placeholderTextColor="grey"
                     keyboardType="numeric"
                     onChangeText={(amount) => setAmount(amount)}
                     value={amount}
                     ref={inputRef}
          />
          <Text style={styles.textInput}>€</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => setDirectPaymentVisible(true)}>
            <Text style={styles.text}>Paiement sur place</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => handleTableePayment()}>
            <Text style={styles.text}>Paiement via Tablée</Text>
          </TouchableOpacity>
        </View>

        {/* Détails de la réservation */}
        <View style={styles.bookingContainer}>
          <Text style={styles.bookingTitle}>Rappel de la réservation{"\n"}</Text>
          <Text style={styles.bookingContent}>
            Restaurant : {restaurantName} {"\n"}{"\n"}
            Date : {moment(bookingDate).format("DD/MM/YYYY")} {"\n"}{"\n"}
            Heure : {moment(bookingDate).format("HH:00")} {"\n"}{"\n"}
            Nombre de personnes : {numberOfPeople} {"\n"}{"\n"}
            Réservation : {bookingNumber} {"\n"}{"\n"}
          </Text>
        </View>

      </View>
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
  mainContainer: {
    width: "100%",
    maxHeight: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  heading: {
    fontSize: RFPercentage(5),
    fontWeight: "600",
    color: "#CDAB82",
    marginBottom: 20
  },
  textContent: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10
  },
  paragraph: {
    fontSize: RFPercentage(2),
    fontWeight: "400",
    color: "#FFF"
  },
  bigParagraph: {
    fontSize: RFPercentage(3),
    fontWeight: "500",
    color: "#CDAB82",
    textAlign: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    width: "90%",
    height: "85%",
    backgroundColor: "#1D2C3B",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#CDAB82",
    borderWidth: 2,
    marginTop: "15%"
  },
  confModalView: {
    width: "90%",
    height: "85%",
    backgroundColor: "#1D2C3B",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#CDAB82",
    borderWidth: 2,
    marginTop: "15%"
  },
  modalButton: {
    width: 150,
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#CDAB82",
    borderRadius: 10
  },
  confModalButton: {
    width: 150,
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#CDAB82",
    borderRadius: 10
  },
  modalTextButton: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#1D2C3B"
  },
  confModalTextButton: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#1D2C3B"
  },
  content: {
    minWidth: "15%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: "#CDAB82",
    borderBottomWidth: 2
  },
  input: {
    fontSize: RFPercentage(8),
    textAlign: "right",
    color: "#FFF"
  },
  textInput: {
    fontSize: RFPercentage(8),
    color: "#FFF"
  },
  checkoutButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    minWidth: "100%",
    minHeight: "7%",
    backgroundColor: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 10,
    marginTop: "5%"
  },
  buttonContainer: {
    width: "100%"
  },
  text: {
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#1D2C3B"
  },
  bookingContainer: {
    width: "100%",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 20
  },
  bookingTitle: {
    fontSize: RFPercentage(3),
    fontWeight: "500",
    color: "#CDAB82",
    textAlign: "center"
  },
  bookingContent: {
    fontSize: RFPercentage(2),
    fontWeight: "400",
    color: "#FFF"
  }
});