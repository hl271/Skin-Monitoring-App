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
} from './src/screens'
import PatientNavigator from './PatientNavigator'
import DoctorNavigator from './DoctorNavigator'
import {authReducer} from './src/Reducers'
import {AuthContext, FirebaseContext} from './src/Contexts'
import ACTION_TYPES from './src/ActionTypes'

import app from './src/helpers/firebase'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {getDatabase, ref, onValue} from 'firebase/database';

const auth = getAuth(app)
const database = getDatabase(app)

import {AUTH_API_NGROK, X_HASURA_ADMIN_SECRET, HASURA_GRAPHQL_ENDPOINT} from "@env"

const Stack = createStackNavigator()

export default function App() {
  // const authContext = React.useContext(AuthContext)
  // const {authState} = authContext
  const [authState, authDispatch] = React.useReducer(authReducer, {
    userToken: null,
    userRole: null,
    userEmail: null,
    userFullName: null,
    signedIn: false,
    isSigningIn: false
  })

  React.useEffect(() => {
    return auth.onAuthStateChanged(async user => {
      console.log("Detect auth state change")
      // console.log(user)
      try {
        if (user) { 
          // If user is not in LogInScreen, try to automatically log in
          // TODO: RESOLVE authState.isSigningState is ALWAYS SET to FALSE inside this async function
          // console.log("isSigningIn is", authState.isSigningIn)
          if (!authState.isSigningIn) {
            console.log("Automatically signing in...") 

            const userToken = await user.getIdToken();
            const idTokenResult = await user.getIdTokenResult();  
            // console.log("tokenresult: ", idTokenResult)
            
            const hasuraClaim =
              idTokenResult.claims["https://hasura.io/jwt/claims"];
  
            if (!hasuraClaim) throw "Hasura claims NOT exists"
    
            const query = `query findUserByEmail($email: String!) {
              doctor(where: {email: {_eq: $email}}) {
                fullname
              }
              patient(where: {email: {_eq: $email}}) {
                fullname
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
            let role, userFullName
            if (hasuraRes.data.doctor.length > 0) {
              role = "doctor"
              userFullName = hasuraRes.data.doctor[0].fullname
            }
            else if (hasuraRes.data.patient.length > 0) {
              role = "patient"
              userFullName = hasuraRes.data.patient[0].fullname
            }
            else throw "No user found on Hasura" 
            console.log("Logged in as ", role)
            authContext.signIn(role, userToken, user.email, userFullName)
          }          
        } else {
          authContext.signOut()
        }
      } catch (error) {
        console.log("Error occured while auth state change")
        console.log(error)
      }
    });
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: (userRole, userToken, userEmail, userFullName) => {
        authDispatch({ type: ACTION_TYPES.AUTH.SIGN_IN,  userRole, userToken, userEmail, userFullName});
      },
      signOut: () => authDispatch({ type: ACTION_TYPES.AUTH.SIGN_OUT }),
      signingIn: (isSigningIn) => {
        console.log("issigningin change to ", isSigningIn)
        authDispatch({type: ACTION_TYPES.AUTH.SIGNING_IN, isSigningIn})
      },
      authState
    }),
    [authState]
  );


  let NavigationStacks
  if (authState.signedIn) {
    if (authState.userRole == "doctor") {
      // console.log("Change to doctor screen...")
      NavigationStacks = (
        <Stack.Screen name="DoctorNavigator" component={DoctorNavigator}/>
      )      
    }
    else if (authState.userRole == "patient") {
      NavigationStacks = (
        <Stack.Screen name="PatientNavigator" component={PatientNavigator}/>
      )
    }
  } else {
    // console.log("Change to start screen...")
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
        <FirebaseContext.Provider value={{app, auth, database}}>
          <AuthContext.Provider value={authContext}>

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

          </AuthContext.Provider>
        </FirebaseContext.Provider>     
    </Provider>
  )
}
