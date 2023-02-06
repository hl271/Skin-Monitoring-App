import ACTION_TYPES from "./ActionTypes";

export function authReducer(prevState, action) {
    switch (action.type) {
        case ACTION_TYPES.AUTH.SIGN_IN: {
            return {
                ...prevState,
                userId: action.userId,
                userToken: action.userToken,
                userRole: action.userRole,
                userEmail: action.userEmail,
                userFullName: action.userFullName,
                signedIn: true
            }
        }
        case ACTION_TYPES.AUTH.SIGN_OUT: {
            return {
                ...prevState,
                userToken: null,
                userRole: null,
                userEmail: null,
                userFullName: null,
                signedIn: false
            }
        }
        case ACTION_TYPES.AUTH.SIGNING_IN: {
            return  {
                ...prevState,
                isSigningIn: action.isSigningIn
            }
        }
        case ACTION_TYPES.AUTH.REFRESH_TOKEN: {
            return {
                ...prevState,
                userToken: action.userToken
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function doctorReducer(prevState, action) {
    switch(action.type) {
        case ACTION_TYPES.DOCTOR.UPDATE_PROFILE: {
            return {
                ...prevState,
                fullname: action.fullname,
                workaddress: action.workaddress,
                about: action.about,
                profilepicture: action.profilepicture
            }
        }
        case ACTION_TYPES.DOCTOR.UPDATE_VERIFY_STATUS: {
            return {
                ...prevState,
                isverified: action.isverified
            }
        } 
        case ACTION_TYPES.DOCTOR.ADD_DOCTOR: {
            return {
                ...prevState,
                email: action.email,
                fullname: action.fullname
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type)
        }
    }
}

export function patientReducer(prevState, action) {
    switch(action.type) {
        case ACTION_TYPES.PATIENT.UPDATE_PROFILE: {
            return {
                ...prevState,
                fullname: action.fullname,
                birthday: action.birthday,
                gender: action.gender
            }
        }
        case ACTION_TYPES.PATIENT.ADD_PATIENT: {
            return {
                ...prevState,
                email: action.email,
                fullname: action.fullname,
                birthday: action.birthday, 
                gender: action.gender
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type)
        }
    }
}

export function recordReducer(prevState, action) {
    switch (action.type) {
        case ACTION_TYPES.RECORD.ADD_RECORD: {
            return [...prevState, {
                recordid: action.recordid,
                pictureurl: action.pictureurl,
                accuracy: action.accuracy,
                disease: {...action.disease},
                recordtime: action.recordtime
            }]
        }
    }
}

export function patientAppointmentReducer(prevState, action) {
    switch (action.type) {
        case ACTION_TYPES.PATIENT_APPOINTMENT.ADD_APPOINTMENT: {
            return [...prevState, {
                scheduledate: action.scheduledate,
                scheduletime: action.scheduletime,
                doctor: action.doctor
            }]
        }
    }
}
export function doctorListReducer(prevState, action) {
    switch(action.type) {
        case ACTION_TYPES.DOCTOR_LIST.FETCH_DOCTOR: {
            return [...prevState, {
                doctorid: action.doctorid,
                fullname: action.fullname,
                workaddress: action.workaddess,
                about: action.about,
                profilepicture: action.profilepicture,
                phonenumber: action.phonenumber,
                email: action.email,
                schedules: null
            }]
        }
        case ACTION_TYPES.DOCTOR_LIST.FETCH_DOCTOR_SCHEDULE: {
            return prevState.map(doctor => {
                if (doctor.doctorid === action.doctorid) {
                    return {
                        ...doctor,
                        schedules: [...action.schedules]
                    }
                } else {
                    return doctor
                }
            })
        }
    }
}