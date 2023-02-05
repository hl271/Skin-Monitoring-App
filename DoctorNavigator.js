import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import Background from './src/components/Background'
import Header from './src/components/Header'
import Button from './src/components/Button'
import BackButton from './src/components/BackButton'
import {
  DoctorMainScreen,
  ScheduleScreen,
  AddNewScheduleScreen,
  MyAppointmentScreen
} from './src/screens'

import { AuthContext, FirebaseContext, DoctorContext, 
        DoctorAppointmentContext } from './src/Contexts'
import { doctorReducer } from './src/Reducers'
import { createStackNavigator } from '@react-navigation/stack'
import ACTION_TYPES from './src/ActionTypes'

const DoctorStack = createStackNavigator()

export default function DoctorNavigator() {
  // console.log("doctor stack navigator")
  const authContext = React.useContext(AuthContext)
  const {auth} = React.useContext(FirebaseContext)

  const [doctorInfo, doctorInfoDispatch] = React.useReducer(doctorReducer, {
    fullname: null,
    email: null,
    gender: null,
    birthday: null
  })

  const doctorContext = React.useMemo(() => ({
    addNewDoctor: (email, fullname) => {
      doctorInfoDispatch({type: ACTION_TYPES.DOCTOR.ADD_DOCTOR, email, fullname})
    },
    doctorInfo
  }), [doctorInfo])

  /* (doctorstacknav [=> doctormainscreen ]
  => doctorstacknav useEffect = change doctorcontext 
  => rerender doctorstacknav[, doctormainscreen]) => ...infinite loop
  The Problem might be: the doctorcontext, due to if conditions, 
  change in every re-render of this component without a break condition
  
  if (authContext.authState.signedIn) {
    const userFullName = authContext.authState.userFullName
    const userEmail = authContext.authState.userEmail
    console.log("authContext signed In")
    doctorContext.addNew("abc@gmail.com", "Lan")
  }
  */
  
  React.useEffect(() =>{

  })

  return (
    <DoctorContext.Provider value={doctorContext}>
      <DoctorStack.Navigator 
        initialRouteName="DoctorMainScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <DoctorStack.Screen name="DoctorMainScreen" component={DoctorMainScreen} />
        <DoctorStack.Screen name="ScheduleScreen" component={ScheduleScreen} />
        <DoctorStack.Screen name="AddNewScheduleScreen" component={AddNewScheduleScreen} />
        <DoctorStack.Screen name="MyAppointmentScreen" component={MyAppointmentScreen} />
        
      </DoctorStack.Navigator>
    </DoctorContext.Provider>
  )
}