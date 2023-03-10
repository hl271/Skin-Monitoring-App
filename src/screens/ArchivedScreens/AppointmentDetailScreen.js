import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
  import {
    Box,
    Flex,
    Heading,
    Image,
    HStack,
    VStack,
    ScrollView,
    Form,
    Item,
    NativeBaseProvider,
    Text,
    Container
  } from "native-base";
import Header from '../../components/Header';
import { theme } from '../../core/theme';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import {Picker} from '@react-native-picker/picker';

import Paragraph from '../../components/Paragraph';

export default function AppointmentDetailScreen({ route, navigation }) {
    const {doctor}=route.params;
    const [availDates, setAvailDates]=useState(["22/11/23 08:30", "22/33/22 14:30"]);
    const [date, setDate]=useState(null);

    const onSubmit=()=>{
        setAvailDates(["22/11/23", "22/33/22"]);
        navigation.navigate("PatientMainScreen");
    };

    return (
        <NativeBaseProvider>
            
            <BackButton goBack={navigation.goBack} />
            <Box safeArea flex={1} mx={4} mt={6}>
                <Header  style={styles.head}>Set Appointment</Header>
                <ScrollView px={5} showsVerticalScrollIndicator={false} flex={1}>
                        <VStack space={2} >
                            <HStack space={1} pt="6" pb="6" flex={1}>
                                <Image 
                                    style={styles.image}
                                    alt='image'
                                    source={{ uri: doctor.profilepicture }}
                                />  
                                <VStack space={2} my={5}>
                                    <Heading size="md" py={0} my={0}>{doctor.fullname}</Heading>
                                    <Container>
                                        <Text fontSize="md">{doctor.workaddress}</Text>
                                    </Container>
                                </VStack>
                                
                            </HStack>
                            <Header>Description</Header>
                            <Paragraph style={styles.paragraph}>
                                {doctor.about}
                            </Paragraph>
                            <Header>Available Schedule:</Header>

                            <Picker
                                selectedValue={date}
                                onValueChange={(itemValue, itemIndex) =>
                                    setDate(itemValue)
                                }>
                                {availDates.map((availDate)=>(
                                    <Picker.Item label={availDate} value={availDate} key={availDate}/>
                                ))}
                            </Picker>

                            <Button mode="contained" onPress={onSubmit}>Submit</Button>
                        </VStack>
                    </ScrollView>
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
      fontSize: 18,
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
      lineHeight: 21,
      maxHeight: 300,
      textAlign: 'left',
  }
})