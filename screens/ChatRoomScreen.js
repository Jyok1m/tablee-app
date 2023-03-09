import React from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";
import {useState} from "react";
import {Feather} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import NewChatModal from "../components/NewChatModal";
import {useEffect} from "react";
import {BACKEND_URL} from "../backend_url";
import socket from "../socket";
import { Ionicons } from "@expo/vector-icons";


export default function ChatRoomScreen({navigation}) {
  // Recupere les infos de l'utilisateur
  const userInfos = useSelector((state) => state.user.value);

  const [visible, setVisible] = useState(false);
  const [roomsFetched, setRoomsFetched] = useState([]);

  let conversations = <View></View>;
  //Refresh la page à l'ouverture ou fermeture du modal
  useEffect(() => {
    (async () => {
      const response = await fetch(`${BACKEND_URL}/messages/rooms`);
      const data = await response.json();
      if (data) {
        setRoomsFetched(data.rooms);
      }
      //console.log(roomsFetched);
    })();
  }, [visible]);

  conversations = roomsFetched?.map((data, i) => {
    const handleNavigation = () => {
      navigation.navigate("MessageScreen", {
        id: data.id,
        name: data.name
      });
    };
    return (
      <Pressable style={styles.chatPreview} onPress={handleNavigation} key={i}>

        <View style={styles.chatPreviewRightContainer}>
          <View>
            <Text style={styles.cusername}>{data.name}</Text>

            <Text style={styles.cmessage}>
              {data.messages?.length == 0
                ? data.messages.text
                : "Tap to start chatting"}
            </Text>
          </View>
          <View>
            <Text style={styles.chatTime}>
              {data.messages.time ? data.messages.time : "now"}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  });

  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Chats</Text>

          <Pressable onPress={() => setVisible(true)}>
            <Feather name="edit" size={24} color="#CDAB82"/>
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.chatlistSContainer}>
        {roomsFetched.length > 0 ? (
          conversations
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>No rooms created!</Text>
            <Text>Click the icon above to create a Chat room</Text>
          </View>
        )}
      </ScrollView>
      {visible ? <NewChatModal setVisible={setVisible}/> : ""}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatscreen: {
    backgroundColor: "#1D2C3B",
    flex: 1,
    padding: 10,
    position: "relative"
  },
  chatheading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#CDAB82"
  },
  chattopContainer: {
    backgroundColor: "#1D2C3B",
    height: 70,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    marginBottom: 15,
    elevation: 2
  },
  chatheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  chatlistContainer: {
    paddingHorizontal: 10
  },
  chatemptyContainer: {
    width: "100%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center"
  },
  chatPreview: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#CDAB82",
    height: 80,
    marginBottom: 10
  },
  //Fenetres de chat
  chatPreviewAvatar: {
    marginRight: 15
  },
  cusername: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold"
  },
  cmessage: {
    fontSize: 14,
    opacity: 0.7
  },
  chatPreviewRightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1
  },
  chatTime: {
    opacity: 0.5
  }
});
