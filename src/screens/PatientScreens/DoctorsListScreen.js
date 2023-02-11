import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,  FlatList,} from 'react-native';
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
    Text,
    Pressable,
    Container,
    Modal,
    Button
  } from "native-base";
import Background from '../../components/Background';
import Paragraph from '../../components/Paragraph';
import Header from '../../components/Header';
import { theme } from '../../core/theme';
import BackButton from '../../components/BackButton';
import { AuthContext, DoctorListContext, PatientAppointmentContext } from '../../Contexts';
import SelectDropdown from 'react-native-select-dropdown';

import graphqlReq from '../../helpers/graphqlReq';
import graphqlQueries from '../../helpers/graphqlQueries';

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default function DoctorsListScreen({ navigation }) {
    const {authState} = React.useContext(AuthContext)
    const {doctorList} = React.useContext(DoctorListContext)
    const {addUpcomingAppointment} = React.useContext(PatientAppointmentContext)

    const placeholderURL = 'https://via.placeholder.com/200.jpg'

    const [showModal, setShowModal] = useState(false);
    const [currentDoctorId, setCurrentDoctorId] = useState(null)
    const [fetchedDoctorSchedules, setFetchDoctorSchedules] = useState({})
    const [availAppointTimes, setAvailAppointTimes] = useState([])
    const [chosenDateId, setChosenDateId] = useState(null)
    const [chosenTimeId, setChosenTimeId] = useState(null)

    React.useEffect(() => {
        const fetchAvailDoctorSchedules = async () => {
            try {
                console.log("Fetching available schedules of this doctor")
                const query = graphqlQueries.patientApp.FetchAvailSchedulesOfDoctors
                const variables = {
                    doctorid: currentDoctorId,
                    _datemin: dayjs().format('YYYY-MM-DD')
                }
                console.log(variables)
                const hasuraRes = await graphqlReq(query, variables, authState.userToken)
                const availSchedulesRes = hasuraRes.data.doctor_by_pk.appointdates
                if (availSchedulesRes.length > 0) {
                    console.log("Found available schedules of this doctor")
                    // !Trick to update state in a loop
                    const updatedState = {}
                    availSchedulesRes.forEach(date => {
                        const {appointdate, appointdateid, appointtimes} = date
                        updatedState[appointdateid] = {
                            appointdate,
                            appointtimes: [...appointtimes]
                        }
                    })
                    setFetchDoctorSchedules({
                        ...updatedState
                    })
                } 
            } catch (error) {
                console.log("Error occured while fetching doctor schedules")
                console.log(error.message)
            }
        }
        if (!!currentDoctorId) {
            // console.log("CurrentDoctorId is non null")
            setFetchDoctorSchedules({})
            setChosenDateId(null)
            setChosenTimeId(null)
            fetchAvailDoctorSchedules()
        }
    }, [currentDoctorId])

    // React.useEffect(() => {
    //     console.log("fetched schedules update")
    //     console.log(fetchedDoctorSchedules)
    // }, [fetchedDoctorSchedules])

    React.useEffect(() => {
        // console.log("Chosen date id:", chosenDateId)
        if (!!chosenDateId) {
            dropdownRef.current.reset()
            setAvailAppointTimes(fetchedDoctorSchedules[chosenDateId].appointtimes)
        }
    }, [chosenDateId])

    const onDoctorPressed = (doctorid) => {
        if (doctorid === currentDoctorId) {
            console.log("Using cached doctorid")
        } else {
            setCurrentDoctorId(doctorid)
        }
        setShowModal(true)       
    }

    const onModalDismissed = () =>{
        setChosenDateId(null)
        setChosenTimeId(null)
        setShowModal(false)
    }

    const onSubmitPressed = async () => {
        try {
            console.log("Booking appointment for patient")
            const query = graphqlQueries.patientApp.BookAppointment
            const variables = {
                appointtimeid: chosenTimeId,
                patientid: authState.userId
            }
            const hasuraRes = await graphqlReq(query, variables, authState.userToken)
            const bookedRes = hasuraRes.data.update_appointtime_by_pk
            const {appointtimeid, endtime, starttime, appointdate} = bookedRes
            addUpcomingAppointment({
                appointtimeid,
                starttime,
                endtime,
                appointdate: appointdate.appointdate,
                doctorid: currentDoctorId
            })
            console.log("Booked appointment successfully")
            setShowModal(false)
            navigation.navigate('AppointmentHistoryScreen')
            
        } catch(error) {
            console.log("Error occured while booking appointment")
            console.log(error.message)
        }
    }
    
    // !Reset dropdown: https://github.com/AdelRedaa97/react-native-select-dropdown/pull/1#issuecomment-818307624
    const dropdownRef = React.useRef({})

    return (
        <NativeBaseProvider>
            <Box safeArea flex={1}  mx={5} >
            <BackButton goBack={navigation.goBack} />
            <Header  style={styles.head}>Choose a Doctor</Header>
            <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
                {Object.entries(doctorList).map((doctor)=>(
                        
                    <Pressable
                        onPress={() => {onDoctorPressed(doctor[0])}}
                        key={doctor[0]}
                        w="sm"
                        bg={"#FFFFFF"}
                        rounded="md"
                        shadow={2}
                        overflow='scroll'
                        my={2}
                        p={3}
                    >
                        <VStack >
                            <Heading size="md" >{doctor[1].fullname}</Heading>
                            <Text italic fontSize="md">{doctor[1].workaddress}</Text>
                            <HStack space={3} my={3} mx={2}>
                                <Image 
                                    style={styles.image}
                                    alt='image'
                                    source={{ uri: !!doctor[1].profilepicture ? doctor[1].profilepicture : placeholderURL }}
                                />  
                                <VStack space={1} >
                                    <Text flexWrap='wrap'><Text bold>Email: </Text>{doctor[1].email}</Text>
                                    <Text numberOfLines={4} isTruncated><Text bold>About: </Text>{doctor[1].about}</Text>
                                    
                                    
                                </VStack>
                                
                            </HStack>
                        </VStack>
                    </Pressable>
                ))}
            </ScrollView>
            {!!doctorList[currentDoctorId] && (
                <Modal size={'full'} isOpen={showModal} onClose={onModalDismissed}>
                    <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>{doctorList[currentDoctorId].fullname}</Modal.Header>
                    <Modal.Body>
                        <ScrollView>
                            <VStack>
                                <Image 
                                    w={100} h={100} alignSelf='center' mb={3}
                                    alt='image'
                                    source={{ uri: !!doctorList[currentDoctorId].profilepicture ? doctorList[currentDoctorId].profilepicture : placeholderURL }}
                                />  
                                <Text><Text bold>Work At: </Text>{doctorList[currentDoctorId].workaddress}</Text>
                                <Text><Text bold>Phone Number: </Text>{doctorList[currentDoctorId].phonenumber}</Text>
                                <Text><Text bold>Email: </Text>{doctorList[currentDoctorId].email}</Text>
                                <Text><Text bold>About: </Text>{doctorList[currentDoctorId].about}</Text>

                                {(Object.keys(fetchedDoctorSchedules).length > 0) 
                                ? (
                                    <VStack>
                                        <Heading mt={5} mb={4} size={'md'}>Requesting appointment: </Heading>
                                        <HStack>
                                            <Text bold>Choose date: </Text>
                                            <SelectDropdown 
                                            defaultButtonText={'...'}
                                            rowStyle={{ margin: 10, flex: 2}}
                                            data={Object.entries(fetchedDoctorSchedules)}
                                            renderDropdownIcon={()=> {return true}}
                                            onSelect={(selectedItem, index) => {
                                                // console.log(selectedItem, index)
                                                setChosenDateId(selectedItem[0])
                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                // text represented after item is selected
                                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                                return selectedItem[1].appointdate 
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                // text represented for each item in dropdown
                                                // if data array is an array of objects then return item.property to represent item in dropdown
                                                return item[1].appointdate 
                                                
                                            }}
                                            />
                                        </HStack>
                                        {!!chosenDateId 
                                        ? (
                                            <HStack>
                                                <Text bold>Choose time: </Text>
                                                <SelectDropdown 
                                                ref={dropdownRef}
                                                defaultButtonText={'...'}
                                                rowStyle={{ alignSelf: 'center'}}
                                                data={availAppointTimes}
                                                renderDropdownIcon={()=> {return true}}
                                                onSelect={(selectedItem, index) => {
                                                    // console.log(selectedItem, index)
                                                    setChosenTimeId(selectedItem.appointtimeid)
                                                }}
                                                buttonTextAfterSelection={(selectedItem, index) => {
                                                    // text represented after item is selected
                                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                                    const starttime = dayjs(selectedItem.starttime, 'HH:mm:ss').format('HH:mm')
                                                    const endtime = dayjs(selectedItem.endtime, 'HH:mm:ss').format('HH:mm')
                                                    return `${starttime} - ${endtime}`
                                                }}
                                                rowTextForSelection={(selectedItem, index) => {
                                                    // text represented for each item in dropdown
                                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                                    const starttime = dayjs(selectedItem.starttime, 'HH:mm:ss').format('HH:mm')
                                                    const endtime = dayjs(selectedItem.endtime, 'HH:mm:ss').format('HH:mm')
                                                    return `${starttime} - ${endtime}`
                                                    
                                                }}
                                                />
                                            </HStack>
                                        ) : (
                                            <></>
                                        )}
                                    </VStack>
                                ) : (
                                    <VStack>
                                        <Heading mt={5} size={'md'}>Requesting appointment: </Heading>
                                        <Text mt={3} bold >Found no available schedule</Text>
                                    </VStack>
                                )}
                            </VStack>
                        </ScrollView>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                        setShowModal(false);
                        }}>
                            Cancel
                        </Button>
                        <Button onPress={onSubmitPressed}
                        >
                            Request Appointment
                        </Button>
                        </Button.Group>
                    </Modal.Footer>
                    </Modal.Content>
                </Modal>

            )}
            </Box>
        </NativeBaseProvider>
    )
};
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

    image: {
        width: 120,
        height: 120,
        // resizeMode: 'contain',
        // marginLeft: 10,
        alignSelf: 'center'
    },
    head: {
        fontSize: 30,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginTop: '20%',
        marginBottom: 10
    }
  })