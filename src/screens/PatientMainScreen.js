import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import CameraScreen from './CameraScreen'

export default function PatientMainScreen({ navigation }) {
    const name= <Text>Huy</Text>;

    return (
      <Background>
        <BackButton goBack={navigation.goBack} />
        <Header>Hello { name },</Header>
        <Button
          mode='outlined'
          icon="account-circle"
          onPress={() => {navigation.navigate('CameraScreen')}}
        >
            Take your skin's photo
        </Button>
        <Button
          mode='outlined'
          icon="account-circle"
        >
            Edit your profile
        </Button>
        <Button
          mode='outlined'
          icon="view-list"
        >
            View your detection history
        </Button>
      </Background>
    )
  }