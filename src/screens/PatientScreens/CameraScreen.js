import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Buttone from '../../components/Buttone';
import { RadioButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import SelectDropdown from 'react-native-select-dropdown';
import uuid from 'react-uuid'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import axios from 'axios';

import app from '../../helpers/firebase'
import { getAuth } from 'firebase/auth';
import {getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes} from 'firebase/storage'

import { AuthContext, RecordContext } from '../../Contexts';
import {AI_API, HASURA_GRAPHQL_ENDPOINT} from '@env'

const storage = getStorage(app)

export default function CameraScreen({ navigation }) {
  // console.log(AI_API)
  const {authState} = React.useContext(AuthContext)
  const recordContext = React.useContext(RecordContext)

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageURI, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(null);

  const [sex, setSex] = useState("male")
  const bodyLocations = ['back', 'lower extremity', 'upper extremity', 'abdomen', 'face', 'chest', 'foot', 'unknown', 'neck', 'scalp', 'hand', 'ear', 'genital', 'acral']
  const [bodyLoc, setBodyLoc] = useState(null)
  const [age, setAge] = useState(20)

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
        // const userToken = getAuth().currentUser.getIdToken()
        console.log(currentDate)
        //Compress image
        const manipImgResult = await manipulateAsync(
          imageURI,
          [{resize: {height: 900}}],
          {compress: 0.5, format: SaveFormat.JPEG}
        )
        setImage(manipImgResult.uri)
        // console.log(imageURI)
        console.log("Resize image to fix height of 900px and compress to 50%")
        const res = await fetch(imageURI)
        const imageBlob = await res.blob()  
        // Upload image to AI API to detect result
        const formData = new FormData()
        formData.append("files", {
          type: 'image/jpeg',
          name: 'random',
          uri: imageURI
        })
        const imageId = uuid()
        const uploadRes = await fetch(`${AI_API}/upload/${imageId}`, {
          method: 'POST',
          body: formData
        })
        console.log(uploadRes.text())
        const sentObj = {
          path: `${imageId}`,
          sex: sex,
          age: age,
          local: bodyLoc
        }
        console.log(sentObj)
        let diagnosisRes = await fetch(`${AI_API}/diagnosis`, {
          method: 'POST',
          body: JSON.stringify(sentObj),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        diagnosisRes = await diagnosisRes.json()
        console.log(diagnosisRes)
        // Take the result with highest accuracy
        let highestAcc = 0
        let highestResult
        for (const key in diagnosisRes) {
          if (diagnosisRes[key] > highestAcc) {
            highestResult = key
            highestAcc = diagnosisRes[key]
          } 
        }
        console.log("Highest result: ", highestResult)
        console.log("Highest Acc:", highestAcc)
        //Fetch Disease Info in database
        const query = `query MyQuery($name: String!) {
          disease(where: {diseasename: {_eq: $name}}) {
            diseaseid
            diseasename
            relatedinfo
          }
        }
        `
        const graphqlReq = {
          "query": query,
          "variables": {
            "name": highestResult
          }
        }
        console.log(graphqlReq)
        let hasuraRes = await fetch(`${HASURA_GRAPHQL_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'content-type' : 'application/json', 
            'Authorization': "Bearer " + authState.userToken
          },
          body: JSON.stringify(graphqlReq)
        })
        hasuraRes = await hasuraRes.json()
        if (hasuraRes["errors"]) {
          console.log(hasuraRes)
          throw Error("Error from GraphQL Server")
        }
        if (hasuraRes.data.disease.length == 0) throw Error("No disease found")
        console.log("Found disease!")
        console.log(hasuraRes.data.disease[0] )
        const diseaseResult = hasuraRes.data.disease[0] 
        const {diseaseid, diseasename, relatedinfo} = diseaseResult
        // Upload image to firebase storage
        const metadata = {
          contentType:'image/jpeg'
        }
        const storageRef = ref(storage, 'records/' + currentDate)

        const uploadTask =  uploadBytesResumable(storageRef, imageBlob, metadata)
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
        },  () => {
          //Upload completed successfully
          getDownloadURL(uploadTask.snapshot.ref)
          .then( async (downloadURL) => {
            try {

              console.log("File available at", downloadURL)
  
              // Upload new record to database
              const uploadQuery = `mutation MyMutation($accuracy: numeric!, $diseaseid: Int!, $patientid: String!, $recordtime: timestamp!, $pictureurl: String!) {
                insert_record_one(object: {accuracy: $accuracy, diseaseid: $diseaseid, patientid: $patientid, pictureurl: $pictureurl, recordtime: $recordtime}) {
                  recordid
                  recordtime
                }
              }
              `
              const graphQLReqUpload = {
                "query": uploadQuery,
                "variables": {
                  diseaseid,
                  accuracy: highestAcc,
                  patientid: authState.userId,
                  pictureurl: downloadURL,
                  recordtime: currentDate
                }
              }
              let hasuraResUpload = await fetch(`${HASURA_GRAPHQL_ENDPOINT}`, {
                method: 'POST',
                headers: {
                  'content-type' : 'application/json', 
                  'Authorization': "Bearer " + authState.userToken
                },
                body: JSON.stringify(graphQLReqUpload)
              })
              hasuraResUpload = await hasuraResUpload.json()
              if (hasuraResUpload["errors"]) {
                console.log(hasuraResUpload)
              }
              if (hasuraResUpload.data.insert_record_one == null) throw Error("Failed to insert record")
              console.log("Insert record success")
              console.log(hasuraResUpload)
              const recordResult = {
                recordid: hasuraResUpload.data.insert_record_one.recordid,
                pictureurl: downloadURL,
                accuracy: highestAcc,
                disease: {
                  diseaseid: diseaseid,
                  diseasename: diseasename,
                  relatedinfo: relatedinfo,
                },
                patientid: authState.userId,
                recordtime: hasuraResUpload.data.insert_record_one.recordtime
              }
              recordContext.addRecord(recordResult)
              console.log("Routing to ResultScreen...");
              navigation.navigate('ResultScreen', { record: recordResult });
            } catch(err) {
              console.log("error occured while insert new record")
              console.log(err.message)
            }
          })
        })
      } catch (error) {
        console.log("Error occured while uploading image")
        console.log(error.message);
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

        <View style={styles.parametersPanel}>
          <View style={styles.rowsPanel}>
            <Text style={{color: '#fff', flex: 1}}>Select Sex: </Text>
            <View style={{flex: 2, flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <RadioButton style={{flex: 1}} value="male"
                              status={ sex === 'male' ? 'checked' : 'unchecked' }
                              onPress={() => setSex('male')} />
                <Text style={{color: '#fff', flex: 1.5}}>Male</Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1}}>
              <RadioButton style={{flex: 1}} value="female" 
                          status={ sex === 'female' ? 'checked' : 'unchecked' }
                          onPress={() => setSex('female')}/>
                <Text style={{color: '#fff', flex: 1.5}}>Female</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowsPanel}>
            <Text style={{color: '#fff', flex: 1}}>Select age:</Text>
            <View style={{flex: 2}}>
              <Text style={{color: '#fff', textAlign: 'center'}}>{age}</Text>
              <Slider
                
                minimumValue={0}
                maximumValue={85}
                step={1}
                value={age}
                onValueChange={(newAge) => setAge(newAge)}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
              />
            </View>
          </View>
          <View style={styles.rowsPanel}>
            <Text style={{color: '#fff', flex: 2}}>Choose skin location:</Text>
            <SelectDropdown 
              rowStyle={{flex: 3, marginVertical: 10}}
              data={bodyLocations}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem, index)
                setBodyLoc(selectedItem)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>
        </View>
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
  parametersPanel: {
    flex: 1.5,

  },
  rowsPanel: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  }
});