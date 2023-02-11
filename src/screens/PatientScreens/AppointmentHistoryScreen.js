import React, { useState, useEffect, useRef } from 'react';
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
    Modal,
    FlatList,
    Avatar,
    Button
  } from "native-base";
import { StyleSheet, ImageBackground } from 'react-native'
import BackButton from '../../components/BackButton';
import Header from '../../components/Header';
import PaperButton from '../../components/Button';
import { theme } from '../../core/theme';
import { AuthContext, PatientAppointmentContext, DoctorListContext } from '../../Contexts';

const ListItem = ({appointment, doctor, onPress}) => (
    <Pressable onPress={onPress} borderBottomWidth="1" borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
        <HStack space={[2, 3]} justifyContent="space-between">
            <Avatar size="48px" source={{ uri: doctor.profilepicture }} />
            <VStack>
                <Text color="coolGray.800" bold>
                        {doctor.fullname}
                </Text>
                <Text color="coolGray.600" >
                    {doctor.workaddress}
                </Text>
            </VStack>
            <Spacer />
            <VStack>
                <Text fontSize="sm" bold color="coolGray.800" alignSelf="flex-start">
                    {appointment.appointdate}
                </Text>
                <Text fontSize="sm" color="coolGray.800" alignSelf="flex-start">
                    {appointment.starttime} - {appointment.endtime}
                </Text>

            </VStack>
        </HStack>
    </Pressable>
)

export default function AppointmentHistoryScreen({ navigation }) {
    const {appointments} = React.useContext(PatientAppointmentContext)
    const {doctorList} = React.useContext(DoctorListContext)
    const {authState} =React.useContext(AuthContext)

    const placeholderURL = 'https://via.placeholder.com/200.jpg'


    const [currentDoctorId, setCurrentDoctorId] = useState(null)
    const [showModal, setShowModal] = useState(false);

    const onDoctorPressed = (doctorid) => {
        if (!!currentDoctorId && doctorid === currentDoctorId) {
            console.log("Using cached doctorid")
        } else {
            setCurrentDoctorId(doctorid)
        }
        setShowModal(true)       
    }

    // React.useEffect(() => {
    //     console.log("Upcoming appointments")
    //     console.log(appointments.upcoming)
    // }, [appointments.upcoming])

    // React.useEffect(() => {
    //     console.log("Changing doctor id to: ", currentDoctorId)
    // }, [currentDoctorId])

    return (
      <NativeBaseProvider>
        <Box safeArea mx={5} flex={1} >
        <BackButton goBack={navigation.goBack} />
        <Header  style={styles.head}>List of Appointments</Header>
        <PaperButton mode='contained' icon='calendar-plus' onPress={()=>navigation.navigate('DoctorsListScreen')}> New Appointment</PaperButton>
        <Heading my={3}>Upcoming</Heading>
        {(Object.keys(doctorList).length > 0 && appointments.upcoming.length > 0)  && (
            <FlatList 
                data={appointments.upcoming}
                keyExtractor={item => item.appointtimeid}
                renderItem={({item}) => (
                    <ListItem
                        onPress={() => onDoctorPressed(item.doctorid)}
                        appointment={item}
                        doctor={doctorList[item.doctorid]}
                    />
                )}
            >

            </FlatList>                
        )}
        {/* <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
        </ScrollView> */}
        {!!doctorList[currentDoctorId] && (
            <Modal size={'full'} isOpen={showModal} onClose={() => setShowModal(false)}>
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
                        </VStack>
                    </ScrollView>
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={() => setShowModal(false)}
                    >
                        Close
                    </Button>

                </Modal.Footer>
                </Modal.Content>
            </Modal>

            )}
        </Box>
    </NativeBaseProvider>
);
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
    //   paddingVertical: 12,
  },
  paragraph: {
      fontSize: 15,
      maxHeight: 300,
      textAlign: 'left',
  }
})