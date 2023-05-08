import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, db } from "../../utils/db/firebaseConfig";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    QuerySnapshot,
    setDoc,
    where,
    writeBatch,
} from "firebase/firestore";

import { SET_MESSAGE } from "./messageActions";

import { SET_BUSINESS_ID } from "./businessProfileActions";

export const SIGNUP_PAYMENT_SUCCESSFUL = "SIGNUP_PAYMENT_SUCCESSFUL";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const SET_FULL_USER = "SET_FULL_USER";

export const SET_SALESPERSON_TO_USER_INITIATED =
    "SET_SALESPERSON_TO_USER_INITIATED";
export const SET_SALESPERSON_TO_USER_SUCCESS =
    "SET_SALESPERSON_TO_USER_SUCCESS";
export const SET_SALESPERSON_TO_USER_FAILED = "SET_SALESPERSON_TO_USER_FAILED";

export const FETCH_USER_INITIATED = "FETCH_USER_INITIATED";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";

export const UPDATE_USER_WITH_SUBSCRIPTION_STATUS =
    "UPDATE_USER_WITH_SUBSCRIPTION_STATUS";
export const SUBSCRIPTION_PAYMENT_FAILED = "SUBSCRIPTION_PAYMENT_FAILED";

export const loginSuccess = (authUser) => {
    return {
        type: LOGIN_SUCCESS,
        payload: authUser,
    };
};

export const logoutSuccess = () => {
    return {
        type: LOGOUT_SUCCESS,
    };
};

export const setFullUser = (user) => {
    return {
        type: SET_FULL_USER,
        payload: user,
    };
};

export const signupPaymentSuccessful = (userId) => async (dispatch) => {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { businesses: [] }, { merge: true });

        dispatch({
            type: SIGNUP_PAYMENT_SUCCESSFUL,
        });
    } catch (error) {
        console.log("error seting signup pmnt success: ", error);
    }
};

export const setSalesPersonToUser = (userObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_SALESPERSON_TO_USER_INITIATED,
        });

        // Create a batch write to tie salesperson to user
        // and include the user in the salesperson records
        const batch = writeBatch(db);

        // Tying salesperson to user
        const userRef = doc(db, "users", userObj.id);
        batch.set(
            userRef,
            { salesPersonId: userObj.salesPersonId },
            { merge: true }
        );

        // Tying salesperson to user
        const salesPersonRef = doc(db, "users", userObj.salesPersonId);
        batch.update(
            salesPersonRef,
            {
                sales: arrayUnion(userObj.id),
            },
            { merge: true }
        );

        // Commit the batch
        await batch.commit();

        dispatch({
            type: SET_SALESPERSON_TO_USER_SUCCESS,
            payload: userObj,
        });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const message = `${errorCode}: ${errorMessage}`;

        dispatch({
            type: SET_SALESPERSON_TO_USER_FAILED,
        });

        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });
    }
};

export const fetchSubscriberStatus = (userId) => async (dispatch) => {
    console.log("bollocks");
    try {
        const querySnapshot = await getDocs(
            collection(db, `user/${userId}/subscriptions`)
        );

        let doc;

        if (querySnapshot.length > 0) {
            querySnapshot.forEach((record) => {
                doc = record;
            });

            dispatch({
                type: UPDATE_USER_WITH_SUBSCRIPTION_STATUS,
                payload: doc,
            });

            console.log("Updated Use Doc in Fetch New Status: ", doc);
            return doc;
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const message = `${errorCode}: ${errorMessage}`;

        dispatch({
            type: SUBSCRIPTION_PAYMENT_FAILED,
        });

        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });
    }
};

export const register =
    (firstName, lastName, email, password, businessId) => (dispatch) => {
        try {
            const q = query(
                collection(db, "users"),
                where("email", "==", email)
            );

            const querySnapshot = getDocs(q);

            if (querySnapshot.length > 0) {
                dispatch({
                    type: SET_MESSAGE,
                    payload: "Account Exists. Please Sign In",
                });
            } else {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        console.log("UserCredential: ", userCredential);
                        const user = {
                            id: userCredential.user.uid,
                            firstName: firstName.toLowerCase(),
                            lastName: lastName.toLowerCase(),
                            email: userCredential.user.email,
                            imageURL: null,
                            businesses: [businessId],
                            createdAt: userCredential.user.metadata.createdAt,
                        };

                        const userRef = doc(
                            db,
                            "users",
                            userCredential.user.uid
                        );
                        setDoc(userRef, user, { merge: true });

                        dispatch({
                            type: REGISTER_SUCCESS,
                        });

                        dispatch({
                            type: SET_BUSINESS_ID,
                            payload: businessId,
                        });

                        dispatch({
                            type: SET_MESSAGE,
                            payload: "Account Created Successfuly",
                        });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        let message;

                        switch (errorCode) {
                            case "auth/email-already-in-use":
                                message =
                                    "Email Already in Use. Please Sign In.";
                                break;

                            case "auth/weak-password":
                                message =
                                    "Password should be at least 6 characters";

                                break;
                            default:
                                message = `${errorCode}: ${errorMessage}`;
                                break;
                        }

                        dispatch({
                            type: REGISTER_FAIL,
                        });

                        dispatch({
                            type: SET_MESSAGE,
                            payload: message,
                        });
                    });
            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const message = `${errorCode}: ${errorMessage}`;

            dispatch({
                type: REGISTER_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
        }
    };

// export const login = (email, password) => (dispatch) => {
//     return signInWithEmailAndPassword(auth, email, password)
//         .then(async (userCredential) => {
//             // const user = userCredential.user;
//             dispatch({
//                 type: LOGIN_SUCCESS,
//             });
//         })
//         .catch((error) => {
//             console.log("Login Error: ", error);
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             const message = `${errorCode}: ${errorMessage}`;

//             dispatch({
//                 type: LOGIN_FAIL,
//             });

//             dispatch({
//                 type: SET_MESSAGE,
//                 payload: "No Record Found",
//             });
//         });
// };

// export const logout = () => (dispatch) => {
//     signOut(auth)
//         .then(() => {
//             dispatch({
//                 type: LOGOUT,
//             });
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             const message = `${errorCode}: ${errorMessage}`;

//             dispatch({
//                 type: SET_MESSAGE,
//                 payload: message,
//             });
//         });
// };

export const fetchUser = (authUser) => async (dispatch) => {
    console.log("AuthUSer at fetch: ", authUser);
    dispatch({
        type: "FETCH_USER_INITIATED",
    });
    try {
        const docRef = doc(db, "users", "WHyxIO2kW4hCtAWugdcF2NLDhzK2");
        const docSnap = await getDoc(docRef);

        console.log("docsnap: ", docSnap.id, docSnap, docSnap.data());
        if (docSnap.exists()) {
            const user = { id: docSnap.id, ...docSnap.data() };

            dispatch({
                type: FETCH_USER_SUCCESS,
                payload: user,
            });

            // dispatch({
            //     type: SET_BUSINESS_ID,
            //     payload: docSnap.data().businesses[0],
            // });
        }
    } catch (error) {
        throw error;
    }
};

export const getAuthenticationStatus = () => {
    return localStorage.getItem("isAuthenticated");
};
