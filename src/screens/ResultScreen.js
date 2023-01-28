import React, { useState, useEffect, useRef } from 'react';
import { View } from 'native-base';
import { StyleSheet } from 'react-native'
import BackButton from '../components/BackButton';
import Background from '../components/Background';
import Paragraph from '../components/Paragraph';

export default function ResultScreen({ route, navigation }) {
    const { image, currentDate }=route.params;

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <View style={styles.container}>
                <View style={styles.item}>
                    <Image 
                        source={{ uri: image }}
                        alt="Image"
                        w="full"
                        h={300}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.item}>
                    <Paragraph>Date/Time</Paragraph>
                    <Paragraph>Result</Paragraph>
                    <Paragraph>Accuracy</Paragraph>
                </View>
            </View>
            <Paragraph>
                Detailed Infor
            </Paragraph>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start' 
    },
    item: {
      width: '50%',
      flex: 1,
      flexWrap: 'wrap',
      alignItems: 'flex-start' 
    }
  })