import React, { useState } from 'react'
import { SafeAreaView } from 'react-native'
import Background from '../../components/Background'
import Header from '../../components/Header'
import PaperButton from '../../components/Button'
import BackButton from '../../components/BackButton'
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
    FlatList,
    Text
  } from "native-base";
import { StyleSheet, ImageBackground } from 'react-native'
import { theme } from '../../core/theme';
import { DoctorAppointmentContext } from '../../Contexts'

const ListItem = ({appointtime}) => {
    const {appointtimeid, endtime, starttime, isbooked, patient} = appointtime
    const BookedInfo = () => {
        if (isbooked) {
            return (
                <>
                    <Text color='red' bold>
                            Booked
                    </Text>
                    <Text color="coolGray.600" >
                        <Text bold>Patient Name: </Text> 
                        {patient.fullname}
                    </Text>
                    <Text color="coolGray.600" >
                    <Text bold>Gender: </Text> 
                        {patient.gender === 'M' ? "Male" : "Female"}
                    </Text>
                    <Text color="coolGray.600" >
                        <Text bold>Email: </Text> 
                        {patient.email}
                    </Text>
                    <Text color="coolGray.600" >
                        <Text bold>Birthday: </Text> 
                        {patient.birthday}
                    </Text>
                </>
            )
        } else {
            return (
                <Text italic color="coolGray.600">Not Booked</Text>
            )
        }
    }
    return (
        <Box borderBottomWidth="1" borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
            <HStack space={[2, 3]} justifyContent="space-between">
                <VStack>
                    {BookedInfo()}
                </VStack>
                <Spacer />
                <VStack>
                    <Text fontSize="sm" bold color="coolGray.800" alignSelf="flex-start">
                        {starttime} - {endtime}
                    </Text>
    
                </VStack>
            </HStack>
        </Box>
    )
}

export default function ScheduleScreen({ navigation }) {
    const {appointdates, addAppointDate} = React.useContext(DoctorAppointmentContext)

    // React.useEffect(() => {
    //     console.log("appointdates changes")
    //     console.log(appointdates)
    // }, [appointdates])
    return (
        <NativeBaseProvider>
        <Box safeArea flex={1}  mx={5} >
        <BackButton goBack={navigation.goBack} />
        <Header  style={styles.head}>My Appointments</Header>
        <PaperButton mode='contained' icon='calendar-plus' onPress={()=>navigation.navigate('AddNewScheduleScreen')}> New Schedule</PaperButton>
        <Heading my={3}>Upcoming</Heading>
        <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
            {appointdates.length >0 && appointdates.map((appointdate)=>(
                
                <Box
                    key={appointdate.appointdateid}
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
                        <Header style={styles.header}>{appointdate.appointdate}</Header>

                        <VStack space={2} flex={1} flexWrap={'wrap'}>
                            {appointdate.appointtimes.map((appointtime)=>(
                                <ListItem key={appointtime.appointtimeid} appointtime={appointtime}></ListItem>
                            ))}
                          
                        </VStack>
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
        marginTop: '20%',
        fontSize: 30,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginBottom: 10
    },
    paragraph: {
        fontSize: 15,
        maxHeight: 300,
        textAlign: 'left',
    }
  })