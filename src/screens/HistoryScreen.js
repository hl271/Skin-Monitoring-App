import { View, StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Center, Pressable, NativeBaseProvider, Text } from "native-base";
import {
  Entypo,
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../color";
import AppointmentHistoryScreen from "./AppointmentHistoryScreen";
import DetectionHistoryScreen from "./DetectionHistoryScreen";
import { theme } from '../core/theme';
import BackButton from "../components/BackButton";

const Tab = createBottomTabNavigator();

const HistoryScreen = ({ navigation }) => {
  return (
    <NativeBaseProvider>
    <Tab.Navigator
      backBehavior="Main"
      initialRouteName="Main"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { ...styles.tab },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Appointment History"
        component={AppointmentHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <Text color={'#560CCE'} fontWeight='bold'>Appointment History</Text>
              ) : (
                <Text color={'#414757'}>Appointment History</Text>
              )}
            </Center>
          ),
        }}
      />
      <Tab.Screen
        name="Detection History"
        component={DetectionHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <Text color={'#560CCE'} fontWeight='bold'>Detection History</Text>
              ) : (
                <Text color={'#414757'}>Detection History</Text>
              )}
            </Center>
          ),
        }}
      />
    </Tab.Navigator>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  tab: {
    elevation: 0,
    backgroundColor: Colors.white,
    height: 60,
  },
});

export default HistoryScreen;
