import React from 'react'
// import { ActivityIndicator } from 'react-native-paper'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'

function LoadingAnimation({loadingtext}) {
    console.log("Rendering loading animation")
  return (
    <View style={styles.indicatorWrapper}>
      <ActivityIndicator size="large" style={styles.indicator}/>
      <Text style={styles.indicatorText}>{loadingtext}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    
    indicatorWrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        opacity: 0.2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        marginTop: 20
    },
    indicatorText: {
      fontSize: 18,
      marginTop: 50,
    },
  });
export default LoadingAnimation