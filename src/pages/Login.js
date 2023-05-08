import { useState, forwardRef } from "react";

import Auth from "../components/Auth";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import styled from "styled-components";

import logo from "../assets/logos/logo-text.jpg";

function Login() {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "success",
    });

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    return (
        <>
            <Container>
                <Wrapper>
                    <ImageWrapper>
                        <Logo src={logo} alt="logo" />
                    </ImageWrapper>
                    {/* <h1>
                        <span style={{ fontSize: "5.5rem", color: "#48679a" }}>
                            Thrive
                        </span>
                        <span style={{ fontSize: "5.5rem", color: "#848689" }}>
                            Medix
                        </span>
                    </h1> */}

                    <Auth
                        setAlertMsg={setAlertMsg}
                        openSnackBar={openSnackBar}
                    />
                </Wrapper>
            </Container>
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                >
                    <Alert
                        onClose={handleCloseSnackBar}
                        severity={alertMsg.severity}
                        sx={{ width: "100%" }}
                    >
                        {alertMsg.message}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    );
}

export default Login;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    height: 100vh;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    margin-top: 75px;
`;

const ImageWrapper = styled.div`
    margin-bottom: 5px;
`;

const Logo = styled.img`
    width: 200px;
    height: auto;

    @media (min-width: 400px) {
        width: 350px;
        height: auto;
    }
`;
