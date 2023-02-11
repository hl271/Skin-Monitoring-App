import React, { useState, useEffect } from 'react'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import BackButton from '../../components/BackButton'
import schedules from '../../data/Schedules'
import { theme } from '../../core/theme';
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
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import graphqlReq from '../../helpers/graphqlReq'
import fixedTimeRanges from '../../helpers/fixedTimeRanges'
import { AuthContext, DoctorAppointmentContext } from '../../Contexts'

dayjs.extend(customParseFormat)

import {
    StyleSheet,
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
import { doctorAppointmentReducer } from '../../Reducers'
  
const ListItem = ({timerange, selected, onPress, onLongPress}) => (
  <>
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.listItem}>
      <View style={{padding: 8,justifyContent: 'center', //Centered horizontally
      alignItems: 'center', //Centered vertically
      flex:1}} >
        <Text style={{fontSize: 15, color: '#fff', }} >{timerange.starttime} - {timerange.endtime}</Text>
      </View>
      {selected && <View style={styles.overlay} />}
    </TouchableOpacity>
  </>
);
  
  
export default function AddNewScheduleScreen({ navigation }) {
  const {authState} = React.useContext(AuthContext)
  const {appointdates, addAppointDate, addAppointTime} = React.useContext(DoctorAppointmentContext)

  const [date, setDate] = useState(new Date());
  const [selectedTimeIds, setSelectTimeIds] = useState([]);
  const [currentAppointDate, setCurrentAppointDate] = useState({
    // If appointdateid is null, currentAppointDate is not in database
    appointdateid: null, 
    appointdate: null,
    appointtimes: []
  })
  const [filteredTimeRanges, setFilterTimeRanges] = useState([])
  
  React.useEffect(() => {
    const fetchAppointDate = async () => {
      try {
        //Check if appointdate is already in database
        const reqDate = dayjs(date).format('YYYY-MM-DD')
        console.log(`Fetching appoint date for date ${reqDate}`)
        const query = `query MyQuery($appointdate: date!, $doctorid: String!) {
          appointdate(where: {appointdate: {_eq: $appointdate}, doctorid: {_eq: $doctorid}}) {
            appointdateid
            appointdate
            appointtimes {
              appointtimeid
              starttime
              endtime
            }
          }
        }`
        const variables = {
          appointdate: reqDate,
          doctorid: authState.userId
        }
        const hasuraRes = await graphqlReq(query, variables, authState.userToken)
        if (hasuraRes.data.appointdate.length > 0) {
          console.log("Found appointdate for this date")
          const appointdateRes = hasuraRes.data.appointdate[0]
          const {appointdate, appointdateid, appointtimes} = appointdateRes
          setCurrentAppointDate({
            appointdateid,
            appointdate,
            appointtimes: [...appointtimes]
          })
        } else {
          console.log("Found no appointdate for this date on database. Reset currentAppointDate.")
          setCurrentAppointDate({
            appointdate: null,
            appointdateid: null,
            appointtimes: []
          })
        }


      } catch(error) {
        console.log("Error while fetching appointdate")
        console.log(error.message)
      }
    }
    fetchAppointDate()
    // if (!dayjs(date).isSame(currentAppointDate.appointdate, 'day')) {
    //   console.log('Changing date from current appointdate')
    // }
  }, [date])

  React.useEffect(() => {
    if (currentAppointDate.appointtimes.length > 0) {
      console.log("Filtering appointtimes...")
      // console.log(currentAppointDate.appointtimes)
      const filteredTimeRanges = fixedTimeRanges.filter((timeRange) => {
        const foundMatchedDate = currentAppointDate.appointtimes.find(appointtime => {
          if (dayjs(timeRange.starttime, 'HH:mm').isSame(dayjs(appointtime.starttime, 'HH:mm'))) {
            return true
          } 
        });
        return (!!foundMatchedDate) ? false : true
      })
      // console.log(filteredTimeRanges)
      setFilterTimeRanges([...filteredTimeRanges])
    } else {
      setFilterTimeRanges([...fixedTimeRanges])
    }
    // console.log("Reset select time ids")
    setSelectTimeIds([])
  }, [currentAppointDate])

  const getSelected = item => selectedTimeIds.includes(item.id);

  const deSelectTimes = () => setSelectTimeIds([]);

  const selectTimes = item => {
    // console.log(selectedTimeIds)
    if (selectedTimeIds.includes(item.id)) {
      // The component is already selected => remove from list
      const newListTimes = selectedTimeIds.filter(
        listItem => listItem !== item.id,
      );
      return setSelectTimeIds([...newListTimes]);
    }
    setSelectTimeIds([...selectedTimeIds, item.id]);
  };

  const onDateSelected = (event, selectedDate) => {
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD')
    console.log("Selected date: ", formattedDate)
    setDate(selectedDate)

  };



  const showDatepicker = () => {
    DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onChange: onDateSelected,
        maximumDate: dayjs().add(6, 'day').toDate(),
        minimumDate: dayjs().toDate()
    })
  };


  const onSubmit= async ()=>{
    try {
      let {appointdateid, appointdate} = currentAppointDate
      if (!currentAppointDate.appointdateid) {
        console.log("Adding appointdate to database...")
        const query = `mutation MyMutation($appointdate: date!, $doctorid: String!) {
          insert_appointdate_one(object: {appointdate: $appointdate, doctorid: $doctorid}) {
            appointdate
            appointdateid
            doctorid
          }
        }`
        const variables = {
          appointdate: dayjs(date).format('YYYY-MM-DD'),
          doctorid: authState.userId
        }
        const hasuraRes = await graphqlReq(query, variables, authState.userToken)
        console.log("Added appointdate to database")
        // console.log(hasuraRes)
        appointdateid  = hasuraRes.data.insert_appointdate_one.appointdateid
        appointdate = hasuraRes.data.insert_appointdate_one.appointdate
      }
      const query = `mutation MyMutation2($objects: [appointtime_insert_input!]!) {
        insert_appointtime(objects: $objects) {
          returning {
            appointtimeid
            endtime
            isbooked
            patientid
            starttime
          }
        }
      }`
      const mappedSelectedTimes = fixedTimeRanges.filter(timeRange => {
        if (selectedTimeIds.includes(timeRange.id)) {
          return true
        } else return false
      })

      const variables = {
        objects: mappedSelectedTimes.map(timeRange => {
          return {
            appointdateid: appointdateid,
            starttime: timeRange.starttime,
            endtime: timeRange.endtime
          }
        })
      }
      console.log(variables)

      const hasuraRes = await graphqlReq(query, variables, authState.userToken)
      console.log("Add appointdates & appointtimes to database")
      addAppointDate({appointdateid, appointdate})
      const appointtimes = hasuraRes.data.insert_appointtime.returning
      if (appointtimes.length > 0) {
        // console.log("Adding appointtimes")
        appointtimes.forEach((appointtime) => {
          addAppointTime(appointdateid, {...appointtime})
        })
      }
      navigation.navigate('ScheduleScreen')
    } catch(error) {
      console.log("Error occured while adding schedules")
      console.log(error.message)
    }
  }

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} px={5} alignItems="center">
        <BackButton goBack={navigation.goBack} />
        <Header  style={styles.head}>Add New Schedules</Header>
        <Button mode='contained' onPress={showDatepicker}>
            {dayjs(date).format('YYYY-MM-DD')}
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
                  overflow="hidden" onPress={deSelectTimes} 
                  justifyContent={'space-between'} >
            <FlatList
              data={filteredTimeRanges}
              flex={1}
              renderItem={({item}) => (
                <ListItem
                  onPress={() => selectTimes(item)}
                  onLongPress={() => selectTimes(item)}
                  selected={getSelected(item)}
                  timerange={item}
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