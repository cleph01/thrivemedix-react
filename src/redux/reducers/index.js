import { combineReducers } from "redux";
import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import businessProfileReducer from "./businessProfileReducer";

export const rootReducer = combineReducers({
    auth: authReducer,
    message: messageReducer,
    business: businessProfileReducer,
});
