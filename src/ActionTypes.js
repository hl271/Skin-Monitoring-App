const ACTION_TYPES = {
    AUTH: {
        SIGN_IN: 'SIGN_IN',
        SIGN_OUT: 'SIGN_OUT'
    },
    DOCTOR: {
        UPDATE_PROFILE: 'DOCTOR_UPDATE_PROFILE',
        UPDATE_VERIFY_STATUS: 'UPDATE_VERIFY_STATUS'
    },
    PATIENT: {
        UPDATE_PROFILE: 'PATIENT_UPDATE_PROFILE'        
    },
    RECORD: {
        ADD_RECORD: 'ADD_RECORD'
    },
    APPOINTMENT: {
        ADD_SCHEDULE: 'ADD_SCHEDULE'
    }
}

export default ACTION_TYPES