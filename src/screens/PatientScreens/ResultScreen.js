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
  } from "native-base";
import { StyleSheet, ImageBackground } from 'react-native'
import BackButton from '../../components/BackButton';
import Background from '../../components/Background';
import Paragraph from '../../components/Paragraph';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { theme } from '../../core/theme';
import { acc } from 'react-native-reanimated';

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default function ResultScreen({ route, navigation }) {
    const { record }=route.params;
    const {recordid, pictureurl, accuracy, disease, patientid, recordtime}=record;

    return (
            <NativeBaseProvider >
                <Box safeArea flex={1}  alignItems="center">
                    <BackButton goBack={navigation.goBack} />
                    <Header style={styles.head}>YOUR RESULT</Header>
                    <ScrollView px={5} showsVerticalScrollIndicator={false} flex={1}>
                        <VStack space={2} >
                            <HStack space={5} pt="6" pb="6" flex={1}>
                                <Image 
                                    style={styles.image}
                                    alt='image'
                                    source={{ uri: pictureurl }}
                                />  
                                <VStack space={2} my={5}>
                                    <Header style={styles.header}>Record Time</Header>
                                    <Paragraph style={styles.paragraph}>{dayjs(recordtime).format('HH:mm DD-MM-YYYY')}</Paragraph>
                                    <Header style={styles.header}>Result</Header>
                                    <Paragraph style={styles.paragraph}>{disease.diseasename}</Paragraph>
                                    <Header style={styles.header}>Accuracy</Header>
                                    <Paragraph style={styles.paragraph}>{accuracy}</Paragraph>
                                </VStack>
                                
                            </HStack>
                            <Heading size={'md'}>More info</Heading>
                            <Paragraph style={styles.paragraph}>
                                {disease.relatedinfo}
                            </Paragraph>
                            <Button mode="contained" onPress={()=>navigation.navigate("DoctorsListScreen")}>Set an Appointment</Button>
                            <Button mode="outlined" onPress={()=>navigation.navigate("DetectionHistoryScreen")}>View all records</Button>
                        </VStack>
                    </ScrollView>
                </Box>
            </NativeBaseProvider>
        
    );
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