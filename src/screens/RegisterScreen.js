import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { NativeBaseProvider, Radio, Box, ListItem, Stack } from 'native-base'

import app from '../helpers/firebase'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getDatabase, ref, onValue} from 'firebase/database';
// import { onAuthStateChanged } from 'firebase/auth'

const auth = getAuth(app)
const database = getDatabase(app)

import {AUTH_API_NGROK} from "@env"

export default function RegisterScreen({ navigation }) {
  const apiURL = `${AUTH_API_NGROK}/setCustomClaims`

  const [per, setPer] = useState("doctor")
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loggedIn, setLoggedIn] = useState(false)

  const isFormValidated = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return false
    }
    return true
  }

  const onSignUpPressed = () => {
    if (!isFormValidated()) return
    console.log(`Email: ${email.value}`)
    console.log(`Password: ${password.value}`)
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(res => {
      return res.user.getIdToken()
    })
    .then(UserToken => {
      
      console.log("Create user successfully!")
      console.log(`AUTH_API_NGROK: ${apiURL}`)
      // Update Custom Claims of User on Lambda Server
      fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userToken: UserToken,
          userRole: per
        })
      })
      .then(res => {
          console.log("Create custom claims successfully")
          console.log(res.json())
        })
      .catch(error => {
        console.log("Error while sending custom claims request")
        console.log(error.message)
      })
    })
    .catch(error => {
      console.log("Error while creating new user")
      console.log(error.message)
    })    
    
  }

  useEffect(() => {
    return auth.onAuthStateChanged(async user => {
      console.log("Detect auth state change")
      // console.log(user)
      user.getIdToken()
      try {
        if (user) {          
          const token = await user.getIdToken();
          const idTokenResult = await user.getIdTokenResult();  
          // console.log("tokenresult: ", idTokenResult)
          const hasuraClaim =
            idTokenResult.claims["https://hasura.io/jwt/claims"];
  
          if (hasuraClaim) {
            setLoggedIn(true);
          } else {
            // Check if refresh is required.
            const metadataRef = ref(database, "metadata/" + user.uid + "/refreshTime");
            onValue(metadataRef, async (data) => {
              if(!data.exists) return
              // Force refresh to pick up the latest custom claims changes.
              const token = await user.getIdToken(true);
              setLoggedIn(true);
            });
          }
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.log("Error occured!")
        console.log(error)
      }
    });
  }, [])

  if (loggedIn) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'PatientMainScreen' }],
    })
  }
  return (
    <NativeBaseProvider>
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <Radio.Group name="permission" accessibilityLabel='person' value={per} onChange={nextValue=>{setPer(nextValue);}}>
         <Stack direction={{
            base: "row",
            md: "row"
          }} alignItems={{
            base: "flex-start",
            md: "center"
          }} space={4} w="75%" maxW="300px">
          <Radio value="doctor" my={1}>
            Doctor
          </Radio>
          <Radio value="patient" my={1}>
            Patient
          </Radio>
         </Stack>
      </Radio.Group>
      <TextInput
        label="Name"
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
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
