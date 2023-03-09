import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Image
} from "react-native";
import React, {useRef} from "react";
import Header from "../components/Header";
import {useEffect, useState, useLayoutEffect} from "react";
import {BACKEND_URL} from "../backend_url";
import {io} from "socket.io-client";
import {useSelector, useDispatch} from "react-redux";
import {refreshComponents} from "../reducers/booking";
import {Ionicons} from "@expo/vector-icons";

var socket = io(BACKEND_URL);

export default function MessageScreen({route, navigation}) {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking.value);
  const {refresher} = booking;
  const [message, setMessage] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [user, setUser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socketMessages, setSocketMessages] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");

  const scrollViewRef = useRef();

  // Recupere les infos de l'utilisateur
  const userInfos = useSelector((state) => state.user.value);

  // Recupere le nom et l'id de la chatroom
  const {name, id} = route.params;

  // Recupere le nom d'utilisateur (puis la photo de profil apres)
  const getUsername = () => {
    const value = userInfos.username;
    if (value !== null) {
      setUser(value);
    } else {
      console.error("Error while loading username!");
    }
  };

  // Gere l'envoie de messages
  useEffect(() => {
    navigation.setOptions({title: name, roomId: id});
    setRoomNumber(id);

    // Recupere les messages du chat en bdd
    getUsername();
    (async () => {
      const response = await fetch(`${BACKEND_URL}/messages/chatRoom/${id}`);
      const data = await response.json();
      if (data) {
        setChatMessages(data.chat);
      }
    })();
  }, [refresher]);

  useEffect(() => {
    //Récupere les messages de socket venant du backend
    socket.on("sendMessageFromBack", (newMessage) => {
      setChatMessages([...chatMessages, newMessage]);
    });
    return () => {
      socket.off();
    };
  }, [chatMessages, refresher]);

  console.log("chatMessages", chatMessages[chatMessages.length - 1]);

  // Render les messages du chat reçu de socket

  let chatMessagesFromSocket = chatMessages.map((data, i) => {
    const status = data?.user !== userInfos.username;
    return (
      <View
        key={i}
        style={[
          styles.messagingscreen,
          {paddingVertical: 15, paddingHorizontal: 10}
        ]}>
        <View>
          <View
            style={
              status
                ? styles.mmessageWrapper
                : [styles.mmessageWrapper, {alignItems: "flex-end"}]
            }>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Ionicons
                name="person-circle-outline"
                size={30}
                color="black"
                style={styles.mavatar}
              />
              {/* <Image source={{ uri: userInfos.photos }} style={styles.mavatar} />*/}
              <View
                style={
                  status
                    ? styles.mmessage
                    : [
                      styles.mmessage,
                      {backgroundColor: "rgb(194, 243, 194)"}
                    ]
                }>
                <Text>{data?.message}</Text>
              </View>
            </View>
            <Text style={{marginLeft: 40, color: "white", opacity: 0.5}}>
              {data.date.date.hour}h{data.date.date.min}
            </Text>
          </View>
        </View>
      </View>
    );
  });

  async function sendMessage() {
    //Recupére l'heure d'envoi
    const hour =
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`;

    const min =
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`;

    if (message.length > 0) {
      // Envoi le message dans la bdd
      let request = await fetch(`${BACKEND_URL}/messages/sendForSocket`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          message: message,
          roomId: roomNumber,
          user: user,
          date: {hour, min}
        })
      });

      let response = await request.json();
      dispatch(refreshComponents());
      //Envoi le message envoyé en bdd à socket
      socket.emit("sendMessage", response.data);
      setMessage("");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.titleName}>{name}</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        {chatMessagesFromSocket}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          onChangeText={(value) => setMessage(value)}
          value={message}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <View>
            <Text style={{color: "#f2f0f1", fontSize: 16}}>SEND</Text>
          </View>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1D2C3B"
  },
  top: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D2C3B",
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomColor: "#CDAB82",
    borderBottomWidth: 1
  },
  titleName: {
    color: "#CDAB82",
    fontSize: 24
  },
  messageInput: {
    backgroundColor: "white",
    width: "80%",
    minHeight: "4%",
    marginRight: 5,
    borderWidth: 2,
    borderColor: "#CDAB82",
    borderRadius: 5,
    padding: 5
  },
  sendButton: {
    backgroundColor: "#CDAB82",

    padding: 10,
    borderRadius: 10,
    color: "#1D2C3B",
    transition: 1,
    width: "20%",
    alignItems: "center"
  },
  inputContainer: {
    width: "100%",
    minHeight: 100,
    backgroundColor: "#1D2C3B",
    paddingVertical: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopColor: "#CDAB82",
    borderTopWidth: 1
  },
  messagingbuttonContainer: {
    width: "30%",
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },

  mmessageWrapper: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 15
  },
  mmessage: {
    maxWidth: "50%",
    backgroundColor: "#f5ccc2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 2
  },
  mvatar: {
    marginRight: 5
  },
  // Bulles messages
  chatemptyText: {fontWeight: "bold", fontSize: 24, paddingBottom: 30},
  messagingscreen: {
    flex: 1
  }
});
