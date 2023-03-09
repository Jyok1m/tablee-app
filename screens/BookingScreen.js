import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { refreshComponents } from "../reducers/booking";
import Toast from "react-native-root-toast";
import Header from "../components/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RFPercentage } from "react-native-responsive-fontsize";
import { BACKEND_URL } from "../backend_url";
import { faCheck, faHandPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const moment = require("moment");

export default function BookingScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const restaurant = useSelector((state) => state.restaurant.value);
  const restaurantToken = restaurant.token;

  const [availabilities, setAvailabilities] = useState([]);

  const [showPersons, setShowPersons] = useState(false);
  const [numberOfPersons, setNumberOfPersons] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [selectedTime, setSelectedTime] = useState(null);
  const [pressedButtonIndex, setPressedButtonIndex] = useState(null);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardHolderName, setCardHolderName] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [cardExpirationMonth, setCardExpirationMonth] = useState(null);
  const [cardExpirationYear, setCardExpirationYear] = useState(null);
  const [cardCVV, setCardCVV] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [cardInfosReady, setCardInfosReady] = useState(false);

  const [request, setRequest] = useState("");
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  const [formReady, setFormReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set date:
  function handleDateButton() {
    setShow(!show);
    setShowDate(true);
  }

  function onChange(event, selectedDate) {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  }

  // Set restaurant data:
  useEffect(() => {
    (async () => {
      const restaurantResponse = await fetch(
        `${BACKEND_URL}/restaurants/${restaurantToken}`
      );
      const restaurantData = await restaurantResponse.json();
      const { restaurant } = restaurantData;
      // Aller à travers toutes les dispos du resto pour les trier selon la date choisie
      setAvailabilities([]);
      const slotArr = [];
      const bookableDay = moment(date).format("DD/MM/YYYY");
      for (const timeSlot of restaurant.timeSlots) {
        const restaurantDay = moment(timeSlot.start).format("DD/MM/YYYY");
        if (restaurantDay === bookableDay) slotArr.push(timeSlot);
      }
      setAvailabilities(slotArr);
    })();
  }, [date, pressedButtonIndex]);

  // Display and handle the times slots
  const availableSlots = availabilities.map((data, i) => {
    return (
      <View key={i}>
        <TouchableOpacity
          style={[
            styles.timeButton,
            pressedButtonIndex === i && styles.pressedTimeButton,
          ]}
          onPress={() => handleTimePress(data.start, i)}
        >
          <Text
            style={[
              styles.textButton,
              pressedButtonIndex === i && styles.pressedTextButton,
            ]}
          >
            {data.hourlyType}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  function handleTimePress(time, index) {
    setPressedButtonIndex(index);
    setSelectedTime(time);
  }

  // Set number of people:
  function showPersonsModal() {
    setModalVisible(true);
    setShowPersons(true);
  }

  function handlePersonsClick() {
    const arr = [];
    for (let i = 1; i < 100; i++) {
      arr.push(i.toString());
    }
    if (!numberOfPersons || !arr.includes(numberOfPersons)) {
      Toast.show("Nombre de personnes invalide.", {
        duration: Toast.durations.LONG,
        position: -10,
        textColor: "#1D2C3B",
        opacity: 1,
        shadow: true,
        backgroundColor: "#CDAB82",
        animation: true,
        delay: 500,
      });
    } else {
      setModalVisible(false);
    }
  }

  function handleCancel() {
    setModalVisible(false);
    setNumberOfPersons(null);
    setShowPersons(false);
  }

  // Select available time
  function showTimeModal() {
    setTimeModalVisible(true);
  }

  function handleValidateTime() {
    setTimeModalVisible(false);
  }

  function handleCancelTime() {
    setTimeModalVisible(false);
    setSelectedTime(null);
  }

  // Set card details:
  function showCardModal() {
    setCardModalVisible(true);
  }

  function handleValidateCard() {
    if (
      cardHolderName &&
      cardNumber &&
      cardExpirationYear &&
      cardExpirationMonth &&
      cardCVV &&
      phoneNumber
    ) {
      setCardInfosReady(true);
      setCardModalVisible(false);
    } else {
      Toast.show("Un ou plusieurs champ(s) manquant.", {
        duration: Toast.durations.LONG,
        position: -10,
        textColor: "#1D2C3B",
        opacity: 1,
        shadow: true,
        backgroundColor: "#CDAB82",
        animation: true,
        delay: 500,
      });
    }
  }

  function handleCancelCard() {
    setCardModalVisible(false);
    setCardHolderName(null);
    setCardNumber(null);
    setCardExpirationMonth(null);
    setCardExpirationYear(null);
    setCardCVV(null);
    setPhoneNumber(null);
  }

  // Set special requests:
  function showRequestModal() {
    setRequestModalVisible(true);
  }

  function handleValidateRequest() {
    if (request) setRequestModalVisible(false);
  }

  function handleCancelRequest() {
    setRequestModalVisible(false);
    setRequest("");
  }

  // Determine whether the form is ready or not
  useEffect(() => {
    if (numberOfPersons && selectedTime && selectedTime && cardInfosReady) {
      setFormReady(true);
    } else {
      setFormReady(false);
    }
  });

  // Handle Validate

  async function validateForm() {
    setLoading(true);
    try {
      // Create user in Stripe:
      await fetch(`${BACKEND_URL}/customers/new/${user.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      // Add credit card to Stripe:
      const cardDetails = {
        name: cardHolderName,
        number: cardNumber,
        exp_month: cardExpirationMonth,
        exp_year: cardExpirationYear,
        cvc: cardCVV,
      };
      await fetch(`${BACKEND_URL}/cards/save/${user.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardDetails),
      });
      // Create Booking:
      const bookingDetails = {
        guests: numberOfPersons,
        date: selectedTime,
        specialRequests: request,
        restaurantToken: restaurant.token,
      };
      const response = await fetch(
        `${BACKEND_URL}/bookings/new/${user.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingDetails),
        }
      );
      const data = await response.json();
      if (data.result === false) {
        Toast.show(response.error, {
          duration: Toast.durations.LONG,
          position: -10,
          textColor: "#1D2C3B",
          opacity: 1,
          shadow: true,
          backgroundColor: "#CDAB82",
          animation: true,
          delay: 500,
        });
      } else {
        setLoading(false);
        alert(
          `${data.message} 🔥Ta référence de réservation est: ${data.bookingId}`
        );
        navigation.navigate("TabNavigator");
        dispatch(refreshComponents());
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Modal visible={loading} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <ActivityIndicator size="large" color="#CDAB82" />
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Ex: 1, 2, 3..."
              placeholderTextColor="grey"
              type=""
              onChangeText={(value) => setNumberOfPersons(value)}
              value={numberOfPersons}
              style={styles.input}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => handlePersonsClick()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCancel()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={timeModalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.timeContainer}>
              {showDate && availableSlots}
            </View>
            <TouchableOpacity
              onPress={() => handleValidateTime()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCancelTime()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={cardModalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Nom sur la carte bancaire"
              placeholderTextColor="grey"
              value={cardHolderName}
              onChangeText={(value) => setCardHolderName(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Numéro de carte"
              placeholderTextColor="grey"
              value={cardNumber}
              onChangeText={(value) => setCardNumber(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Mois d'expiration (MM)"
              placeholderTextColor="grey"
              value={cardExpirationMonth}
              onChangeText={(value) => setCardExpirationMonth(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Année d'expiration (AAAA)"
              placeholderTextColor="grey"
              value={cardExpirationYear}
              onChangeText={(value) => setCardExpirationYear(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              placeholderTextColor="grey"
              value={cardCVV}
              onChangeText={(value) => setCardCVV(value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone"
              placeholderTextColor="grey"
              value={phoneNumber}
              onChangeText={(value) => setPhoneNumber(value)}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              onPress={() => handleValidateCard()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCancelCard()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={requestModalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Que veux-tu demander ?"
              placeholderTextColor="grey"
              onChangeText={(value) => setRequest(value)}
              value={request}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => handleValidateRequest()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCancelRequest()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Header />

      <View style={styles.title}>
        <Text style={styles.name}>Réservation</Text>
      </View>

      <View style={{ width: "100%", height: "80%" }}>
        <ScrollView>
          <Text style={styles.dividerTitle}>Informations de base</Text>

          <View>
            <TouchableOpacity
              onPress={() => showPersonsModal()}
              style={[
                styles.notSelectedButton,
                showPersons && numberOfPersons && styles.selectionButton,
              ]}
            >
              <Text
                style={[
                  styles.textButton,
                  showPersons && numberOfPersons && styles.pressedTextButton,
                ]}
              >
                {showPersons && numberOfPersons
                  ? `${numberOfPersons} personne(s)`
                  : "Nombre de personnes"}
              </Text>
              {showPersons && numberOfPersons ? (
                <FontAwesomeIcon icon={faCheck} size={14} color="#1D2C3B" />
              ) : (
                <FontAwesomeIcon icon={faHandPointer} size={14} color="grey" />
              )}
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => handleDateButton()}
              style={[
                styles.notSelectedButton,
                showDate && styles.selectionButton,
              ]}
            >
              <Text
                style={[
                  styles.textButton,
                  showDate && styles.pressedTextButton,
                ]}
              >
                {showDate
                  ? moment(date).locale("fr").format("DD/MM/YYYY")
                  : "Date"}
              </Text>
              {showDate ? (
                <FontAwesomeIcon icon={faCheck} size={14} color="#1D2C3B" />
              ) : (
                <FontAwesomeIcon icon={faHandPointer} size={14} color="grey" />
              )}
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                onChange={onChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View>
            <TouchableOpacity
              onPress={() => showTimeModal()}
              style={[
                styles.notSelectedButton,
                selectedTime && styles.selectionButton,
              ]}
            >
              <Text
                style={[
                  styles.textButton,
                  selectedTime && styles.pressedTextButton,
                ]}
              >
                {selectedTime
                  ? `${new Date(selectedTime.toString()).getHours()}:${new Date(
                      selectedTime.toString()
                    ).getMinutes()}0`
                  : "Horaire(s) disponible(s)"}
              </Text>
              {selectedTime ? (
                <FontAwesomeIcon icon={faCheck} size={14} color="#1D2C3B" />
              ) : (
                <FontAwesomeIcon icon={faHandPointer} size={14} color="grey" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.dividerTitle}>
            Informations de paiement {"\n"}
            <Text style={styles.dividerSubtitle}>
              (Cela nous permet de valider la réservation auprès du restaurant)
            </Text>
          </Text>

          <View>
            <TouchableOpacity
              onPress={() => showCardModal()}
              style={[
                styles.notSelectedButton,
                cardInfosReady && styles.selectionButton,
              ]}
            >
              <Text
                style={[
                  styles.textButton,
                  cardInfosReady && styles.pressedTextButton,
                ]}
              >
                {cardInfosReady
                  ? "Carte bancaire renseignée"
                  : "Carte bancaire"}
              </Text>
              {cardInfosReady ? (
                <FontAwesomeIcon icon={faCheck} size={14} color="#1D2C3B" />
              ) : (
                <FontAwesomeIcon icon={faHandPointer} size={14} color="grey" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.dividerTitle}>Confirmation</Text>

          <View>
            <TouchableOpacity
              onPress={() => showRequestModal()}
              style={[
                styles.notSelectedButton,
                request && styles.selectionButton,
              ]}
            >
              <Text
                style={[styles.textButton, request && styles.pressedTextButton]}
              >
                {request ? "Modifier la demande" : "Demande(s) spéciale(s)"}
              </Text>
              {request ? (
                <FontAwesomeIcon icon={faCheck} size={14} color="#1D2C3B" />
              ) : (
                <FontAwesomeIcon icon={faHandPointer} size={14} color="grey" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => validateForm()}
            disabled={!formReady && true}
            style={[styles.reserveButton, formReady && styles.selectionButton]}
          >
            <Text
              style={[
                styles.reserveText,
                formReady && styles.pressedTextButton,
              ]}
            >
              Réserver
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
  title: {
    alignItems: "center",
  },
  mainContainer: {
    justifyContent: "space-between",
  },
  dataContainer: {
    width: "100%",
  },
  divider: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  dividerTitle: {
    fontSize: RFPercentage(3),
    fontWeight: "600",
    color: "#CDAB82",
    marginVertical: 15,
    textAlign: "center",
  },
  dividerSubtitle: {
    fontSize: RFPercentage(1.5),
    fontWeight: "600",
    color: "#CDAB82",
    fontStyle: "italic",
    textAlign: "center",
  },
  timeContainer: {
    flexDirection: "row", // This sets the direction of the scroll to horizontal
    flexWrap: "wrap",
    padding: 10,
    width: "100%",
  },
  name: {
    fontSize: RFPercentage(5),
    fontWeight: "600",
    color: "#CDAB82",
  },
  cuisine: {
    fontSize: RFPercentage(3),
    fontStyle: "italic",
    fontWeight: "500",
    color: "#FFF",
  },
  notSelectedButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    minWidth: "100%",
    height: 50,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: "2%",
  },
  reserveButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    minWidth: "100%",
    height: 50,
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: "2%",
  },
  selectionButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    minWidth: "100%",
    height: 50,
    backgroundColor: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: "2%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#1D2C3B",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    minWidth: 200,
    borderBottomColor: "#CDAB82",
    borderBottomWidth: 1,
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  button: {
    width: 150,
    alignItems: "center",
    marginVertical: 10,
    paddingTop: 8,
    backgroundColor: "#CDAB82",
    borderRadius: 10,
  },
  textButton: {
    color: "grey",
    height: 24,
    fontWeight: "600",
    fontSize: RFPercentage(2),
  },
  reserveText: {
    color: "#CDAB82",
    height: 24,
    fontWeight: "600",
    fontSize: RFPercentage(2),
  },
  timeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: 100,
    height: 50,
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: "2%",
    marginHorizontal: "1%",
  },
  pressedTextButton: {
    color: "#1D2C3B",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  pressedTimeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: 100,
    height: 50,
    backgroundColor: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: "2%",
    marginHorizontal: "1%",
  },
  times: {
    flexDirection: "row",
    width: "100%",
  },
  inputBox: {
    paddingHorizontal: 20,
    width: "100%",
    minHeight: "7%",
    backgroundColor: "#fff",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: "5%",
    fontSize: RFPercentage(2),
  },
  cardContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
