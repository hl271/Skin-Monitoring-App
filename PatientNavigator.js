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
import { patientReducer, recordReducer, patientAppointmentReducer, doctorListReducer } from './src/Reducers'
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

  const [records, recordsDispatch] = React.useReducer(recordReducer, [])
  const [appointments, appointmentsDispatch] = React.useReducer(patientAppointmentReducer, [])
  const [doctorList, doctorListDispatch] = React.useReducer(doctorListReducer, [])

  const patientContext = React.useMemo(() => ({
    addNewPatient: (newPatient) => {
      patientInfoDispatch({type: ACTION_TYPES.PATIENT.ADD_PATIENT, ...newPatient})
    },
    updateProfile: (birthday, gender, fullname) => {
      patientInfoDispatch({type: ACTION_TYPES.PATIENT.UPDATE_PROFILE, fullname, birthday, gender})
    },
    patientInfo
  }), [patientInfo])

  const recordContext = React.useMemo(() => ({
    records,
    addRecord: (recordObj) => {
      // const {id, pictureurl, accuracy, 
      //       diseasename, realatedinfo, patientid, recordtime} = recordObj
      recordsDispatch({type: ACTION_TYPES.RECORD.ADD_RECORD, ...recordObj})
    }
  }), [records])

  const appointmentContext = React.useMemo(() => ({
    appointments
  }), [appointments])

  const doctorListContext = React.useMemo(() => ({
    doctorList
  }), [doctorList])

  React.useEffect(()=> {
    
  })
  return (
    <PatientContext.Provider value={patientContext}>
      <RecordContext.Provider  value={recordContext}>
        <PatientAppointmentContext.Provider value={appointmentContext}>
          <DoctorListContext.Provider value={doctorListContext}>
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