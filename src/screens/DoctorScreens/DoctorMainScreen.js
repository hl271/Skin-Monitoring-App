import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import BackButton from '../../components/BackButton'

import { signOut } from 'firebase/auth'

import { AuthContext, FirebaseContext, DoctorContext } from '../../Contexts'
import { doctorReducer } from '../../Reducers'

export default function DoctorMainScreen({ navigation }) {
  // console.log("doctormainscreen")
  const authContext = React.useContext(AuthContext)
  const {doctorInfo, addNewDoctor} = React.useContext(DoctorContext)
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
  
  React.useEffect(() => {
    
   
  }, [])
  
  const name= <Text>{doctorInfo.fullname}</Text>;
  // const name= <Text>Something</Text>;
  
  return (
    <Background>
      <Header>Hello { name },</Header>
      <Button
        mode='outlined'
        icon="calendar-month"
        onPress={() => {navigation.navigate('ScheduleScreen')}}
      >
          My Appontments
      </Button>
      
      <Button
        mode='outlined'
        icon="account-circle"
        onPress={()=>{navigation.navigate('DoctorProfileScreen')}}
      >
          Edit Profile
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