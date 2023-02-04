import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
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
import { NativeBaseProvider, Radio, Box, ListItem, Stack } from 'native-base'
import Paragraph from '../components/Paragraph'

import {AuthContext, FirebaseContext} from '../Contexts'

import {signInWithEmailAndPassword} from 'firebase/auth'

import {AUTH_API_NGROK, X_HASURA_ADMIN_SECRET, HASURA_GRAPHQL_ENDPOINT} from "@env"

export default function LoginScreen({ navigation }) {
  const authContext = React.useContext(AuthContext)  
  const {auth} = React.useContext(FirebaseContext)

  const [per, setPer] = useState("doctor")
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [formError, setFormError] = useState("")

  const isFormValidated = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return false
    }
    return true
  }
  const onLoginPressed = async () => {
    try {
      if (!isFormValidated()) return
      console.log(`Email: ${email.value}`)
      console.log(`Password: ${password.value}`)

      //Sign in user with firebase auth
      console.log("signing In...")
      authContext.signingIn(true)
      const res = await signInWithEmailAndPassword(auth, email.value, password.value)
      const userToken = await res.user.getIdToken()
      const idTokenResult = await res.user.getIdTokenResult();  
      // console.log("tokenresult: ", idTokenResult)
      
      const hasuraClaim =
        idTokenResult.claims["https://hasura.io/jwt/claims"];

      if (!hasuraClaim) throw "Hasura claims NOT exists"

      console.log("Hasura claims exists")

      const query = `query findUserByEmail($email: String!) {
        doctor(where: {email: {_eq: $email}}) {
          fullname
        }
        patient(where: {email: {_eq: $email}}) {
          fullname
        }
      }`

      const graphqlReq = { "query": query, "variables": { "email": email.value} }
      let hasuraRes = await fetch(`${HASURA_GRAPHQL_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'content-type' : 'application/json', 
          'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
        },
        body: JSON.stringify(graphqlReq)
      })
      hasuraRes = await hasuraRes.json()
      console.log("Fetched user on hasura")
      let role, userFullName
      if (hasuraRes.data.doctor.length > 0) {
        role = "doctor"
        userFullName = hasuraRes.data.doctor[0].fullname
      }
      else if (hasuraRes.data.patient.length > 0) {
        role = "patient"
        userFullName = hasuraRes.data.patient[0].fullname
      }
      else throw "No user found on Hasura" 
      console.log("Logged in as ", role)
      
      authContext.signIn(role, userToken, email.value, userFullName)
      
    } catch(error) {
      console.log("Error occured while sign in")
      if (!!error.code && error.code == "auth/wrong-password") {
        setPassword({value:'', error: "Wrong Password!"})
      } else if (error.code == "auth/user-not-found") {
        setEmail({value: '', error: "Email doesn't exists!"})
      } else {
        console.log(error)
        setFormError("Server Error. Please try again or try another account!")
      }
    } finally {
      authContext.signingIn(false)
    }
    
  }

  return (
    <NativeBaseProvider>
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Login as</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" loading={authContext.authState.isSigningIn} onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
