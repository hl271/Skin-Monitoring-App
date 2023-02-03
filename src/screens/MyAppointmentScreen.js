import React, { useState } from 'react'
import Background from '../components/Background'
import Header from '../components/Header'

import BackButton from '../components/BackButton'
import schedules from '../data/Schedules'
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
    Text,
    Button
  } from "native-base";
import { StyleSheet, ImageBackground } from 'react-native'
import { theme } from '../core/theme';
import myappointments from '../data/MyAppointments'
import Colors from '../color'

const colors=
    {'upcoming': '#ffffce',
    'past': Colors.deepGray,
    'cancled': '#ffcbcb'};

const color2s=
{'upcoming': Colors.orange,
'past': Colors.main,
'cancled': Colors.red};


const Appointment=({id, name, time, status})=>(
    <>
        <Pressable>
                <HStack
                    space={4}
                    key={id}
                    justifyContent="space-between"
                    alignItems="center"
                    bg={colors}
                    py={5}
                    px={2}
                >
                    <Text width={'35%'} fontSize={12} bold color={Colors.black} isTruncated>
                    {name}
                    </Text>
                    <Text width={'20%'}fontSize={11} italic color={Colors.black} isTruncated>
                    {time}
                    </Text>
                    <Button
                    px={7}
                    py={1.5}
                    rounded={50}
                    width={'35%'}
                    bg={color2s[status]}
                    _text={{
                        color: Colors.white,
                    }}
                    _pressed={{
                        bg: Colors.main,
                    }}
                    >
                    {status}
                    </Button>
                </HStack>
                {status=='cancled' && <HStack bg={'#ffcbcb'}/>}
                {status=='upcoming' && <HStack bg={'#ffffce'}/>}
                </Pressable>
    </>
)

export default function MyAppointmentScreen({ navigation }) {

    return (
        <NativeBaseProvider>
        <Box h="full" bg={Colors.white} pt={5} alignItems="center">
        <BackButton goBack={navigation.goBack} />
        <Header  style={styles.head}>My Appointments</Header>
        <ScrollView showsVerticalScrollIndicator={false}>
            {myappointments.map((appointment)=>(
                <Appointment 
                id={appointment.id}
                name={appointment.patient_name}
                time={appointment.time}
                status={appointment.status}/>
            ))}
        </ScrollView>
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