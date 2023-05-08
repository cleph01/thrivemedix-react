import { useState, useEffect, forwardRef } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { useParams, useRouteMatch } from "react-router-dom";

import ToolTip from "../ToolTip";

import Box from "@mui/material/Box";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import AvailableTwilioNumbers from "./AvailableTwilioNumbers";

import { db } from "../../utils/db/firebaseConfig";
import {
    arrayUnion,
    collection,
    doc,
    serverTimestamp,
    writeBatch,
} from "firebase/firestore";
import styled from "styled-components";
import { Button } from "@mui/material";
import { connect } from "react-redux";

import { createTwilioSubAccount } from "../../redux/actions/businessProfileActions";

function AddBusiness({ createTwilioSubAccount }) {
    const { userId } = useParams();

    const [newClientInfo, setNewClientInfo] = useState({
        backBtnColor: "",
        businessCell: "",
        businessName: "",
        logoUrl: "",
        navBarColor: "",
        website: "",
    });

    const [disableSubmit, setDisableSubmit] = useState(false);
    const [textPageUrl, setTextPageUrl] = useState();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [alertMsg, setAlertMsg] = useState({
        message: "",
        severity: "success",
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setNewClientInfo({
            ...newClientInfo,
            [name]: event.target.value,
        });
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackBar(false);
    };

    const handleSubmit = async () => {
        if (
            newClientInfo.backBtnColor &&
            newClientInfo.businessCell &&
            newClientInfo.businessName &&
            newClientInfo.logoUrl &&
            newClientInfo.navBarColor &&
            newClientInfo.website
        ) {
            setDisableSubmit(true);
            // Create New Business Entry in DB
            try {
                const batch = writeBatch(db);
                // Since we don't have a doc id to set, we have to generate
                // a new id; so we use the doc(collection()) vs. the doc(db, path)
                // format above
                // create id by way of creating the ref
                const businessRef = doc(collection(db, `businesses`));
                // set the new business info into batch ready
                batch.set(businessRef, {
                    timestamp: serverTimestamp(),
                    ...newClientInfo,
                    id: businessRef.id,
                    blocked: false,
                    textPageUrl: `${window.location.href.slice(
                        0,
                        window.location.href.lastIndexOf("/") - 5
                    )}/contact/${businessRef.id}`,
                });

                // Now we need to update user with the business Id in businesses arr
                const userRef = doc(db, "users", userId);

                batch.update(userRef, {
                    businesses: arrayUnion(businessRef.id),
                });

                // Commit the batch
                await batch.commit();

                // Finally, we create the Twilio Sub account
                createTwilioSubAccount(businessRef.id);

                setAlertMsg({
                    message: "Successfully Created New Business",
                    severity: "success",
                });
                setOpenSnackBar(true);
                console.log("Document written with ID: ", businessRef.id);
            } catch (error) {
                setAlertMsg({
                    message: "Error Updating Text Page Url",
                    severity: "error",
                });
                setOpenSnackBar(true);
                console.log("Error updating Text Page Url: ", error);
            }
        } else {
            setAlertMsg({
                message: "All Fields Must Be Filled In",
                severity: "error",
            });
            setOpenSnackBar(true);
        }
    };

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <Container>
            <h2>Add New Business</h2>
            <Divider />

            <InputWrapper>
                <TextField
                    className="input"
                    label="Business Name"
                    type="text"
                    name="businessName"
                    placeholder="Enter New Business Name"
                    value={newClientInfo.businessName}
                    onChange={handleChange}
                />
            </InputWrapper>
            <InputWrapper>
                <TextField
                    className="input"
                    label="Cell # Receiving Text Message"
                    type="tel"
                    name="businessCell"
                    placeholder="Receiver of Text Message"
                    value={newClientInfo.businessCell}
                    inputProps={{ maxLength: 10 }}
                    onChange={handleChange}
                />
            </InputWrapper>
            <InputWrapper>
                <TextField
                    className="input"
                    label="Website Address"
                    type="text"
                    name="website"
                    placeholder="Enter Client Website Address"
                    value={newClientInfo.website}
                    onChange={handleChange}
                />
            </InputWrapper>
            <InputWrapper>
                <TextField
                    className="input"
                    label="URL of Logo"
                    type="text"
                    name="logoUrl"
                    placeholder="Enter Logo URL"
                    value={newClientInfo.logoUrl}
                    onChange={handleChange}
                />
            </InputWrapper>
            <InputWrapper>
                <TextField
                    className="input"
                    label="Back Button Hex Code"
                    type="text"
                    name="backBtnColor"
                    placeholder="Enter Customer Name"
                    value={newClientInfo.backBtnColor}
                    onChange={handleChange}
                />
            </InputWrapper>
            <InputWrapper>
                <TextField
                    className="input"
                    label="Nav Bar Color Hex Code"
                    type="text"
                    name="navBarColor"
                    placeholder="Enter Nav Bar Color Hex Code"
                    value={newClientInfo.navBarColor}
                    onChange={handleChange}
                />
            </InputWrapper>

            <Button
                disabled={disableSubmit}
                onClick={handleSubmit}
                sx={{ fontSize: "1.7rem" }}
            >
                Submit
            </Button>

            {textPageUrl && (
                <div style={{ width: "100%" }}>
                    <CopyToClipboard
                        text={`https://smartseedtext.web.app/${textPageUrl}`}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-end",

                                mt: 2,
                            }}
                        >
                            <ToolTip content="Copied!" direction="top">
                                <ContentCopyIcon
                                    sx={{
                                        color: "action.active",
                                        mr: 1,
                                        my: 0.5,
                                    }}
                                />
                            </ToolTip>

                            <TextField
                                sx={{ width: "100%" }}
                                id="input-with-sx"
                                label="New Business Link"
                                variant="standard"
                                value={textPageUrl}
                            />
                        </Box>
                    </CopyToClipboard>
                </div>
            )}

            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                >
                    <Alert
                        onClose={handleCloseSnackBar}
                        severity={alertMsg.severity}
                        sx={{ width: "100%", fontSize: "1.4rem" }}
                    >
                        {alertMsg.message}
                    </Alert>
                </Snackbar>
            </Stack>
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        message: state.message.message,
    };
};

export default connect(mapStateToProps, { createTwilioSubAccount })(
    AddBusiness
);

const SubmitButton = styled(Button)`
    width: 100%;
    background-color: #23b0d3;
    color: #fcfcfc;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 20px;

    > .MuiButton-text {
        font-size: 2rem;
    }
`;

const InputWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    > .MuiFormControl-root {
        width: 100%;

        > label {
            font-size: var(--p-font);
            font-family: inherit;
        }

        > .MuiInputBase-root {
            font-size: var(--p-font);
            font-family: inherit;
        }
    }
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    margin: 0;
    opacity: 0.85;
    padding: 20px;
    border-radius: 5px;
`;
