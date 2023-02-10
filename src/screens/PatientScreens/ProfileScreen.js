import { Box, NativeBaseProvider, FormControl, ScrollView, VStack } from "native-base";
import React, { useState } from "react";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Header from '../../components/Header'
import TextInput from "../../components/TextInput";
import BackButton from "../../components/BackButton";
import { View, Text } from "react-native";
import { nameValidator } from '../../helpers/nameValidator'
import SelectDropdown from "react-native-select-dropdown";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { AuthContext, PatientContext } from "../../Contexts";

import graphqlReq from "../../helpers/graphqlReq";

export default function Profile({ navigation }) {
    // console.log(HASURA_GRAPHQL_ENDPOINT)
    const {patientInfo, addNewPatient, updateProfile} = React.useContext(PatientContext)
    const {authState} = React.useContext(AuthContext)
    const [name, setName] = useState({ value: '', error: '' })
    const [sex, setSex] = useState(null)
    const [birthdate, setBirthday] = useState(null)
    const [date, setDate] = useState(new Date())
    const [loading, setLoading] = useState(false)
    
    
    React.useEffect(() => {
        if (patientInfo.fullname !== null) {
            // console.log("User found")
            setSex(patientInfo.gender)
            setBirthday(patientInfo.birthday)
            setName({value: patientInfo.fullname})
        }
        
    }, [patientInfo])
    
    
    const onUpdatePress = async () => {
        // console.log("Hello")
        const nameError = nameValidator(name.value)
        if (nameError) {
            setName({ ...name, error: nameError })
            return
        }
        try {
            setLoading(true)
            //Update user on database
            const query = `mutation MyMutation($patientid: String!, $birthday: date!, $fullname: String!, $gender: String!) {
                update_patient_by_pk(pk_columns: {patientid: $patientid}, _set: {birthday: $birthday, fullname: $fullname, gender: $gender}) {
                  birthday
                  fullname
                  gender
                }
              }`
            const variables = {
                patientid: authState.userId,
                fullname: name.value,
                birthday: birthdate,
                gender: sex
            }
            const hasuraRes = await graphqlReq(query, {...variables}, authState.userToken)
            console.log(hasuraRes)
            const updatedPatient = hasuraRes.data.update_patient_by_pk
            if ( updatedPatient== null) throw Error("Update patient failed")
            console.log("Updated patient")
            // const {birthday, fullname, gender} = updatedPatient
            updateProfile(updatedPatient)
            setLoading(false)
            navigation.navigate('PatientMainScreen')

        } catch (error) {
            console.log("Error occured while updateing profile")
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

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            {/* <View style={{ width: '100%'}}> */}

                <View style={{flex: 1, width: '100%', marginTop: '50%'}}>
                    <Header >
                        EDIT YOUR PROFILE
                    </Header>
                    <View >
                        
                        <Text>Full Name:</Text>
                        <TextInput
                            
                            placeholder={name.value}
                            returnKeyType="next"
                            value={name.value}
                            onChangeText={(text) => setName({ value: text, error: '' })}
                            error={!!name.error}
                            errorText={name.error}
                        />
                        
                    </View>
                    <View style={{ flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
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
                        <View style={{flex: 1}}>
                            <Text>Birthday:</Text>
                        </View>
                        <View style={{flex: 2}}>
                            <Button
                                mode="outlined"
                                onPress={showDatePicker}
                                style={{margin: 12}}
                            >
                                {displayDateTxt()}
                            </Button>
                            
                            

                        </View>
                    </View>
                    <Button
                        mode="contained"
                        loading={loading}
                        onPress={onUpdatePress}
                        style={{ marginTop: 24 }}
                    >
                        UPDATE PROFILE
                    </Button>
                </View>
            {/* </View> */}
        </Background>
    );
};