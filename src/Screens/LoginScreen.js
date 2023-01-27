// import { View, Text } from 'react-native'
import React from "react";
import { Box, Button, Heading, Input, Text, View, VStack } from "native-base";
import Colors from "../colors";
import { Pressable } from "react-native";
const LoginScreen = () => {
  return (
    <Box flex={1} bg={Colors.orange}>
      <Box
        w="full"
        h="full"
        position="absolute"
        top="0"
        px="6"
        justifyContent="center"
      >
        <Heading>LOGIN</Heading>
        <VStack space="5" pt="6">
          <Input placeholder="user@gmail.com" w="70%" variant="underlined" />
          <Input
            placeholder="******"
            w="70%"
            type="password"
            variant="underlined"
          />
          <Button my={30} w="40%" rounded={50}>
            LOGIN
          </Button>
          <Pressable mt={4}>
            <Text color={Colors.lightBlack}>SIGN UP</Text>
          </Pressable>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginScreen;
