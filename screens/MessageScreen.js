import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  SafeAreaView
} from "react-native";
import React from "react";
import Header from "../components/Header";
import { useEffect, useState, useLayoutEffect } from "react";
import { BACKEND_URL } from "../backend_url";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import MessageComponent from "../components/MessageComponent";

var socket = io(`http://192.168.10.161:3000`);

export default function MessageScreen({ route, navigation }) {
  const [message, setMessage] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messageToSend, setMessageToSend] = useState("");
  const [user, setUser] = useState("");

    // Recupere les infos de l'utilisateur
  const userInfos = useSelector((state) => state.user.value);

  const [chatMessages, setChatMessages] = useState([

  ]);



  // Recupere le nom et l'id de la chatroom
  const { name, id } = route.params;

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
    navigation.setOptions({ title: name });
    getUsername();
  }, []);

  // Recupere l'heure d'envoi du message puis log l'username, le message et le timestamp
 

  // Gere l'envoie de messages
  useEffect(() => {
    socket.on("sendMessageFromBack", (newMessage) => {
      setMessage(newMessage);
      console.log(message)
    });
  }, [message]);

  async function sendMessage() {
    setMessageToSend(message);
        const hour =
          new Date().getHours() < 10
            ? `0${new Date().getHours()}`
            : `${new Date().getHours()}`;

        const min =
          new Date().getMinutes() < 10
            ? `0${new Date().getMinutes()}`
            : `${new Date().getMinutes()}`;

        //console.log(message, user, hour, min);
    //socket.emit("sendMessage", messageToSend);
    socket.emit("newMessage", {
      messageToSend,
      room_id: id,
      user,
      timestamp: { hour, min },
    });
  }

  console.log(messageToSend)

  return (

    <SafeAreaView style={styles.messagingscreen}>
    <Text>{name}</Text>
      <View
        style={[
          styles.messagingscreen,
          { paddingVertical: 15, paddingHorizontal: 10 },
        ]}>
        {chatMessages[0] ? (
          <FlatList
            data={chatMessages}
            renderItem={({ item }) => (
              <MessageComponent item={item} user={user} />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          ""
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput
          style={styles.messaginginput}
          onChangeText={(value) => setMessage(value)}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <View>
            <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1D2C3B",
  },
  messageInput: {
    backgroundColor: "white",
    marginTop: "25%",
    width: "80%",
    minHeight: "3%",
    borderWidth: 2,
    borderColor: "#CDAB82",
    borderRadius: 3,
    padding: 5,
  },
  sendButton: {
    backgroundColor: "#CDAB82",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    color: "#1D2C3B",
    transition: 1,
    width: "50%",
    alignItems: "center",
  },
  messaginginputContainer: {
    width: "100%",
    minHeight: 100,
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  messaginginput: {
    borderWidth: 1,
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
  },
  messagingbuttonContainer: {
    width: "30%",
    backgroundColor: "green",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },

  mmessageWrapper: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  mmessage: {
    maxWidth: "50%",
    backgroundColor: "#f5ccc2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 2,
  },
  mvatar: {
    marginRight: 5,
  },
});
