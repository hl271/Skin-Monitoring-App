import React, { useState } from 'react'
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

import { AuthContext, FirebaseContext, PatientContext, 
  RecordContext, PatientAppointmentContext, DoctorListContext } from './src/Contexts'
import { patientReducer } from './src/Reducers'
import { createStackNavigator } from '@react-navigation/stack'
import ACTION_TYPES from './src/ActionTypes'

const PatientStack = createStackNavigator()

export default function PatientNavigator()  {
  const authContext = React.useContext(AuthContext)
  const {auth} = React.useContext(FirebaseContext)

  const [patientInfo, patientInfoDispatch] = React.useReducer(patientReducer, {
    fullname: null,
    email: null,
    gender: null,
    birthday: null
  })

  const patientContext = React.useMemo(() => ({
    addNewPatient: (email, fullname) => {
      patientInfoDispatch({type: ACTION_TYPES.PATIENT.ADD_PATIENT, email, fullname})
    },
    patientInfo
  }), [patientInfo])

  React.useEffect(()=> {
    
  })
  return (
    <PatientContext.Provider value={patientContext}>
      <RecordContext.Provider >
        <PatientAppointmentContext.Provider>
          <DoctorListContext.Provider>
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

          </DoctorListContext.Provider>
        </PatientAppointmentContext.Provider>
      </RecordContext.Provider>
    </PatientContext.Provider>
  )
}