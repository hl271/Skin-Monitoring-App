import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  DoctorLoginScreen,
  PatientLoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  PatientMainScreen,
  CameraScreen
} from './src/screens'

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="DoctorLoginScreen" component={DoctorLoginScreen} />
          <Stack.Screen name="PatientLoginScreen" component={PatientLoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="PatientMainScreen" component={PatientMainScreen} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
