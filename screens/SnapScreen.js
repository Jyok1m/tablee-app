import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useDispatch } from "react-redux";
import { refreshProfilePic } from "../reducers/user";
import { removeProfilePic } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { BACKEND_URL } from "../backend_url";
import Toast from "react-native-root-toast";

export default function SnapScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.user.value);
  const { token } = user;

  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);

  let cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    const formData = new FormData();
    formData.append("photoFromFront", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    Toast.show("Nouvelle photo enregistrée !", {
      duration: Toast.durations.LONG,
      position: -10,
      textColor: "#1D2C3B",
      opacity: 1,
      shadow: true,
      backgroundColor: "#CDAB82",
      animation: true,
      delay: 500,
    });

    navigation.navigate("Profile");

    let data = {};

    try {
      const response = await fetch(`${BACKEND_URL}/users/upload`, {
        method: "POST",
        body: formData,
      });
      data = await response.json();
      console.log("Photo Saved !");
    } catch (error) {
      console.log(error);
    }

    try {
      const putResponse = await fetch(`${BACKEND_URL}/users/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picture: data.url }),
      });
      const putData = await putResponse.json();
      if (putData.result) dispatch(refreshProfilePic());
    } catch (error) {
      console.log(error);
    }
  };

  if (!hasPermission || !isFocused) {
    return <View />;
  }

  return (
    <Camera
      type={type}
      flashMode={flashMode}
      ref={(ref) => (cameraRef = ref)}
      style={styles.camera}
    >
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() =>
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            )
          }
          style={styles.button}
        >
          <FontAwesome name="rotate-right" size={25} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFlashMode(
              flashMode === FlashMode.off ? FlashMode.torch : FlashMode.off
            )
          }
          style={styles.button}
        >
          <FontAwesome
            name="flash"
            size={25}
            color={flashMode === FlashMode.off ? "#ffffff" : "#e8be4b"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.snapContainer}>
        <TouchableOpacity onPress={() => cameraRef && takePicture()}>
          <FontAwesome name="circle-thin" size={95} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 50,
  },
  snapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 25,
  },
});
