import { useState } from "react";

import { auth, provider, signInWithPopup } from "../utils/db/firebaseConfig";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { GoogleAuthProvider } from "firebase/auth";
import styled from "styled-components";
import { Google } from "@mui/icons-material";

function Auth() {
    const [loadingUser, setLoadingUser] = useState(false);

    const handleSignIn = () => {
        // trigger spinner
        setLoadingUser(true);
        // proceed with login
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
                // ...
                setLoadingUser(false);
                console.log("Error loggin in: ", errorMessage);
                alert(errorMessage);
            });
    };

    if (loadingUser) {
        return (
            <Box sx={{ display: "flex" }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <LoginContainer>
            <LoginButton variant="outlined" onClick={handleSignIn}>
                <span>
                    <Google />
                    {"   "}
                </span>
                Sign in with Google
            </LoginButton>
        </LoginContainer>
    );
}

export default Auth;

const LoginButton = styled(Button)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 17.5rem;

    > span {
        display: inline-block;
        margin-right: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
    }
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 10rem;
    border-radius: 0.5rem;
    /* box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7); */

    > .MuiButtonBase-root.MuiButton-root {
        color: inherit;
        border: 1px solid #ccc;
    }
`;
