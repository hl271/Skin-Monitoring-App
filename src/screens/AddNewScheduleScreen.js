import React, { useState, useEffect } from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import schedules from '../data/Schedules'
import { theme } from '../core/theme';
import {
    Box,
    Heading,
    Image,
    ScrollView,
    HStack,
    VStack,
    NativeBaseProvider,
    Spacer,
  } from "native-base";
import {  ImageBackground } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import MultiSelect from 'react-native-multiple-select';

var moment = require('moment'); 

import {
    StyleSheet,
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  
  const data = 
    [{id: '1', time: '07:00-08:00'},
    {id: '2', time: '08:00-09:00'},
    {id: '3', time: '09:00-10:00'},
    {id: '4', time: '10:00-11:00'},
    {id: '5', time: '13:00-14:00'},
    {id: '6', time: '14:00-15:00'},
  ];
  
  const ListItem = ({item, selected, onPress, onLongPress}) => (
    <>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.listItem}>
        <View style={{padding: 8,justifyContent: 'center', //Centered horizontally
       alignItems: 'center', //Centered vertically
       flex:1}} >
          <Text style={{fontSize: 15, color: '#fff', }} >{item.time}</Text>
        </View>
        {selected && <View style={styles.overlay} />}
      </TouchableOpacity>
    </>
  );
  

export default function AddNewScheduleScreen({ navigation }) {
    const [date, setDate] = useState(new Date());
    const [selectedItems, setSelectedItems] = useState([]);
    
      const getSelected = contact => selectedItems.includes(contact.id);
    
      const deSelectItems = () => setSelectedItems([]);
    
      const selectItems = item => {
        if (selectedItems.includes(item.id)) {
          const newListItems = selectedItems.filter(
            listItem => listItem !== item.id,
          );
          return setSelectedItems([...newListItems]);
        }
        setSelectedItems([...selectedItems, item.id]);
      };





    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          mode: currentMode,
          is24Hour: true,
          maximumDate: moment().add(6,'d').toDate() ,
           minimumDate: moment().toDate()
        });
      };
    
      const showDatepicker = () => {
        showMode('date');
      };

      onSelectedItemsChange = selectedItems => {
        this.setSelectedHours({ selectedItems });
      };

      const onSubmit=()=>{
        navigation.navigate('ScheduleScreen');
      }

    return (
        <NativeBaseProvider>
        <Box safeArea flex={1} px={5} alignItems="center">
        <BackButton goBack={navigation.goBack} />
        <Header  style={styles.head}>Add New Schedules</Header>
        <Button mode='contained' onPress={showDatepicker}>
            {date.toDateString()}
        </Button>
        <Box safeArea flex={1} my={2} borderRadius={10} shadow={2}  px={5} flexDirection='row' flexWrap={'wrap'} alignItems="center"  bg='#fff' width={'full'}>
         <Pressable 
                  bg={"#FFFFFF"}
                  rounded="md"
                  shadow={2}pt={0.3}
                  my={3}
                  paddingTop={2}
                  flex={1}
                  pb={2}
                  overflow="hidden" onPress={deSelectItems} 
                  justifyContent={'space-between'} >
      <FlatList
        data={data}
        flex={1}
        renderItem={({item}) => (
          <ListItem
            onPress={() => selectItems(item)}
            onLongPress={() => selectItems(item)}
            selected={getSelected(item)}
            item={item}
          />
        )}
        keyExtractor={item => item.id}
      />
    </Pressable>
    </Box>
    <Button mode='contained' onPress={onSubmit}>SUBMIT</Button>
        </Box>
    </NativeBaseProvider>
    )
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
    },
    listItem: {
        backgroundColor:  theme.colors.primary,
        marginBottom: 10,
        borderRadius: 5,
        overflow: 'hidden',
        flex: 1,
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center'
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
  })