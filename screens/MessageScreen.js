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
  Image,
} from "react-native";
import React, { useRef } from "react";
import Header from "../components/Header";
import {useEffect, useState, useLayoutEffect} from "react";
import {BACKEND_URL} from "../backend_url";
import {io} from "socket.io-client";
import {useSelector} from "react-redux";
import {Ionicons} from "@expo/vector-icons";

var socket = io(`http://192.168.1.10:3000`);

export default function MessageScreen({route, navigation}) {
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

  // Met le titre du header avec le nom de la chatroom
  useLayoutEffect(() => {
    navigation.setOptions({title: name, roomId: id});
    setRoomNumber(id);
    getUsername();
  }, []);

  // Gere l'envoie de messages
  useEffect(() => {
    console.log(userInfos);
    //Récupere les messages de socket venant du backend
    socket
      .off("sendMessageFromBack")
      .on("sendMessageFromBack", (newMessage) => {
        console.log(newMessage);
        setSocketMessages([...socketMessages, newMessage]);
      });

    // Recupere les messages du chat en bdd
    (async () => {
      const response = await fetch(
        `http://192.168.1.10:3000/messages/chatRoom/${id}`
      );
      const data = await response.json();
      if (data) {
        setChatMessages(data.chat);
      }
    })();
  }, [message]);

  // Render les messages du chat depuis la bdd
  let chatMessagesToRender = <View></View>;
  chatMessagesToRender = chatMessages?.map((data, i) => {
    const status = data.user !== userInfos.username;
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
                <Text>{data.message}</Text>
              </View>
            </View>
            <Text style={{ marginLeft: 40 }}>
              {data.date.date.hour}h{data.date.date.min}
            </Text>
          </View>
        </View>
      </View>
    );
  });

  // Render les messages du chat reçu de socket
  let chatMessagesFromSocket = <View></View>;
  chatMessagesFromSocket = socketMessages?.map((data, i) => {
    const status = data.user !== userInfos.username;
    return (
      <View
        key={i}
        style={[
          styles.messagingscreen,
          { paddingVertical: 15, paddingHorizontal: 10 },
        ]}>
        <View>
          <View
            style={
              status
                ? styles.mmessageWrapper
                : [styles.mmessageWrapper, { alignItems: "flex-end" }]
            }>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                        { backgroundColor: "rgb(194, 243, 194)" },
                      ]
                }>
                <Text>{data.message}</Text>
              </View>
            </View>
            <Text style={{ marginLeft: 40 }}>
              {data.date.hour}h{data.date.min}
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
      // Envoi message vers le back via socket
      socket.emit("sendMessage", {
        message: message,
        roomId: roomNumber,
        user: user,
        date: { hour, min },
      });

      // Envoi le message dans la bdd
      (async () => {
        await fetch(`http://192.168.1.10:3000/messages/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message,
            roomId: roomNumber,
            user: user,
            date: { hour, min },
          }),
        });
      })();
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
          scrollViewRef.current.scrollToEnd({ animated: true })
        }>
        {chatMessagesToRender}
        {chatMessagesFromSocket}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          onChangeText={(value) => setMessage(value)}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <View>
            <Text style={{color: "#f2f0f1", fontSize: 20}}>SEND</Text>
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
    backgroundColor: "#1D2C3B",
  },
  top: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D2C3B",
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomColor: "#CDAB82",
    borderBottomWidth: 1,
  },
  titleName: {
    color: "#CDAB82",
    fontSize: 24,
  },
  messageInput: {
    backgroundColor: "white",
    marginTop: "25%",
    width: "80%",
    minHeight: "3%",
    borderWidth: 2,
    borderColor: "#CDAB82",
    borderRadius: 3,
    padding: 5
  },
  sendButton: {
    backgroundColor: "#CDAB82",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    color: "#1D2C3B",
    transition: 1,
    width: "20%",
    alignItems: "center",
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
    borderTopWidth: 1,
  },
  messageInput: {
    borderWidth: 1,
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "white",
  },
  messagingbuttonContainer: {
    width: "30%",
    backgroundColor: "green",
    borderRadius: 3,
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
