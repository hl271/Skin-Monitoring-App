import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Buttone from '../../components/Buttone';

import app from '../../helpers/firebase'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'

import { AuthContext, PatientGlobalState } from '../../Contexts';

const storage = getStorage(app)

export default function CameraScreen({ navigation }) {
  
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageURI, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    setCurrentDate(
      date + '/' + month + '/' + year 
      + ' ' + hours + ':' + min
    );
  }, []);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (imageURI) {
      try {
        // const asset = await MediaLibrary.createAssetAsync(image); 
        //Convert imageURI to blob 
        const res = await fetch(imageURI)
        const imageBlob = await res.blob()  
        // Upload image to firebase storage
        const metadata = {
          contentType:'image/jpeg'
        }
        const storageRef = ref(storage, 'records/' + currentDate)
        const uploadTask = uploadBytesResumable(storageRef, imageBlob, metadata)
        uploadTask.on('state_changed', (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            // case 'running':
            //   console.log('Upload is running');
            //   break;
          }
        }, (error) => {
          console.log("Error occured while upload image" )
          console.log(error)
          switch (error.code) {
            case 'storage/unauthorized':
              console.log("User doesn't have permission to access the object")
              break;
            case 'storage/canceled':
              console.log("User canceled the upload")
              break;
            case 'storage/unknown':
              console.log("Unknown error occurred, inspect error.serverResponse")
              break;
        
          }
        }, () => {
          //Upload completed successfully
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL)
          })
        })
        navigation.navigate('ResultScreen', { imageURI, currentDate });
        console.log("take photo successfully");
      } catch (error) {
        console.log("Error occured while uploading image")
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!imageURI ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}
          >
            <Buttone
              title=""
              icon="retweet"
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />
            <Buttone
              onPress={() =>
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }
              icon="flash"
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: imageURI }} style={styles.camera} />
      )}

      <View style={styles.controls}>
        {imageURI ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
            <Buttone
              title="Re-take"
              onPress={() => setImage(null)}
              icon="retweet"
            />
            <Buttone title="Save" onPress={savePicture} icon="check" />
          </View>
        ) : (
          <Buttone title="Take a picture" onPress={takePicture} icon="camera" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000',
    padding: 8,
  },
  controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
});