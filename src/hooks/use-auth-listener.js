import { useState, useEffect } from "react";
import { db, auth } from "../utils/db/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function useAuthListener() {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem("authUser"))
    );

    useEffect(() => {
        const listener = onAuthStateChanged(auth, (authUser) => {
            // we have a user, therefore we can store the user in localstorage
            if (authUser) {
                localStorage.setItem("authUser", JSON.stringify(authUser));

                setAuthUser(authUser);
            } else {
                // we don't have an authUser, therefore clear the localstorage
                localStorage.removeItem("authUser");

                // Set AuthUser to NULL returen in hook
                setAuthUser(null);
            }
        });
        return () => {
            listener();
        };
    }, []);

    return { authUser };
}
export default useAuthListener;
