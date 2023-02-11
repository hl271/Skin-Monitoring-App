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
import { RecordContext , AuthContext} from '../../Contexts';

export default function DetectionHistoryScreen({ navigation }) {
    const {records, addRecord} = React.useContext(RecordContext)
    const {authState} = React.useContext(AuthContext)
    const [isFetchingRecords, setReload] = useState(false)
    React.useEffect(() => {
        
        
    }, []) // If set dependencies as records => the fetch function will run
    //on infinite loops, because each time records change, fetch will be triggered again
    return (
      <NativeBaseProvider>
      <Box safeArea mx={5} flex={1}  alignItems="center">
      <BackButton goBack={navigation.goBack} />
      <Header  style={styles.head}>List of Detections</Header>
      <Button mode='contained' icon='camera' onPress={()=>navigation.navigate('CameraScreen')}> Take skin's photo</Button>
      <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
          {[...records].reverse().map((record)=>(
                
              <Pressable
                  onPress={() => {
                    navigation.navigate("ResultScreen", {record})}}
                  key={record.recordid}
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
                                    source={{ uri: record.pictureurl }}
                                />  
                                <VStack space={2} my={5}>
                                    <Header style={styles.header}>Date/Time</Header>
                                    <Paragraph style={styles.paragraph}>{record.recordtime}</Paragraph>
                                    <Header style={styles.header}>Result</Header>
                                    <Paragraph style={styles.paragraph}>{record.disease.diseasename}</Paragraph>
                                    <Header style={styles.header}>Accuracy</Header>
                                    <Paragraph style={styles.paragraph}>{record.accuracy}</Paragraph>
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