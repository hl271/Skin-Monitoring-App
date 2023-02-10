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
import PatientNavigator from './src/PatientNavigator'
import DoctorNavigator from './src/DoctorNavigator'
import {authReducer} from './src/Reducers'
import {AuthContext, FirebaseContext} from './src/Contexts'
import ACTION_TYPES from './src/ActionTypes'

import app from './src/helpers/firebase'
import {getAuth, onIdTokenChanged} from 'firebase/auth';
import {getDatabase, ref, onValue} from 'firebase/database';

const auth = getAuth(app)
const database = getDatabase(app)

import {X_HASURA_ADMIN_SECRET, HASURA_GRAPHQL_ENDPOINT, AUTH_API} from "@env"

const Stack = createStackNavigator()

export default function App() {
  // const authContext = React.useContext(AuthContext)
  // const {authState} = authContext
  // console.log(AUTH_API)
  // console.log(HASURA_GRAPHQL_ENDPOINT)
  const [authState, authDispatch] = React.useReducer(authReducer, {
    userToken: null,
    userRole: null,
    userToken: null,
    userEmail: null,
    userFullName: null,
    signedIn: false,
    isSigningIn: false
  })

  React.useEffect(() => {
    return auth.onAuthStateChanged(async user => {
      // console.log(HASURA_GRAPHQL_ENDPOINT)
      // console.log(AUTH_API)
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
            // console.log(idTokenResult)
            
            const hasuraClaim =
              idTokenResult.claims["https://hasura.io/jwt/claims"];
  
            if (!hasuraClaim) throw "Hasura claims NOT exists"
            const userId = idTokenResult.claims.user_id
    
            const query = `query findUser($id: String!) {
              doctor_by_pk(doctorid: $id) {
                email
                doctorid
                fullname
              }
              patient_by_pk(patientid: $id) {
                email
                patientid
                fullname
              }
            }`      
            const graphqlReq = { "query": query, "variables": { "id": userId} }
            let hasuraRes = await fetch(`${HASURA_GRAPHQL_ENDPOINT}`, {
              method: 'POST',
              headers: {
                'content-type' : 'application/json', 
                'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
              },
              body: JSON.stringify(graphqlReq)
            })
            hasuraRes = await hasuraRes.json()
            if (hasuraRes["errors"]) throw Error("Error from GraphQL Server")
            // console.log(hasuraRes)
            let role, logUser
            if (hasuraRes.data['doctor_by_pk'] !== null) {
              role = "doctor"
              logUser = hasuraRes.data['doctor_by_pk']
            }
            else if (hasuraRes.data['patient_by_pk']) {
              role = "patient"
              logUser = hasuraRes.data['patient_by_pk']
            }
            else throw "No user found on Hasura" 
            console.log("Logged in as ", role)
            authContext.signIn(role, userId, userToken, logUser.email, logUser.fullname)
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
  React.useEffect(() => {
    return auth.onIdTokenChanged( async (user) => {
      console.log("Id Token changed")
      if (user && authState.signedIn) {
        const userToken = await user.getIdToken()
        console.log("token refreshed")
        authContext.refreshToken(userToken)
      }
    })
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: (userRole, userId, userToken, userEmail, userFullName) => {
        authDispatch({ type: ACTION_TYPES.AUTH.SIGN_IN,  userRole, userId, userToken, userEmail, userFullName});
      },
      signOut: () => authDispatch({ type: ACTION_TYPES.AUTH.SIGN_OUT }),
      signingIn: (isSigningIn) => {
        console.log("issigningin change to ", isSigningIn)
        authDispatch({type: ACTION_TYPES.AUTH.SIGNING_IN, isSigningIn})
      },
      refreshToken: (userToken) => {
        authDispatch({type: ACTION_TYPES.AUTH.REFRESH_TOKEN, userToken})
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
