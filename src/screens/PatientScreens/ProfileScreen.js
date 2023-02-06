import { Box, NativeBaseProvider, FormControl, ScrollView, VStack } from "native-base";
import React, { useState } from "react";
import Button from "../../components/Button";
import Background from "../../components/Background";
import Header from '../../components/Header'
import TextInput from "../../components/TextInput";
import BackButton from "../../components/BackButton";
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { nameValidator } from '../../helpers/nameValidator'
import { RadioButton } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

import { AuthContext, PatientContext } from "../../Contexts";

import {HASURA_GRAPHQL_ENDPOINT} from '@env'

export default function Profile({ navigation }) {
    // console.log(HASURA_GRAPHQL_ENDPOINT)
    const {patientInfo, addNewPatient, updateProfile} = React.useContext(PatientContext)
    const {authState} = React.useContext(AuthContext)
    const [name, setName] = useState({ value: '', error: '' })
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [sex, setSex] = useState(null)
    const [birthdate, setBirthdate] = useState(null)

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching patient info...")
                const query = `query MyQuery($patientid: String!) {
                    patient_by_pk(patientid: $patientid) {
                      birthday
                      email
                      fullname
                      gender
                    }
                  }
                  `
                const graphqlReq = {
                    query,
                    variables: {
                        patientid: authState.userId
                    }
                }
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
                const patientResult = hasuraRes.data.patient_by_pk
                if (patientResult == null) throw Error("Patient Result not found!")
                console.log("Fetched patient info")
                console.log(patientResult)
                addNewPatient(patientResult)
                setSex(patientInfo.gender)
                setBirthdate(patientInfo.birthday)
                setName({value: patientInfo.fullname})
                console.log(patientInfo)
            } catch(error) {
                console.log("Error occured while fetch user")
                console.log(error.messsage)
            }
        }
        if (!patientInfo.fullname) fetchUser()
    }, [])

    const onUpdatePress = () => {
        const nameError = nameValidator(name.value)
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        if (emailError || passwordError || nameError) {
            setName({ ...name, error: nameError })
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            return
        }
        navigation.navigate('PatientMainScreen')
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
        
            <Header >
                EDIT YOUR PROFILE
            </Header>
            <TextInput
                label={name.value}
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({ value: text, error: '' })}
                error={!!name.error}
                errorText={name.error}
            />
            <SelectDropdown 
              rowStyle={{ margin: 10}}
              data={["M", "F"]}
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
            <Button
                mode="contained"
                onPress={onUpdatePress}
                style={{ marginTop: 24 }}
            >
                UPDATE PROFILE
            </Button>
        </Background>
    );
};