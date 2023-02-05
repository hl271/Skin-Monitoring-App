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
import BackButton from '../../components/BackButton';
import Background from '../../components/Background';
import Paragraph from '../../components/Paragraph';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { theme } from '../../core/theme';
import detections from '../../data/Detections';

export default function DetectionHistoryScreen({ navigation }) {

    return (
      <NativeBaseProvider>
      <Box safeArea flex={1}  alignItems="center">
      <BackButton goBack={navigation.goBack} />
      <Header  style={styles.head}>List of Detections</Header>
      <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
          {detections.map((detection)=>(
              <Pressable
                  onPress={() => {
                    const image=detection.image;
                    const time=detection.time;
                    navigation.navigate("ResultScreen", {image, time})}}
                  key={detection._id}
                  w="97%"
                  bg={"#FFFFFF"}
                  rounded="md"
                  shadow={2}
                  pt={0.3}
                  my={3}
                  pb={2}
                  overflow="hidden"
              >
                  <VStack space={2} >
                            <HStack space={5} pt="6" pb="6" flex={1}>
                                <Image 
                                    style={styles.image}
                                    alt='image'
                                    source={{ uri: detection.image }}
                                />  
                                <VStack space={2} my={5}>
                                    <Header style={styles.header}>Date/Time</Header>
                                    <Paragraph style={styles.paragraph}>{detection.time}</Paragraph>
                                    <Header style={styles.header}>Result</Header>
                                    <Paragraph style={styles.paragraph}>{detection.res}</Paragraph>
                                    <Header style={styles.header}>Accuracy</Header>
                                    <Paragraph style={styles.paragraph}>{detection.accu}</Paragraph>
                                </VStack>
                                
                            </HStack>
                          </VStack>
              </Pressable>
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