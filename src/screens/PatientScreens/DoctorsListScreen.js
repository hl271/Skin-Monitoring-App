import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,  FlatList,} from 'react-native';
import {
    Box,
    Heading,
    Flex,
    Image,
    ScrollView,
    HStack,
    VStack,
    NativeBaseProvider,
    View,
    Spacer,
    Text,
    Pressable,
    Container
  } from "native-base";
import Background from '../../components/Background';
import Paragraph from '../../components/Paragraph';
import Header from '../../components/Header';
import { theme } from '../../core/theme';
import BackButton from '../../components/BackButton';
import { AuthContext, DoctorListContext } from '../../Contexts';

export default function DoctorsListScreen({ navigation }) {
    const {authState} = React.useContext(AuthContext)
    const {doctorList} = React.useContext(DoctorListContext)

    const placeholderURL = 'https://via.placeholder.com/200.jpg'

    return (
        <NativeBaseProvider>
            <BackButton goBack={navigation.goBack} />
            <Box safeArea flex={1}  mx={4} mt={6}>
            <Header  style={styles.head}>List of Doctors</Header>
            <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
                {doctorList.map((doctor)=>(
                        
                    <Pressable
                        onPress={() => {
                            navigation.navigate("AppointmentDetailScreen", {doctor})}}
                        key={doctor.doctorid}
                        w="sm"
                        bg={"#FFFFFF"}
                        rounded="md"
                        shadow={2}
                        pt={0.3}
                        my={3}
                        mx={2}
                        pb={1}
                        overflow='scroll'
                    >
                        {/* <VStack space={2} > */}
                            <HStack space={3} py="3">
                                <Image 
                                    style={styles.image}
                                    alt='image'
                                    source={{ uri: !!doctor.profilepicture ? doctor.profilepicture : placeholderURL }}
                                />  
                                <VStack space={1} my={5} >
                                    <Heading size="md" py={0} my={0}>{doctor.fullname}</Heading>
                                    <Container >
                                        <Text fontSize="md">{doctor.workaddress}</Text>
                                    </Container>
                                    <Container w='65%' >
                                        <Text><Text fontSize="md" bold>Email: </Text>{doctor.email}</Text>
                                        <Text numberOfLines={4} isTruncated><Text fontSize="md" bold>About: </Text>{doctor.about}</Text>

                                    </Container>
                                    
                                </VStack>
                                
                            </HStack>
                        {/* </VStack> */}
                    </Pressable>
                ))}
            </ScrollView>
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
        marginLeft: 10,
        alignSelf: 'center'
    },
    head: {
        fontSize: 30,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
        paddingTop: '10%'
    }
  })