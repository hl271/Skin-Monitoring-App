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

import {AuthContext, FirebaseContext} from '../Contexts'

// import app from '../helpers/firebase'
import {getAuth, createUserWithEmailAndPassword, deleteUser} from 'firebase/auth';

// const auth = getAuth(app)
// const database = getDatabase(app)

import {AUTH_API, X_HASURA_ADMIN_SECRET, HASURA_GRAPHQL_ENDPOINT} from "@env"

export default function RegisterScreen({ navigation }) {
  // console.log(AUTH_API)
  // console.log(HASURA_GRAPHQL_ENDPOINT)
  const authContext = React.useContext(AuthContext)  
  const {auth, app} = React.useContext(FirebaseContext)

  const [per, setPer] = useState("doctor")
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [formError, setFormError] = useState("")

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

  const onSignUpPressed = async () => {
    try {
      if (!isFormValidated()) return
      console.log(`Email: ${email.value}`)
      console.log(`Password: ${password.value}`)
      
      // Create new user using firebase 
      authContext.signingIn(true)
      const res = await createUserWithEmailAndPassword(auth, email.value, password.value)
      const userToken = await res.user.getIdToken()
      // Update Custom Claims of User on Server
      // console.log(HASURA_GRAPHQL_ENDPOINT)
      console.log(AUTH_API)
      console.log(`${AUTH_API}/set-custom-claims`)
      let claimsRes = await fetch(`${AUTH_API}/set-custom-claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userToken: userToken,
          userRole: per
        })
      })
      const newToken = await auth.currentUser.getIdToken(true)
      const idTokenResult = await auth.currentUser.getIdTokenResult()
      const hasuraClaim =
            idTokenResult.claims["https://hasura.io/jwt/claims"];
      if (!hasuraClaim) throw Error("Hasura Claims not exist!")
      const userId = idTokenResult.claims.user_id
      if (!userId) throw Error("UserId not exist!")
      // console.log(idTokenResult)
      // if (idTokenResult.uid) throw Error("User id not exists")
      // console.log("User id exists!!")
      const userFullName = name.value
      const userRole = per.toLowerCase()
      const userEmail = email.value;
      const upsertQuery = `
      mutation($userEmail: String!, $userFullName: String!, $${userRole}id: String!){
        insert_${userRole}_one(object: {${userRole}id: $${userRole}id, fullname: $userFullName, email: $userEmail }) {
          ${userRole}id,
          email
        }
      }`      
      const graphqlReq = { 
        "query": upsertQuery, 
        "variables": { 
          "userFullName": userFullName, 
          "userEmail":  userEmail,
          [`${userRole}id`]: userId
        } 
      }
      console.log(`${HASURA_GRAPHQL_ENDPOINT}`)
      // console.log(graphqlReq)
      let hasuraRes = await fetch(`${HASURA_GRAPHQL_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'content-type' : 'application/json', 
          'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
        },
        body: JSON.stringify(graphqlReq)
      })
      hasuraRes = await hasuraRes.json()
      if (hasuraRes["errors"]) throw Error("Error from GraphQL Server")
      // console.log(hasuraRes)
      
      authContext.signIn(userRole, userId, newToken, userEmail, userFullName)    
    } catch (error) {
      console.log("Error occured while register")
      if (error.code && error.code == "auth/email-already-in-use") {
        setEmail({ ...email, error: "Email already exists! Please choose another email" })
        return
      } else {
        console.log(error.message)
        setFormError("Server Error. Please try again or try another account!")
      }      
      console.log("delete user...")
      const deletingUser = getAuth().currentUser
      deleteUser(deletingUser).then(() => {
        console.log("Deleted user from firebase!")
      })

    } finally {
      authContext.signingIn(false)
    }
    
  }
  // if (authContext.authState.isSigningIn) {
  //   console.log("isSigningIn true")
  // } else console.log("isSigningIn false")

  useEffect(() => {
    
  }, [])
  
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
      <Text style= {{color: 'red'}}>{formError}</Text>
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
        loading={authContext.authState.isSigningIn}
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
