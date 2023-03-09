import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import {RFPercentage} from "react-native-responsive-fontsize";
import {useSelector, useDispatch} from "react-redux";
import {BACKEND_URL} from "../backend_url";
import {setBookingId} from "../reducers/booking";
import {refreshComponents} from "../reducers/booking";
import moment from "moment/moment";

export default function CalendarScreen({navigation}) {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking.value);
  const {refresher} = booking;
  const [responseUpcoming, setResponseUpcoming] = useState([]);
  const [responseHistory, setResponseHistory] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [deletedModalVisible, setDeletedModalVisible] = useState(false);
  const [booking_id, setBooking_id] = useState(null);
  const user = useSelector((state) => state.user.value);
  const {token} = user;
  const moment = require("moment");

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/bookings/upcoming/${token}`);
      const data = await response.json();
      if (data.result === true) setResponseUpcoming(data.upcoming.sort((a, b) => moment(a.initialData.start) - moment(b.initialData.start)));
      const historyResponse = await fetch(`${BACKEND_URL}/bookings/history/${token}`);
      const historyData = await historyResponse.json();
      if (historyData.result === true) {
        setResponseHistory(historyData.history.sort((a, b) => moment(b.initialData.start) - moment(a.initialData.start)));
      }
    })();
  }, [refresher]);

  // Handle comment:
  async function handleComment(bookingId) {
    dispatch(setBookingId(bookingId));
    navigation.navigate("NewReview");
  }

  // Handle payment:
  async function handlePayment(bookingId) {
    dispatch(setBookingId(bookingId));
    navigation.navigate("Checkout");
  }

  // Handle cancel press:
  function handleCancelPress(bookingId) {
    setNotificationModalVisible(true);
    setBooking_id(bookingId);
  }

  // Handle cancel:
  async function handleCancel() {
    setNotificationModalVisible(false);
    const response = await fetch(`${BACKEND_URL}/bookings/delete/${token}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({bookingId: booking_id})
    });
    const data = await response.json();
    setDeleteMessage(data.message);
    setDeletedModalVisible(true);
  }

  // handle Map go back:
  async function handleMapGoBack() {
    setDeletedModalVisible(false);
    dispatch(refreshComponents());
    navigation.navigate("Home");
  }

  const futuresResa = responseUpcoming.map((data, i) => {
    return (
      <View style={styles.inputCard} key={i}>
        <Text style={styles.name}>{data.initialData.title}{"\n"}</Text>
        <View styles={styles.recap}>
          <Text style={styles.whiteText}>
            Date : {moment(data.initialData.start).format("DD/MM/YYYY")} {"\n"}
            Heure : {moment(data.initialData.start).format("HH:00")} {"\n"}
            Nombre de personnes : {data.guests} {"\n"}
            Réservation : {data._id}
          </Text>
        </View>
        <Text style={styles.whiteText}>Demande(s): {data.specialRequests}</Text>
        <View style={styles.buttons}>
          {!data.paid ?
            <TouchableOpacity onPress={() => handlePayment(data._id)} style={styles.littleButton}>
              <Text>Prépayer</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity disabled={true} style={styles.reserveButton}>
              <Text style={{color: "grey"}}>Prépayé</Text>
            </TouchableOpacity>
          }
          {!data.paid ?
            <TouchableOpacity onPress={() => handleCancelPress(data._id)} style={styles.littleButton}>
              <Text>Annuler</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity disabled={true} style={styles.reserveButton}>
              <Text style={{color: "grey"}}>Annulation impossible</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  });

  let historiques = [];
  if (responseHistory.length > 0) {
    historiques = responseHistory.map((data, i) => {
      return (
        <View style={styles.inputCard} key={i}>
          <Text style={styles.name}>{data.initialData.title}{"\n"}</Text>
          <View styles={styles.recap}>
            <Text style={styles.whiteText}>
              Date : {moment(data.initialData.start).format("DD/MM/YYYY")} {"\n"}
              Heure : {moment(data.initialData.start).format("HH:00")} {"\n"}
              Nombre de personnes : {data.guests} {"\n"}
              Réservation : {data._id}
            </Text>
          </View>
          <Text style={styles.whiteText}>Demande(s): {data.specialRequests}</Text>
          <View style={styles.buttons}>
            {!data.paid &&
              <TouchableOpacity onPress={() => handlePayment(data._id)} style={styles.littleButton}>
                <Text>Payer</Text>
              </TouchableOpacity>}
            <TouchableOpacity onPress={() => handleComment(data._id)} style={styles.littleButton}>
              <Text>Commenter</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Modal visible={notificationModalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.notification}>
              Es-tu sûr de vouloir annuler ta réservation ?
            </Text>
            <TouchableOpacity
              onPress={() => handleCancel()}
              style={styles.modalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNotificationModalVisible(false)}
              style={styles.modalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Non</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={deletedModalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.notification}>
              {deleteMessage}
            </Text>
            <TouchableOpacity
              onPress={() => handleMapGoBack()}
              style={styles.modalButton}
              activeOpacity={0.8}
            >
              <Text style={styles.pressedTextButton}>Retour à la carte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Header/>

      <View style={{height: "42%", width: "100%"}}>
        <Text style={styles.title}>Réservations à venir</Text>
        <ScrollView contentContainerStyle={{width: "100%", maxHeight: "10000%"}}>
          {futuresResa}
        </ScrollView>
      </View>

      <View style={{width: "100%", borderTopColor: "#CDAB82", borderTopWidth: 2, marginVertical: 20}}/>

      <View style={{height: "42%", width: "100%"}}>
        <Text style={styles.title}>Historique</Text>
        <ScrollView contentContainerStyle={{width: "100%", maxHeight: "10000%"}}>
          {historiques.length > 0 && historiques}
        </ScrollView>
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
  recap: {
    flexDirection: "column",
    justifyContent: "space-between"
  },
  whiteText: {
    color: "white",
    fontSize: RFPercentage(2)
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  littleButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: "50%",
    backgroundColor: "#CDAB82",
    borderRadius: 10,
    marginTop: "2%"
  },

  entete: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    alignItems: "baseline"
  },
  title: {
    fontSize: RFPercentage(4),
    fontWeight: "600",
    color: "#CDAB82",
    textAlign: "center",
    marginBottom: 10
  },
  name: {
    fontSize: RFPercentage(3),
    fontWeight: "600",
    color: "#CDAB82",
    textAlign: "center"
  },
  inputCard: {
    width: "100%",
    maxHeight: 300,
    backgroundColor: "transparent",
    borderColor: "#CDAB82",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: "5%",
    marginTop: "5%",
    padding: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: "#FFF",
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
    elevation: 5,
    width: "75%"
  },
  modalButton: {
    width: 150,
    alignItems: "center",
    marginVertical: 10,
    paddingTop: 8,
    backgroundColor: "#CDAB82",
    borderRadius: 10
  },
  pressedTextButton: {
    color: "#1D2C3B",
    height: 24,
    fontWeight: "600",
    fontSize: RFPercentage(2)
  },
  notification: {
    color: "#1D2C3B",
    fontSize: RFPercentage(2),
    fontWeight: "400"
  },
  reserveButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: "50%",
    color: "#CDAB82",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: "2%"
  }
});
