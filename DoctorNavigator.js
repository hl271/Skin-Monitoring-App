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

import { AuthContext, FirebaseContext, DoctorGlobalState } from './src/Contexts'
import { doctorReducer } from './src/Reducers'
import { createStackNavigator } from '@react-navigation/stack'

const DoctorStack = createStackNavigator()

export default function DoctorNavigator() {
  const authContext = React.useContext(AuthContext)
  const {auth} = React.useContext(FirebaseContext)

  const [doctorInfo, doctorDispatch] = React.useReducer(doctorReducer, {
    fullname: null,
    email: null,
    gender: null,
    birthday: null
  })

  const doctorGlobalState = React.useMemo(() => {
    doctorInfo
  }, [doctorInfo])

  return (
    <DoctorGlobalState.Provider value={doctorGlobalState}>
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
    </DoctorGlobalState.Provider>
  )
}