const graphqlQueries = {
    patientApp: {
        FetchAvailSchedulesOfDoctors: `query FetchAvailSchedulesOfDoctors($doctorid: String!, $_datemin: date!) {
          doctor_by_pk(doctorid: $doctorid) {
            appointdates(where: {appointdate: {_gt: $_datemin}}, order_by: {appointdate: asc}) {
              appointtimes(where: {isbooked: {_eq: false}}) {
                appointtimeid
                endtime
                starttime
              }
              appointdate
              appointdateid
            }
          }
        }`,
        FetchUpcomingAppointments: `query FetchUpcomingAppointments($patientid: String!, $_datemin: date!) {
            patient_by_pk(patientid: $patientid) {
              appointtimes(order_by: {appointdate: {appointdate: asc}, starttime: asc}, 
                where: {appointdate: {appointdate: {_gte: $_datemin}} }) {
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
          }`,
        BookAppointment: `mutation BookAppointment($appointtimeid: bigint!, $patientid: String!) {
          update_appointtime_by_pk(pk_columns: {appointtimeid: $appointtimeid}, _set: {isbooked: true, patientid: $patientid}) {
            appointtimeid
            endtime
            starttime
            appointdate {
              appointdate
              appointdateid
            }
          }
        }
        `,
        FetchDisease: `query MyQuery($name: String!) {
          disease(where: {diseasename: {_eq: $name}}) {
            diseaseid
            diseasename
            relatedinfo
          }
        }
        `,
        InsertNewRecord: `mutation MyMutation($accuracy: numeric!, $diseaseid: Int!, $patientid: String!, $recordtime: timestamp!, $pictureurl: String!) {
          insert_record_one(object: {accuracy: $accuracy, diseaseid: $diseaseid, patientid: $patientid, pictureurl: $pictureurl, recordtime: $recordtime}) {
            recordid
            recordtime
          }
        }
        `
    },
    doctorApp: {
      FetchUpcomingAppointDates: `query FetchUpcomingAppointDates($_datemin: date!) {
        appointdate(where: {appointdate: {_gte: $_datemin}}, order_by: {appointdate: asc}) {
          appointtimes {
            appointtimeid
            endtime
            isbooked
            starttime
            patient {
              patientid
              fullname
              email
              patientid
              gender
              birthday
            }
          }
          appointdateid
          appointdate
        }
      }`
    }
}

export default graphqlQueries