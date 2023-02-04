import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  PatientMainScreen,
  CameraScreen,
  ProfileScreen,
  ResultScreen,
  DoctorsListScreen,
  AppointmentDetailScreen,
  HistoryScreen,
  DetectionHistoryScreen,
  AppointmentHistoryScreen,
  DoctorMainScreen,
  ScheduleScreen,
  AddNewScheduleScreen,
  MyAppointmentScreen
} from './src/screens'
import {authReducer} from './src/Reducers'
import ACTION_TYPES from './src/ActionTypes'
import {AuthContext, ActionCreators, FirebaseContext} from './src/Contexts'

import app from './src/helpers/firebase'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getDatabase, ref, onValue} from 'firebase/database';

const auth = getAuth(app)
const database = getDatabase(app)

import {AUTH_API_NGROK, X_HASURA_ADMIN_SECRET, HASURA_GRAPHQL_ENDPOINT} from "@env"

const Stack = createStackNavigator()

export default function App() {
  const [authState, authDispatch] = React.useReducer(authReducer, {
    userToken: null,
    userRole: null,
    userEmail: null,
    signedIn: false
  })

  React.useEffect(() => {
    return auth.onAuthStateChanged(async user => {
      console.log("Detect auth state change")
      // console.log(user)
      try {
        if (user) { 
          console.log("User detected") 
          const userToken = await user.getIdToken();
          const idTokenResult = await user.getIdTokenResult();  
          // console.log("tokenresult: ", idTokenResult)
          
          const hasuraClaim =
            idTokenResult.claims["https://hasura.io/jwt/claims"];
  
          if (hasuraClaim) {
            console.log("Hasura claims exists")

            const query = `query findUserByEmail($email: String!) {
              doctor(where: {email: {_eq: $email}}) {
                doctorid
              }
              patient(where: {email: {_eq: $email}}) {
                patientid
              }
            }`
      
            const graphqlReq = { "query": query, "variables": { "email": user.email} }
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
            let role, loggedInUser
            if (hasuraRes.data.doctor.length > 0) {
              role = "doctor"
              loggedInUser = hasuraRes.data.doctor[0]
            }
            else if (hasuraRes.data.patient.length > 0) {
              role = "patient"
              loggedInUser = hasuraRes.data.patient[0]
            }
            else console.log("Found no user on Hasura")
            console.log("Logged in as ", role)
            actionCreators.signIn(role, userToken, user.email)

          } else {
            console.log("Hasura claims not exits")
            // // Check if refresh is required.
            // const metadataRef = ref(database, "metadata/" + user.uid + "/refreshTime");
            // onValue(metadataRef, async (data) => {
            //   if(!data.exists) return
            //   // Force refresh to pick up the latest custom claims changes.
            //   console.log("force refresh")
            //   const token = await user.getIdToken(true)
            // });
          }
        } else {
          // setLoggedIn(false);
        }
      } catch (error) {
        console.log("Error occured!")
        console.log(error)
      }
    });
  }, [])

  const actionCreators = React.useMemo(
    () => ({
      signIn: (userRole, userToken, userEmail) => {
        authDispatch({ type: 'SIGN_IN',  userRole, userToken, userEmail});
      },
      signOut: () => authDispatch({ type: 'SIGN_OUT' }),
      signUp: (email, password, name, role) => {
        
      },
    }),
    []
  );

  let NavigationStacks
  if (authState.signedIn) {
    if (authState.userRole == "doctor") {
      NavigationStacks = (
        <>
          <Stack.Screen name="DoctorMainScreen" component={DoctorMainScreen} />
          <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
          <Stack.Screen name="AddNewScheduleScreen" component={AddNewScheduleScreen} />
          <Stack.Screen name="MyAppointmentScreen" component={MyAppointmentScreen} />
          
        </>
      )      
    }
    else if (authState.userRole == "patient") {
      NavigationStacks = (
        <>
        <Stack.Screen name="PatientMainScreen" component={PatientMainScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
        <Stack.Screen name="DoctorsListScreen" component={DoctorsListScreen} />
        <Stack.Screen name="AppointmentDetailScreen" component={AppointmentDetailScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen name="DetectionHistoryScreen" component={DetectionHistoryScreen} />
        <Stack.Screen name="AppointmentHistoryScreen" component={AppointmentHistoryScreen} />
        </>
      )
    }
  } else {
    NavigationStacks = (
      <>
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      </>
    )
  }

  return (
    <Provider theme={theme}>
      <ActionCreators.Provider value={actionCreators}>
        <FirebaseContext.Provider value={{app, auth, database}}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="StartScreen"
              screenOptions={{
                headerShown: false,
              }}
            >             
              {NavigationStacks}
            </Stack.Navigator>
          </NavigationContainer>
        </FirebaseContext.Provider>
      </ActionCreators.Provider>
    </Provider>
  )
}
