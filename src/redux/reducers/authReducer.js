import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    SIGNUP_PAYMENT_SUCCESSFUL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    SET_FULL_USER,
    SET_SALESPERSON_TO_USER_SUCCESS,
    FETCH_USER_SUCCESS,
    UPDATE_USER_WITH_SUBSCRIPTION_STATUS,
} from "../actions/authActions";

const initialState = {
    user: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER_WITH_SUBSCRIPTION_STATUS:
            return {
                ...state,
                user: { ...state.user, subscriptionStatus: action.payload },
            };

        case SET_FULL_USER:
            return {
                ...state,
                user: action.payload,
            };

        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };

        case SIGNUP_PAYMENT_SUCCESSFUL:
            return {
                ...state,
                user: { ...state.user, businesses: [] },
            };

        case SET_SALESPERSON_TO_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: {
                    id: action.payload.uid,
                    email: action.payload.email,
                    photoUrl: action.payload.photoURL,
                    displayName: action.payload.displayName,
                },
                isLoggedIn: true,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        default:
            return state;
    }
};

export default authReducer;
