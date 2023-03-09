import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


export default function ChatComponent({ name }) {
  const navigation = useNavigation();
  const [messages, setMessages] = useState({});

  // Va vers la page de la conversation
  const handleNavigation = () => {
    navigation.navigate("MessageScreen", {
      id: item.id,
      name: item.name,
    });
  };

  return (
    <Pressable style={styles.chatPreview} onPress={handleNavigation}>
      <Ionicons
        name="person-circle-outline"
        size={45}
        color="black"
        style={styles.chatPreviewAvatar}
      />

      <View style={styles.chatPreviewRightContainer}>
        <View>
          <Text style={styles.cusername}>{item.name}</Text>

          <Text style={styles.cmessage}>
            {messages?.text ? messages.text : "Tap to start chatting"}
          </Text>
        </View>
        <View>
          <Text style={styles.chatTime}>
            {messages?.time ? messages.time : "now"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
 chatPreview: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: "#CDAB82",
    height: 80,
    marginBottom: 10,
  },
  chatPreviewAvatar: {
    marginRight: 15,
  },
  cusername: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  cmessage: {
    fontSize: 14,
    opacity: 0.7,
  },
  chatPreviewRightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  chatTime: {
    opacity: 0.5,
  },
})

