import React, { useState, useEffect } from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import schedules from '../data/Schedules'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme';
import {
    Box,
    Heading,
    Image,
    ScrollView,
    HStack,
    VStack,
    NativeBaseProvider,
    View,
    Spacer,
    Pressable,
  } from "native-base";
import { StyleSheet, ImageBackground } from 'react-native'
import {Picker} from '@react-native-picker/picker';

export default function AddNewScheduleScreen({ navigation }) {
    const [nextDates, setNextDate]=useState(null);
    const [selectedDate, setSelectedDate]=useState(null);
var date = new Date();          // Get current Date
        for (let i=0; i< 7; i++)
        {
            date.setDate(date.getDate()+1);
            setNextDate(
                    [nextDates, date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
            ]);
        }
    

    return (
        <NativeBaseProvider>
        <Box safeArea flex={1}  alignItems="center">
        <BackButton goBack={navigation.goBack} />
        <Header>My Schedules</Header>
        <Picker
                                selectedValue={selectedDate}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelectedDate(itemValue)
                                }>
                                {nextDates.map((availDate)=>(
                                    <Picker.Item label={availDate} value={availDate} key={availDate}/>
                                ))}
                            </Picker>
        </Box>
    </NativeBaseProvider>
    )
  }

  
const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '10%'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' 
    },
    item: {
        paddingLeft: 20,
        width: '50%',
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'flex-start' 
    },
    image: {
        width: '50%',
        resizeMode: 'contain',
    },
    header: {
        fontSize: 15,
        color: theme.colors.secondary,
        fontWeight: 'bold',
    },
    head: {
        paddingTop: '10%',
        fontSize: 30,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
    },
    paragraph: {
        fontSize: 15,
        maxHeight: 300,
        textAlign: 'left',
    }
  })