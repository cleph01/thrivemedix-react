import {
    SET_MESSAGE,
    SET_SUCCESS_MESSAGE,
    SET_ERROR_MESSAGE,
    CLEAR_MESSAGE,
    OPEN_TOASTIFY_ALERT,
    CLOSE_TOASTIFY_ALERT,
} from "../actions/messageActions";

const initialState = {
    message: null,
    openToast: false,
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MESSAGE:
            return {
                ...state,
                message: action.payload,
            };
        case SET_SUCCESS_MESSAGE:
            return {
                ...state,
                message: action.payload.message,
                severity: action.payload.severity,
                openToast: action.payload.openToast,
            };
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                message: action.payload.message,
                severity: action.payload.severity,
                openToast: action.payload.opentToast,
            };
        case CLEAR_MESSAGE:
            return {
                ...state,
                message: null,
            };
        case OPEN_TOASTIFY_ALERT:
            return {
                ...state,
                openToast: true,
            };
        case CLOSE_TOASTIFY_ALERT:
            return {
                ...state,
                openToast: false,
            };
        default:
            return state;
    }
};

export default messageReducer;
