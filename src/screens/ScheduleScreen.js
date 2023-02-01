import React, { useState } from 'react'
import Background from '../components/Background'
import { Text } from 'react-native-paper'
import Header from '../components/Header'
import Button from '../components/Button'
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
  } from "native-base";
import { StyleSheet, ImageBackground } from 'react-native'
import { theme } from '../core/theme';

export default function ScheduleScreen({ navigation }) {

    return (
        <NativeBaseProvider>
        <Box safeArea flex={1} px={5}  alignItems="center">
        <BackButton goBack={navigation.goBack} />
        <Header  style={styles.head}>My Schedules</Header>
        <Button mode='contained' icon='calendar-plus' onPress={()=>navigation.navigate('AddNewScheduleScreen')}> New Schedule</Button>
        <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
            {schedules.map((schedule)=>(
                
                <Box
                    key={schedule._id}
                    w="full"
                    bg={"#FFFFFF"}
                    rounded="md"
                    shadow={2}
                    my={3}
                    pt={2}
                    px={5}
                    overflow="hidden"
                    width="100%"
                >
                    <VStack space={2} pt={2}>
                        <Header style={styles.header}>{schedule._id}</Header>

                        <HStack space={2} pt="3" pb="3" pl="6" flex={1} flexWrap={'wrap'}>
                          {schedule.hours.map((hour)=>(
                            <Box key={hour}      borderWidth= {1}  borderRadius= {10} alignItems="center"
                            borderColor= "#560CCE" width="40%" my={2} m={'auto'} p={1}>{hour}</Box>
                          ))}
                        </HStack>
                  </VStack>
                </Box>
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