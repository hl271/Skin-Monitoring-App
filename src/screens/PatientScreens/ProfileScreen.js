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

import { AuthContext, PatientContext } from "../../Contexts";

export default function Profile({ navigation }) {
    const {patientInfo, addNewPatient, updateProfile} = React.useContext(PatientContext)
    const {authState} = React.useContext(AuthContext)
    const [name, setName] = useState({ value: '', error: '' })
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })

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
            } catch(error) {
                console.log("Error occured while fetch user")
                console.log(error.messsage)
            }
        }
        if (patientInfo.fullname == null) fetchUser()
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
                label="Full Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({ value: text, error: '' })}
                error={!!name.error}
                errorText={name.error}
            />
            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
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