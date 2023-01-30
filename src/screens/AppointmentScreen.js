import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
  import {
    Box,
    Flex,
    Heading,
    Image,
    Pressable,
    ScrollView,
    NativeBaseProvider,
    Text,
  } from "native-base";
import doctors from '../data/Doctors'
import Header from '../components/Header';
import { theme } from '../core/theme';
import BackButton from '../components/BackButton';

export default function AppointmentScreen({ navigation }) {
    return (
        <NativeBaseProvider>
            <Box safeArea flex={1}  alignItems="center">
            <BackButton goBack={navigation.goBack} />
            <Header  style={styles.head}>List of Doctors</Header>
            <ScrollView safeArea flex={1} showsVerticalScrollIndicator={false}>
            <Flex
                flexWrap="wrap"
                direction="row"
                justifyContent="space-between"
                px={6}
            >
                {doctors.map((doctor)=>(
                    <Pressable
                        onPress={() => navigation.navigate("AppointmentDetailScreen", doctor)}
                        key={doctor.id}
                        w="47%"
                        bg={"#FFFFFF"}
                        rounded="md"
                        shadow={2}
                        pt={0.3}
                        my={3}
                        pb={2}
                        overflow="hidden"
                    >
                        <Image
                            source={{ uri: doctor.image }}
                            alt={doctor.name}
                            w="full"
                            h={24}
                            resizeMode="contain"
                        />
                        <Box px={4} pt={1}>
                            <Heading size="sm" bold>
                                {doctor.name}
                            </Heading>
                            <Text fontSize={10} mt={1} isTruncated w="full">
                                {doctor.rank}
                            </Text>
                        </Box>
                    </Pressable>
                ))}

            </Flex>
            </ScrollView>
            </Box>
        </NativeBaseProvider>
    );
};
const styles = StyleSheet.create({
    head: {
        paddingTop: '10%',
        fontSize: 30,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
    },
})