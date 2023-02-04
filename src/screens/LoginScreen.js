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
export default function LoginScreen({ navigation }) {
  const authContext = React.useContext(AuthContext)  
  const {auth} = React.useContext(FirebaseContext)

  const [per, setPer] = useState("doctor")
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

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
      const res = await signInWithEmailAndPassword(auth, email.value, password.value)
      
    } catch(error) {
      console.log("Error occured while sign in")
      console.log("Error code: ", error.code)
      console.log("Error message: ",error.message)
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
      <Button mode="contained" onPress={onLoginPressed}>
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
