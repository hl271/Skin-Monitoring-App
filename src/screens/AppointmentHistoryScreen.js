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
  } from "native-base";
import { StyleSheet, ImageBackground } from 'react-native'
import BackButton from '../components/BackButton';
import Background from '../components/Background';
import Paragraph from '../components/Paragraph';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../core/theme';
import appointments from '../data/Appointments';

export default function AppointmentHistoryScreen({ navigation }) {

    return (
      <NativeBaseProvider>
      <Box safeArea flex={1}  alignItems="center">
      <BackButton goBack={navigation.goBack} />
      <Header  style={styles.head}>List of Appointments</Header>
      <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
          {appointments.map((appointment)=>(
              <Box
                  key={appointment._id}
                  w="full"
                  bg={"#FFFFFF"}
                  rounded="md"
                  shadow={2}
                  pt={0.3}
                  my={3}
                  pb={2}
                  overflow="hidden"
              >
                <HStack space={2} pt="3" pb="3" pl="6" pr="6" flex={1}>
                        <Header style={styles.header}>Name: </Header>
                        <Paragraph style={styles.paragraph}>{appointment.name}</Paragraph>
                        <Header style={styles.header}>Date/Time: </Header>
                        <Paragraph style={styles.paragraph}>{appointment.time}</Paragraph>
                </HStack>
              </Box>
          ))}
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