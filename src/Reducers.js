import ACTION_TYPES from "./ActionTypes";

export function authReducer(prevState, action) {
    switch (action.type) {
        case ACTION_TYPES.AUTH.SIGN_IN: {
            return {
                ...prevState,
                userToken: action.userToken,
                userRole: action.userRole,
                signedIn: true
            }
        }
        case ACTION_TYPES.AUTH.SIGN_OUT: {
            return {
                ...prevState,
                userToken: null,
                userRole: null,
                signedIn: false
            }
        }
        case ACTION_TYPES.AUTH.SIGNING_IN: {
            return  {
                ...prevState,
                isSigningIn: true
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
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type)
        }
    }
}
