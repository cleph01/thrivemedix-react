export const SET_MESSAGE = "SET_MESSAGE";
export const SET_SUCCESS_MESSAGE = "SET_SUCCESS_MESSAGE";
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const CLEAR_MESSAGE = "CLEAR_MESSAGE";
export const OPEN_TOASTIFY_ALERT = "OPEN_TOASTIFY_ALERT";
export const CLOSE_TOASTIFY_ALERT = "CLOSE_TOASTIFY_ALERT";

export const setMessage = (message) => {
    return {
        type: SET_MESSAGE,
        payload: message,
    };
};

export const setSuccessMessage = (messageObj) => {
    return {
        type: SET_SUCCESS_MESSAGE,
        payload: messageObj,
    };
};

export const clearMessage = () => {
    return {
        type: CLEAR_MESSAGE,
        payload: "",
    };
};

export const openToastifyAlert = () => {
    return {
        type: OPEN_TOASTIFY_ALERT,
    };
};

export const closeToastifyAlert = () => {
    return {
        type: CLOSE_TOASTIFY_ALERT,
    };
};
