import React, {useState, useEffect, useRef} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Modal,
  TextInput
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import Toast from "react-native-root-toast";
import Header from "../components/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import {RFPercentage} from "react-native-responsive-fontsize";
import {BACKEND_URL} from "../backend_url";

const moment = require("moment");

export default function BookingScreen({}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const restaurant = useSelector((state) => state.restaurant.value);
  const restaurantToken = restaurant.token;

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [restaurantName, setRestaurantName] = useState(null);
  const [cuisineTypes, setCuisineTypes] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);

  const [showPersons, setShowPersons] = useState(false);
  const [numberOfPersons, setNumberOfPersons] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedTime, setSelectedTime] = useState(null);
  const [pressedButtonIndex, setPressedButtonIndex] = useState(null);

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
      const {restaurant} = restaurantData;
      setRestaurantName(restaurant.name);
      setCuisineTypes(restaurant.cuisineTypes);
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
        <TouchableOpacity style={[styles.timeButton, pressedButtonIndex === i && styles.pressedTimeButton]}
                          onPress={() => handleTimePress(data.start, i)}>
          <Text style={styles.textButton}>{data.hourlyType}</Text>
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
        delay: 500
      });
    } else {
      setModalVisible(false);
    }
  }

  function handleCancel() {
    setModalVisible(false);
    setNumberOfPersons(null);
  }

  return (
    <View style={styles.container}>
      <Header/>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Ex: 1, 2, 3..."
              placeholderTextColor="#FFF"
              onChangeText={(value) => setNumberOfPersons(value)}
              value={numberOfPersons}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => handlePersonsClick()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCancel()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.title}>
        <Text style={styles.name}>{restaurantName && restaurantName}</Text>
        <Text style={styles.cuisine}>{cuisineTypes && cuisineTypes}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View>
          <TouchableOpacity onPress={() => showPersonsModal()} style={styles.selectionButton}>
            <Text>{showPersons && numberOfPersons ? `${numberOfPersons} personne(s)` : "Nombre de personnes"}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => handleDateButton()} style={styles.selectionButton}>
            <Text>{showDate ? moment(date).locale("fr").format("DD/MM/YYYY") : "Date"}</Text>
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

        <View style={styles.times}>
          {showDate && availableSlots}
        </View>

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
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  title: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20
  },
  name: {
    fontSize: RFPercentage(5),
    fontWeight: "600",
    color: "#CDAB82"
  },
  cuisine: {
    fontSize: RFPercentage(3),
    fontStyle: "italic",
    fontWeight: "500",
    color: "#ffffff"
  },
  selectionButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    minWidth: "100%",
    height: 50,
    backgroundColor: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 3,
    borderRadius: 5,
    marginTop: "5%"
  },

  // MODAL

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: "#1D2C3B",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    width: 150,
    borderBottomColor: "#CDAB82",
    borderBottomWidth: 1,
    fontSize: 16,
    color: "white"
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#CDAB82",
    borderRadius: 10
  },
  textButton: {
    color: "#FFF",
    height: 24,
    fontWeight: "600",
    fontSize: 15
  },
  timeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "auto",
    height: 50,
    backgroundColor: "none",
    borderColor: "#CDAB82",
    borderWidth: 2,
    borderRadius: 5,
    marginTop: "10%",
    marginHorizontal: "10%"
  },
  pressedTextButton: {
    color: "#1D2C3B",
    height: 24,
    fontWeight: "600",
    fontSize: 15
  },
  pressedTimeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "auto",
    height: 50,
    backgroundColor: "#CDAB82",
    borderColor: "#CDAB82",
    borderWidth: 2,
    borderRadius: 5,
    marginTop: "10%",
    marginHorizontal: "10%"
  },
  times: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  }


});
