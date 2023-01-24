import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { useCamera } from 'react-native-camera-hooks';
import Button from '../components/Button';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen( { navigation } ) {

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [{cameraRef}, {takePicture}] = useCamera(null);

    useEffect(()=>{
        (async ()=>{
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus=await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status==='granted');
        })();
    }, [])

    const captureHandle=async ()=>{
        if(cameraRef){
            try{
                const data=await takePicture();
                setImage(data.uri);
            } catch(e)
            {
                console.log(e);
            }
        }
    }

    const saveImage=async () => {
        if(image){
            try{
                await MediaLibrary.createAlbumAsync(image);
                alert('Picture Save!');
                setImage(null);
            } catch(e){
                console.log(e);
            }
        }
    }

    if(hasCameraPermission==false){
        return <Text>No access to camera</Text>
    }

    return (
        <View style={styles.body}>
            {!image ?
            <Camera
                style={styles.camera}
                ref={cameraRef}
                type={type}
                flashMode={flash}
            />
            :
            <Image source={{uri: image}} style={styles.camera}/>
            }


            <View>
                {image ? 
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 50
                }}
                >
                    <TouchableOpacity onPress={()=>setImage(null)} style={styles.button}>
                        <Entypo name={"retweet"} size={28} color={'#f1f1f1'}/>
                        <Text style={styles.text}>Re-take</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={saveImage} style={styles.button}>
                        <Entypo name={"check"} size={28} color={'#f1f1f1'}/>
                        <Text style={styles.text}>Save</Text>
                    </TouchableOpacity> 
                </View>  
                :    
                <TouchableOpacity onPress={captureHandle} style={styles.button}>
                    <Entypo name={"camera"} size={28} color={'#f1f1f1'}/>
                    <Text style={styles.text}>Take a photo</Text>
                </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    body: {
        flex:1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 15
    },
    camera: {
        flex: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#f1f1f1',
        marginLeft: 10
    },
    button: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});