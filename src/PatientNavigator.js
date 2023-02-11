import React, { useState } from 'react'
import {
  PatientMainScreen,
  CameraScreen,
  ProfileScreen,
  ResultScreen,
  DoctorsListScreen,
  AppointmentDetailScreen,
  DetectionHistoryScreen,
  AppointmentHistoryScreen,
} from './screens'

import { AuthContext, FirebaseContext, PatientContext, 
  RecordContext, PatientAppointmentContext, DoctorListContext } from './Contexts'
import { patientReducer, recordReducer, patientAppointmentReducer, doctorListReducer } from './Reducers'
import { createStackNavigator } from '@react-navigation/stack'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)


import ACTION_TYPES from './ActionTypes'
import graphqlReq from './helpers/graphqlReq'
import graphqlQueries from './helpers/graphqlQueries'

const PatientStack = createStackNavigator()

export default function PatientNavigator()  {
  const authContext = React.useContext(AuthContext)
  const {authState} = authContext
  const {auth} = React.useContext(FirebaseContext)

  const [patientInfo, patientInfoDispatch] = React.useReducer(patientReducer, {
    fullname: null,
    email: null,
    gender: null,
    birthday: null
  })

  const [records, recordsDispatch] = React.useReducer(recordReducer, [])
  const [appointments, appointmentsDispatch] = React.useReducer(patientAppointmentReducer, {
    upcoming: [],
    passed: []
  })
  const [doctorList, doctorListDispatch] = React.useReducer(doctorListReducer, [])

  const patientContext = React.useMemo(() => ({
    addNewPatient: (newPatient) => {
      patientInfoDispatch({type: ACTION_TYPES.PATIENT.ADD_PATIENT, ...newPatient})
    },
    updateProfile: (updatedPatient) => {
      patientInfoDispatch({type: ACTION_TYPES.PATIENT.UPDATE_PROFILE, ...updatedPatient})
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
    appointments,
    addUpcomingAppointment: (appointment => {
      appointmentsDispatch({type: ACTION_TYPES.PATIENT_APPOINTMENT.ADD_APPOINT_UPCOMING, ...appointment})
    })
  }), [appointments])

  const doctorListContext = React.useMemo(() => ({
    doctorList,
    addDoctor: (doctor) => {
      doctorListDispatch({type: ACTION_TYPES.DOCTOR_LIST.FETCH_DOCTOR, ...doctor})
    },
    addDoctorSchedule: (doctorid, schedules) => {
      doctorListDispatch({type: ACTION_TYPES.DOCTOR_LIST.FETCH_DOCTOR_SCHEDULE, doctorid, schedules})
    }
  }), [doctorList])

  
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
          console.log("Fetching patient info...")
          const query = `query MyQuery($patientid: String!) {
              patient_by_pk(patientid: $patientid) {
                birthday
                email
                fullname
                gender
              }
            }
            `
          const variables= {
              patientid: authState.userId
          }
          let hasuraRes = await graphqlReq(query, variables, authState.userToken)
          const patientResult = hasuraRes.data.patient_by_pk
          if (patientResult == null) throw Error("Patient Result not found!")
          console.log("Fetched patient info")
          // console.log(patientResult)
          patientContext.addNewPatient(patientResult)
      } catch(error) {
          console.log("Error occured while fetch user")
          console.log(error.messsage)
      }
    }
    if (patientInfo.fullname == null) fetchUser()
  }, [patientInfo])
  
  React.useEffect(()=> {
    const fetchRecords = async () => {
      try {
          console.log("Fetching records...")
          const query = graphqlQueries.patientApp.FetchRecords
          
          let hasuraRes = await graphqlReq(query, {}, authState.userToken)
          // console.log(hasuraRes)
          const recordResults = hasuraRes.data.record
          if (recordResults.length > 0) {
              recordResults.map((record) => {
                  recordContext.addRecord(record)
              })
          }
      } catch(error) {
          console.log("Error while fetching records")
          console.log(error.message)
      }
    }
    if (records.length == 0) fetchRecords()
    // // Use this pattern to avoid race condition
    // let active = true
  }, [records])

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
          console.log("Fetching doctors...")
          const query = graphqlQueries.patientApp.FetchDoctorList
          let hasuraRes = await graphqlReq(query, {}, authState.userToken)
          const doctorResults = hasuraRes.data.doctor
          console.log("Fetched doctors list")
          // console.log(doctorResults)
          if (doctorResults.length > 0) {
              doctorResults.map((doctor) => {
                doctorListContext.addDoctor(doctor)
            })
          }
      } catch(error) {
          console.log("Error while fetching doctors")
          console.log(error.message)
      }
    }
    if (doctorList.length == 0) fetchDoctors()
  }, [doctorList])

  React.useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        console.log("Fetching appointments for patient")
        const query = graphqlQueries.patientApp.FetchUpcomingAppointments
        const variables = {
          patientid: authState.userId,
          _datemin: dayjs().format('YYYY-MM-DD')
        }
        // console.log(variables)
        const hasuraRes = await graphqlReq(query, variables, authState.userToken)
        const appointmentRes = hasuraRes.data.patient_by_pk.appointtimes
        if (appointmentRes.length > 0) {
          console.log("Found booked appointments of this patient")
          appointmentRes.forEach(appointtime => {
            const {appointtimeid, starttime, endtime, appointdate} = appointtime
            const appointment = {
              appointtimeid,
              starttime,
              endtime, 
              appointdate: appointdate.appointdate,
              doctorid: appointdate.doctor.doctorid
            }
            appointmentContext.addUpcomingAppointment(appointment)
          })
        }
      }catch(error) {
        console.log("Error occured while fetching upcoming appointments")
        console.log(error.message)
      }
    }
    if (appointments.upcoming.length === 0) fetchUpcomingAppointments()
  }, [appointments])
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
              <PatientStack.Screen name="DetectionHistoryScreen" component={DetectionHistoryScreen} />
              <PatientStack.Screen name="AppointmentHistoryScreen" component={AppointmentHistoryScreen} />
            </PatientStack.Navigator>

          </DoctorListContext.Provider>
        </PatientAppointmentContext.Provider>
      </RecordContext.Provider>
    </PatientContext.Provider>
  )
}