import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

export default function DoctorMainScreen({ navigation }) {
    const name= <Text>Huy</Text>;

    return (
      <Background>
        <BackButton goBack={navigation.goBack} />
        <Header>Hello { name },</Header>
        <Button
          mode='outlined'
          icon="camera"
          onPress={() => {navigation.navigate('ScheduleScreen')}}
        >
            My Schedule
        </Button>
        <Button
          mode='outlined'
          icon="account-circle"
          onPress={() => {navigation.navigate('ProfileScreen')}}
        >
            My Appointment
        </Button>
        <Button
          mode='outlined'
          icon="plus-box"
          onPress={()=>{navigation.navigate('DoctorsListScreen')}}
        >
            Edit Profile
        </Button>
      </Background>
    )
  }