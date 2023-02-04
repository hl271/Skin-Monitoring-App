import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Text } from 'react-native-paper'
import Background from './src/components/Background'
import Header from './src/components/Header'
import Button from './src/components/Button'
import BackButton from './src/components/BackButton'
import {
  PatientMainScreen,
  CameraScreen,
  ProfileScreen,
  ResultScreen,
  DoctorsListScreen,
  AppointmentDetailScreen,
  HistoryScreen,
  DetectionHistoryScreen,
  AppointmentHistoryScreen,
} from './src/screens'

import { AuthContext, FirebaseContext, PatientGlobalState } from './src/Contexts'
import { patientReducer } from './src/Reducers'

const PatientStack = createStackNavigator()

export default function PatientNavigator()  {
  const authContext = React.useContext(AuthContext)
  const {auth} = React.useContext(FirebaseContext)

  const [patientInfo, patientDispatch] = React.useReducer(patientReducer, {
    fullname: null,
    email: null,
    gender: null,
    birthday: null
  })

  const patientGlobalState = React.useMemo(() => {
    patientInfo
  }, [patientInfo])

  React.useEffect(()=> {
    const fetchPatient = async (email) => {
      try {
        const query = `query findPatientByEmail($email: String!) {
          patient(where: {email: {_eq: $email}}) {
            patientid
            gender
            fullname
            email
            birthday
          }
        }`
        const graphqlReq = { "query": query, "variables": { "email": email} }
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
      } catch (error) {
        
      }
    }
    fetchPatient()
  })
  return (
    <PatientGlobalState.Provider value={patientGlobalState}>
      <PatientStack.Navigator
        initialRouteName="PatientMainScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <PatientStack.Screen name="PatientMainScreen" component={PatientMainScreen} />
        <PatientStack.Screen name="CameraScreen" component={CameraScreen} />
        <PatientStack.Screen name="ProfileScreen" component={ProfileScreen} />
        <PatientStack.Screen name="ResultScreen" component={ResultScreen} />
        <PatientStack.Screen name="DoctorsListScreen" component={DoctorsListScreen} />
        <PatientStack.Screen name="AppointmentDetailScreen" component={AppointmentDetailScreen} />
        <PatientStack.Screen name="HistoryScreen" component={HistoryScreen} />
        <PatientStack.Screen name="DetectionHistoryScreen" component={DetectionHistoryScreen} />
        <PatientStack.Screen name="AppointmentHistoryScreen" component={AppointmentHistoryScreen} />
      </PatientStack.Navigator>
    </PatientGlobalState.Provider>
  )
}