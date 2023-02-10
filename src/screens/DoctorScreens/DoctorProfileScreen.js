import { Box, NativeBaseProvider, FormControl, VStack } from "native-base";
import React, { useState } from "react";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Header from '../../components/Header'
import TextInput from "../../components/TextInput";
import BackButton from "../../components/BackButton";
import { nameValidator } from '../../helpers/nameValidator'
import { View, Text, ScrollView } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Card } from "react-native-paper";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import { DoctorContext, AuthContext } from "../../Contexts";
import graphqlReq from "../../helpers/graphqlReq";
import app from "../../helpers/firebase";

const storage = getStorage(app)

export default function DoctorProfileScreen({ navigation }) {
    const {doctorInfo, updateProfile} = React.useContext(DoctorContext)
    const {authState} = React.useContext(AuthContext)

    const placeholderURL = 'https://via.placeholder.com/200.jpg'
    const [name, setName] = useState({ value: '', error: '' })
    const [sex, setSex] = useState(null)
    const [birthdate, setBirthday] = useState(null)
    const [date, setDate] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [About, setAbout] = useState("")
    const [Phonenumber, setPhonenumber] = useState({value: '', error: ''})
    const [ProfilePic, setProfilePic] = useState("")
    const [Workaddress, setWorkaddess] = useState("")
    const [email, setEmail] = useState(null)
    // const [image, setImage] = useState(null)


    React.useEffect(() => {
        if (doctorInfo.fullname !== null) {
            // console.log(doctorInfo)
            // console.log("User found")
            setSex(doctorInfo.gender)
            setBirthday(doctorInfo.birthday)
            setName({value: doctorInfo.fullname})
            setAbout(doctorInfo.about)
            setPhonenumber({value: doctorInfo.phonenumber})
            setProfilePic(doctorInfo.profilepicture)
            setWorkaddess(doctorInfo.workaddress)
            setEmail(authState.userEmail)
        }
        
    }, [doctorInfo])
    
    
    const onUpdatePress = async () => {
        // console.log("Hello")
        const nameError = nameValidator(name.value)
        if (nameError) {
            setName({ ...name, error: nameError })
            return
        }
        try {
            setLoading(true)
            console.log("Updating doctor profile")
            //Update user on database
            const query = `mutation MyMutation($doctorid: String!, $about: String!, $birthday: date!, $fullname: String!, $gender: String!, $phonenumber: String!, $profilepicture: String!, $workaddress: String!) {
                update_doctor_by_pk(pk_columns: {doctorid: $doctorid}, _set: {about: $about, birthday: $birthday, fullname: $fullname, gender: $gender, phonenumber: $phonenumber, profilepicture: $profilepicture, workaddress: $workaddress}) {
                  fullname
                  birthday
                  gender
                  workaddress
                  about
                  profilepicture
                  phonenumber
                }
              }`
            const variables = {
                doctorid: authState.userId,
                fullname: name.value,
                birthday: birthdate,
                gender: sex,
                workaddress: !!Workaddress ? Workaddress : "",
                phonenumber: !!Phonenumber.value ? Phonenumber.value : "",
                about: !!About ? About : "",
                profilepicture: !!ProfilePic ? ProfilePic : ""
            }
            const hasuraRes = await graphqlReq(query, {...variables}, authState.userToken)
            // console.log(hasuraRes)
            const updatedDoctor = hasuraRes.data.update_doctor_by_pk
            if ( updatedDoctor== null) throw Error("Update doctor failed")
            console.log("Updated doctor")
            // console.log(updatedDoctor)
            updateProfile(updatedDoctor)
            setLoading(false)
            navigation.navigate('DoctorMainScreen')

        } catch (error) {
            console.log("Error occured while updating profile")
            console.log(error.message)
        }
    }
    const onDateSelected = (event, inputDate) => {
        console.log("Selected date")
        const yyyy = inputDate.getFullYear()
        let mm = inputDate.getMonth()+1
        let dd = inputDate.getDate()
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        const formattedDate = `${yyyy}-${mm}-${dd}`
        console.log(formattedDate)
        setDate(inputDate)
        setBirthday(formattedDate)
        // setDatePicker(false)
    }
    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            onChange: onDateSelected,
            maximumDate: new Date()
        })
    }
    const displayGenderText = () => {
        if (sex == "M") return "Male (M)"
        else if (sex == "F") return "Female (F)"
        else return "Choose gender"
    }
    const displayDateTxt = () => {
        // console.log("birthdate:", birthdate)
        if (birthdate == null) return "Choose birthdate"
        else {
            return birthdate
        }
    }
    const onUploadPicBtnPressed = async () => {
        try {

            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        
            console.log(result);
        
            if (!result.canceled) {
                // setImage(result.assets[0].uri);
                // Compress image
                const manipImgResult = await manipulateAsync(
                    result.assets[0].uri,
                    [],
                    {compress: 0.8, format: SaveFormat.JPEG}
                )
                console.log("compress image to 80%")

                // Upload image to firebase
                const res = await fetch(manipImgResult.uri)
                const imageBlob = await res.blob()  
                const metadata = {
                    contentType:'image/jpeg'
                }
                const storageRef = ref(storage, 'doctor_profilepics/' + authState.userId)
    
                const uploadTask =  uploadBytesResumable(storageRef, imageBlob, metadata)
                uploadTask.on('state_changed', (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                        console.log('Upload is paused');
                        break;
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
                        setProfilePic(downloadURL)
                    })
                })
            }
        } catch (error) {
            console.log("Error occured while uploading image")
            console.log(error.message)
        }
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Header >
                EDIT YOUR PROFILE
            </Header>
            <ScrollView style={{width: '100%'}}>
                <Card style={{marginVertical: 30, width: '80%', alignSelf: 'center'}}>
                    <Card.Cover source={{uri: !!ProfilePic ? ProfilePic : placeholderURL}}></Card.Cover>
                    <Card.Actions >
                        <Button onPress={onUploadPicBtnPressed}>Upload Profile Picture</Button>
                    </Card.Actions>
                </Card>
                <TextInput
                    label="Email"
                    returnKeyType="next"
                    value={email}
                    onChangeText={(text) => setEmail({ value: text, error: '' })}
                    disabled
                    textContentType="emailAddress"                        
                />
                <TextInput
                        label="Full Name"
                        placeholder={name.value}
                        returnKeyType="next"
                        value={name.value}
                        onChangeText={(text) => setName({ value: text, error: '' })}
                        error={!!name.error}
                        errorText={name.error}
                />
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.8}}>
                        <Text>Gender:</Text>

                    </View>
                    <SelectDropdown 
                        defaultButtonText={displayGenderText()}
                        rowStyle={{ margin: 10, flex: 2}}
                        data={["M", "F"]}
                        renderDropdownIcon={()=> {return true}}
                        onSelect={(selectedItem, index) => {
                            // console.log(selectedItem, index)
                            setSex(selectedItem)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            if (selectedItem == "M") return "Male (M)"
                            else if (selectedItem =="F") return "Female (F)"
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            if (item == "M") return "Male (M)"
                            else if (item =="F") return "Female (F)"
                    }}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.8}}>
                        <Text>Birthday:</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <Button
                            compact
                            mode="outlined"
                            onPress={showDatePicker}
                            style={{margin: 12}}
                        >
                            {displayDateTxt()}
                        </Button> 
                    </View>
                </View>
                <TextInput
                    label="Phone Number"
                    placeholder={Phonenumber.value}
                    returnKeyType="next"
                    value={Phonenumber.value}
                    onChangeText={(text) => setPhonenumber({ value: text, error: '' })}
                    error={!!Phonenumber.error}
                    errorText={Phonenumber.error}
                />
                <TextInput
                    label="Work Address"
                    placeholder={Workaddress}
                    returnKeyType="next"
                    value={Workaddress}
                    onChangeText={(text) => setWorkaddess(text)}

                />
                <TextInput
                    label="About"
                    placeholder={About}
                    returnKeyType="next"
                    value={About}
                    onChangeText={(text) => setAbout(text)}
                    multiline
                    numberOfLines={6}
                />
                <Button
                    mode="contained"
                    loading={loading}
                    onPress={onUpdatePress}
                    style={{ marginTop: 24 }}
                >
                    UPDATE PROFILE
                </Button>
            </ScrollView>
        </Background>
    );
};