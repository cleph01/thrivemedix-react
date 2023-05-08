import {
    SET_BUSINESS_ID,
    FETCH_BUSINESS_INFO_INITIATED,
    FETCH_BUSINESS_INFO_SUCCESS,
    CREATE_TWILIO_SUB_ACCOUNT_SUCCESSFUL,
    SET_REMAINING_MESSAGES_COUNT,
} from "../actions/businessProfileActions";

const initialState = {
    business: null,
};

const businessProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BUSINESS_ID:
            return {
                ...state,
                business: { businessId: action.payload },
            };
        case FETCH_BUSINESS_INFO_INITIATED:
            return {
                ...state,
                isLoading: true,
            };
        case FETCH_BUSINESS_INFO_SUCCESS:
            return {
                ...state,
                business: { ...state.business, ...action.payload },
                isLoading: false,
            };

        case CREATE_TWILIO_SUB_ACCOUNT_SUCCESSFUL:
            return {
                ...state,
                business: {
                    ...state.business,
                    ...action.payload,
                },
            };
        case SET_REMAINING_MESSAGES_COUNT:
            return {
                ...state,
                business: {
                    ...state.business,
                    remainingMessagesCount: action.payload,
                },
            };
        default:
            return state;
    }
};

export default businessProfileReducer;
