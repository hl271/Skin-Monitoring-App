import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

import { signOut } from 'firebase/auth'

import { AuthContext, FirebaseContext, PatientGlobalState } from '../Contexts'
import { patientReducer } from '../Reducers'

export default function PatientMainScreen({ navigation }) {
  const authContext = React.useContext(AuthContext)
  const {patientInfo, 
        addNewPatient} = React.useContext(PatientGlobalState)
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
  
  React.useEffect(()=> {
    if (authContext.authState.signedIn && !patientInfo.fullname) {
      const {userFullName, userEmail} = authContext.authState
      addNewPatient(userEmail, userFullName)
    }
    // const fetchPatient = async (email) => {
    //   try {
    //     const query = `query findPatientByEmail($email: String!) {
    //       patient(where: {email: {_eq: $email}}) {
    //         patientid
    //         gender
    //         fullname
    //         email
    //         birthday
    //       }
    //     }`
    //     const graphqlReq = { "query": query, "variables": { "email": email} }
    //     let hasuraRes = await fetch(`${HASURA_GRAPHQL_ENDPOINT}`, {
    //       method: 'POST',
    //       headers: {
    //         'content-type' : 'application/json', 
    //         'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    //       },
    //       body: JSON.stringify(graphqlReq)
    //     })
    //     hasuraRes = await hasuraRes.json()
    //     console.log("Fetched user on hasura")
    //   } catch (error) {
        
    //   }
    // }
    // fetchPatient()
  }, [])
  const name= <Text>{patientInfo.fullname}</Text>;

  return (
    <Background>
      <Header>Hello { name },</Header>
      <Button
        mode='outlined'
        icon="camera"
        onPress={() => {navigation.navigate('CameraScreen')}}
      >
          Take your skin's photo
      </Button>
      <Button
        mode='outlined'
        icon="account-circle"
        onPress={() => {navigation.navigate('ProfileScreen')}}
      >
          Edit your profile
      </Button>
      <Button
        mode='outlined'
        icon="plus-box"
        onPress={()=>{navigation.navigate('DoctorsListScreen')}}
      >
          Set an Appointment
      </Button>
      <Button
        mode='outlined'
        icon="view-list"
        onPress={()=>navigation.navigate('HistoryScreen')}
      >
          View your detection history
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