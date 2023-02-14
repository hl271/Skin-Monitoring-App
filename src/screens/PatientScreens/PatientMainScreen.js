import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import BackButton from '../../components/BackButton'

import { signOut } from 'firebase/auth'

import { AuthContext, FirebaseContext, PatientContext } from '../../Contexts'

export default function PatientMainScreen({ navigation }) {
  const authContext = React.useContext(AuthContext)
  const {patientInfo, 
        addNewPatient} = React.useContext(PatientContext)
  const {auth} = React.useContext(FirebaseContext)

  
  const onSignOutPressed = async() => {
    try {
      const res = await signOut(auth)
      authContext.signOut()
    } catch (error) {
      console.log("Error while sign out")
      console.log(error.message)
    }
  }
  

  const name= <Text>{patientInfo.fullname}</Text>;

  return (
    <Background>
      <Header>Hello { name },</Header>
      <Button
        mode='outlined'
        icon="camera"
        onPress={() => {navigation.navigate('CameraScreen')}}
      >
          Take skin's photo
      </Button>
      <Button
        mode='outlined'
        icon="account-circle"
        onPress={() => {navigation.navigate('ProfileScreen')}}
      >
          Edit profile
      </Button>
      <Button
        mode='outlined'
        icon="view-list"
        onPress={()=>{navigation.navigate('AppointmentHistoryScreen')}}
      >
          My Appointments
      </Button>
      <Button
        mode='outlined'
        icon="view-list"
        onPress={()=>navigation.navigate('DetectionHistoryScreen')}
      >
          My detection history
      </Button>
      <Button
        mode='outlined'
        onPress={onSignOutPressed}
      >
          Sign Out
      </Button>
    </Background>
  )
}