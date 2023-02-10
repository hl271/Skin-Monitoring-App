import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import Background from './components/Background'
import Header from './components/Header'
import Button from './components/Button'
import BackButton from './components/BackButton'
import {
  DoctorMainScreen,
  ScheduleScreen,
  AddNewScheduleScreen,
  MyAppointmentScreen,
  DoctorProfileScreen
} from './screens'

import { AuthContext, FirebaseContext, DoctorContext, 
        DoctorAppointmentContext } from './Contexts'
import { doctorReducer, doctorAppointmentReducer } from './Reducers'
import { createStackNavigator } from '@react-navigation/stack'
import ACTION_TYPES from './ActionTypes'
import graphqlReq from './helpers/graphqlReq'

const DoctorStack = createStackNavigator()

export default function DoctorNavigator() {
  // console.log("doctor stack navigator")
  const authContext = React.useContext(AuthContext)
  const {authState} = authContext
  const {auth} = React.useContext(FirebaseContext)

  const [doctorInfo, doctorInfoDispatch] = React.useReducer(doctorReducer, {
    fullname: null,
    email: null,
    gender: null,
    birthday: null,
    about: null,
    profilepicture: null,
    phonenumber: null,
    workaddress: null
  })

  const [appointdates, appointmentDispatch] = React.useReducer(doctorAppointmentReducer, [])

  const doctorContext = React.useMemo(() => ({
    addNewDoctor: (doctor) => {
      doctorInfoDispatch({type: ACTION_TYPES.DOCTOR.ADD_DOCTOR, payload: {...doctor}})
    },
    updateProfile: (updatedDoctor) => {
      doctorInfoDispatch({type: ACTION_TYPES.DOCTOR.UPDATE_PROFILE, payload: {...updatedDoctor}})
    },
    doctorInfo
  }), [doctorInfo])

  const appointmentContext = React.useMemo(() => ({
    appointdates,
    addAppointDate: ({appointdateid, appointdate}) => {
      appointmentDispatch({type: ACTION_TYPES.DOCTOR_APPOINTMENT.ADD_APPOINT_DATE, appointdateid, appointdate})
    },
    addAppointTime: (appointdateid, appointtime) => {
      appointmentDispatch({type: ACTION_TYPES.DOCTOR_APPOINTMENT.ADD_APPOINT_TIME, appointdateid, appointtime: {...appointtime}})
    }
  }), [appointdates])

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
    const fetchUser = async () => {
      try {
          console.log("Fetching doctor info...")
          const query = `query MyQuery($doctorid: String!) {
              doctor_by_pk(doctorid: $doctorid) {
                about
                birthday
                fullname
                gender
                phonenumber
                profilepicture
                workaddress
              }
            }
            `
          const variables= {
              doctorid: authState.userId
          }
          let hasuraRes = await graphqlReq(query, {...variables}, authState.userToken)
          // console.log(hasuraRes)
          const doctorResult = hasuraRes.data.doctor_by_pk
          if (doctorResult == null) throw Error("Doctor Result not found!")
          console.log("Fetched doctor info")
          // console.log(doctorResult)
          doctorContext.addNewDoctor(doctorResult)
      } catch(error) {
          console.log("Error occured while fetch user")
          console.log(error.messsage)
      }
    }
    if (doctorInfo.fullname == null) fetchUser()
  }, [doctorInfo])

  React.useEffect(() => {
    // console.log("State of appointdates: ")
    // console.log(appointdates)
    const fetchAppointments = async () => {
      try {
          console.log("Fetching appointdates...")
          const query = `query MyQuery2 {
            appointdate {
              appointtimes {
                appointtimeid
                endtime
                isbooked
                patientid
                starttime
                patient {
                  fullname
                  email
                  patientid
                  gender
                  birthday
                }
              }
              appointdateid
              appointdate
            }
          }`
          let hasuraRes = await graphqlReq(query, {}, authState.userToken)
          // console.log(hasuraRes)
          const appointResults = hasuraRes.data.appointdate
          console.log("Fetched appointdates")
          if (appointResults.length > 0) {
            appointResults.forEach((appointDate) => {
              // console.log("Addding an apointdate")
              const {appointdateid, appointdate, appointtimes} = appointDate
              // console.log(appointdate)
              appointmentContext.addAppointDate({appointdateid, appointdate})
              if (appointtimes.length > 0) {
                appointtimes.forEach((appointtime) => {
                  // console.log("Adding an appointtime")
                  // console.log(appointtime)
                  appointmentContext.addAppointTime(appointdateid, {...appointtime})
                })
              }
            })
          }
      } catch(error) {
          console.log("Error occured while fetch appointdates")
          console.log(error.messsage)
      }
    }
    if (appointdates.length === 0) {
      fetchAppointments()
    }
  }, [appointdates])

  return (
    <DoctorContext.Provider value={doctorContext}>
      <DoctorAppointmentContext.Provider value={appointmentContext}>
        <DoctorStack.Navigator 
          initialRouteName="DoctorMainScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <DoctorStack.Screen name="DoctorMainScreen" component={DoctorMainScreen} />
          <DoctorStack.Screen name="DoctorProfileScreen" component={DoctorProfileScreen} />
          <DoctorStack.Screen name="ScheduleScreen" component={ScheduleScreen} />
          <DoctorStack.Screen name="AddNewScheduleScreen" component={AddNewScheduleScreen} />
          <DoctorStack.Screen name="MyAppointmentScreen" component={MyAppointmentScreen} />
          
        </DoctorStack.Navigator>

      </DoctorAppointmentContext.Provider>
    </DoctorContext.Provider>
  )
}