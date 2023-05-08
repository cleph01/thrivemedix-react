import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/db/firebaseConfig";

export const SET_BUSINESS_ID = "SET_BUSINESS_ID";
export const FETCH_BUSINESS_INFO_SUCCESS = "FETCH_BUSINESS_INFO_SUCCESS,";
export const FETCH_BUSINESS_INFO_INITIATED = "SET_BUSINESS_INITIATED";

export const CREATE_TWILIO_SUB_ACCOUNT_INITIATED =
    "CREATE_TWILIO_SUB_ACCOUNT_INITIATED";
export const CREATE_TWILIO_SUB_ACCOUNT_SUCCESSFUL =
    "CREATE_TWILIO_SUB_ACCOUNT_SUCCESSFUL";
export const CREATE_TWILIO_SUB_ACCOUNT_FAILED =
    "CREATE_TWILIO_SUB_ACCOUNT_FAILED";

export const SET_REMAINING_MESSAGES_COUNT = "SET_REMAINING_MESSAGES_COUNT"

export const setRemainingMessagesCount = (remainingMessagesCount) => {

    return {
        type: SET_REMAINING_MESSAGES_COUNT,
        payload: remainingMessagesCount,
    };
}

export const createTwilioSubAccount = (businessId) => (dispatch) => {
    try {
        dispatch({
            type: CREATE_TWILIO_SUB_ACCOUNT_INITIATED,
        });

        axios
            .post(
                "https://us-central1-local-worx.cloudfunctions.net/handleTwilioRequests/create-subaccount",
                {
                    businessId: businessId,
                }
            )
            .then((response) => {
                const { subaccount_sid, subaccount_authToken } = response.data;

                const businessRef = doc(db, "businesses", businessId);
                setDoc(
                    businessRef,
                    {
                        twilioSid: subaccount_sid,
                        twilioAuthToken: subaccount_authToken,
                    },
                    { merge: true }
                );

                dispatch({
                    type: CREATE_TWILIO_SUB_ACCOUNT_SUCCESSFUL,
                    payload: {
                        twilioSid: subaccount_sid,
                        twilioAuthToken: subaccount_authToken,
                    },
                });
            })
            .catch((error) => {
                console.log("Error Creating Twilio Subaccount");
                dispatch({
                    type: CREATE_TWILIO_SUB_ACCOUNT_FAILED,
                });
            });
    } catch (error) {
        console.log("Error Creating Twilio Sub acct: ", error);
    }
};

export const setBusinessId = (businessId) => {
    return {
        type: SET_BUSINESS_ID,
        payload: businessId,
    };
};

export const setBusiness = (business) => async (dispatch) => {
    dispatch({
        type: FETCH_BUSINESS_INFO_SUCCESS,
        payload: business,
    });
};
