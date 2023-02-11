const graphqlQueries = {
    patientApp: {
        FetchAvailSchedulesOfDoctors: `query FetchAvailSchedulesOfDoctors($doctorid: String!, $_datemin: date!, $_timemin: time!) {
            doctor_by_pk(doctorid: $doctorid) {
              appointdates {
                appointtimes(where: {isbooked: {_eq: false}, appointdate: {appointdate: {_gte: $_datemin}}, starttime: {_gt: $_timemin}}) {
                  appointtimeid
                  endtime
                  starttime
                }
                appointdate
                appointdateid
              }
            }
          }`,
        FetchUpcomingAppointments: `query FetchUpcomingAppointments($patientid: String!, $_datemin: date!, $_timemin: time!) {
            patient_by_pk(patientid: $patientid) {
              appointtimes(order_by: {appointdate: {appointdate: asc}, starttime: asc}, 
                where: {appointdate: {appointdate: {_gte: $_datemin}}, starttime: {_gt: $_timemin}}) {
                appointtimeid
                endtime
                starttime
                appointdate {
                  appointdate
                  doctor {
                    doctorid
                  }
                }
              }
            }
          }`,
        FetchPassedAppointments: `query FetchPassedAppointments($patientid: String!,$_datemax: date!, $_timemax: time!) {
            patient_by_pk(patientid: $patientid) {
              appointtimes(order_by: {appointdate: {appointdate: desc}, starttime: desc}, 
                where: {appointdate: {appointdate: {_lt: $_datemax}}, starttime: {_lte: $_timemax}}) {
                appointtimeid
                endtime
                starttime
                appointdate {
                  appointdate
                  doctor {
                    doctorid
                  }
                }
              }
            }
          }`,
        FetchRecords: `query MyQuery {
            record(order_by: {recordtime: asc}) {
              accuracy
              disease {
                diseaseid
                diseasename
                relatedinfo
              }
              patientid
              pictureurl
              recordid
              recordtime
            }
          }`,
        FetchDoctorList: `query MyQuery {
            doctor(order_by: {fullname: asc}) {
              birthday
              doctorid
              email
              fullname
              gender
              isapproved
              phonenumber
              profilepicture
              workaddress
              about
            }
          }`
    }
}

export default graphqlQueries