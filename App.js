import { StatusBar } from 'expo-status-bar';
import {NativeBaseProvider, Box} from "native-base"
import {StyleSheet, View, Text} from "react-native"

import LoginScreen from "./src/Screens/LoginScreen.js"

export default function App() {
  return (
    <NativeBaseProvider>
      <LoginScreen />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28
  },
});
