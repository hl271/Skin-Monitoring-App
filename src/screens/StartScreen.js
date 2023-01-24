import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>Skin-Disease Detection</Header>
      <Paragraph>
        Welcome to our Skin-Disease Detection.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('DoctorLoginScreen')}
      >
        Login as a Doctor
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('PatientLoginScreen')}
      >
        Login as a Patient
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
}
