import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from 'react-native-maps';

import firebase from "firebase";

export default class CustomActions extends React.Component {
  constructor() {
    super();
  }
  /**
   * requests permission and allows user to pick image from library, then sends url to uploadImage and onSend
   * @async
   * @function pickImage
   *
   */
  async pickImage() {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  /**
   * requests permission & allows the user to take photo, then sends url to uploadImage and onSend
   * @async
   * @function takePhoto
   *
   */
  async takePhoto() {
    try {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );

      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          const imageUrlLink = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrlLink });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Upload image as Blob(binary large object) to Firebase storage
  /**
  * Uploading the image as blob to cloud storage
  * @async
  * @function uploadImage
  * @param {string}
  * @returns {string} imageURL
  */
  async uploadImage(uri) {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = error => {
          console.error(error);
          reject(new TypeError("Network Request Failed!"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      const getImageName = uri.split("/");
      const imageArrayLength = getImageName[getImageName.length - 1];
      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imageArrayLength}`);
      // console.log(ref, getImageName[imageArrayLength]);
      const snapshot = await ref.put(blob);
      blob.close();
      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    } catch (error) {
      console.log(error.message);
    }
  }
  /**
   * Requests permission for location, then sends location to onSend
   * @async
   * @function getLocation
   * @returns {Promise<number>}
   */
  async getLocation() {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === "granted") {
        // const location = await Location.getCurrentPositionAsync({}).catch(error =>
        // 	console.log(error),
        // );
        const location = await Location.getCurrentPositionAsync({});

        if (location) {
          this.props.onSend({
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude
            }
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  /**
   * @function onActionPress
   * @returns {actionSheet}
   */
  onActionPress = () => {
    const options = [
      "Select Image from Library",
      "Take a Photo",
      "Share Location",
      "Cancel"
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            //console.log('pick image from library');
            return this.pickImage();
          case 1:
            //console.log('take photo');
            return this.takePhoto();
          case 2:
            //console.log('get location');
            return this.getLocation();
          default:
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel='Click for options'
        style={[styles.container]}
        onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "transparent",
    textAlign: "center"
  }
});
CustomActions.contextTypes = {
  actionSheet: PropTypes.func
};