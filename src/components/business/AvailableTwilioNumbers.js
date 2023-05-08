import { useState } from "react";
import Button from "@mui/material/Button";

import styled from "styled-components";
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import axios from "axios";

const AvailableTwilioNumbers = ({ business }) => {
    console.log("business at available numbers: ", business.data());
    const [areaCode, setAreaCode] = useState("");
    const [twilioNumbers, setTwilioNumbers] = useState("");
    const [selectedNumber, setSelectedNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setSelectedNumber(event.target.value);
    };

    const handleNumberSearch = (event) => {
        if (areaCode !== "") {
            setLoading(true);

            axios
                .post(
                    "https://us-central1-local-worx.cloudfunctions.net/handleTwilioRequests/available-numbers",
                    {
                        areaCode: areaCode,
                    }
                )
                .then((response) => {
                    console.log("twilio numbers: ", response.data);

                    setTwilioNumbers(response.data);

                    setLoading(false);
                })
                .catch((error) => {
                    console.log("error getting twilio numbers: ", error);

                    setLoading(false);
                });
        } else {
            alert("Area Code is Empty");
        }
    };

    const saveTwilioNumber = () => {
        if (selectedNumber !== "") {
            setLoading(true);

            axios
                .post(
                    "https://us-central1-local-worx.cloudfunctions.net/handleTwilioRequests/provision-twilio-number",
                    {
                        businessId: business.data().id,
                        twilioNumber: selectedNumber,
                        subAccountSid: business.data().twilioAccountSid,
                    }
                )
                .then((response) => {
                    console.log("twilio numbers: ", response.data);

                    console.log("Provision Number response: ", response.data);

                    setLoading(false);
                })
                .catch((error) => {
                    console.log("error getting twilio numbers: ", error);

                    setLoading(false);
                });
        } else {
            alert("Select a Phone Number");
        }
    };

    console.log("selected Number: ", selectedNumber);
    return (
        <Container>
            <InputWrapper>
                <TextField
                    error={!areaCode}
                    required
                    className="input"
                    label="Area Code"
                    type="text"
                    name="areaCode"
                    placeholder="Area Code"
                    value={areaCode}
                    onChange={(e) => setAreaCode(e.target.value)}
                />
            </InputWrapper>
            <Button onClick={handleNumberSearch} disabled={loading}>
                Search Numbers{" "}
                {loading && (
                    <CircularProgress
                        style={{
                            marginLeft: "10px",
                            width: "20px",
                            height: "auto",
                        }}
                    />
                )}
            </Button>

            {twilioNumbers && (
                <Box sx={{ minWidth: 120, maxHeight: 350 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Numbers
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue=""
                            value={selectedNumber}
                            label="Numbers"
                            onChange={handleChange}
                        >
                            {twilioNumbers?.map((number) => (
                                <MenuItem
                                    key={number.phoneNumber}
                                    value={number.phoneNumber}
                                >
                                    {number.friendlyName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedNumber && (
                        <Button onClick={saveTwilioNumber} disabled={loading}>
                            Reserve {selectedNumber}
                            {loading && (
                                <CircularProgress
                                    style={{
                                        marginLeft: "10px",
                                        width: "20px",
                                        height: "auto",
                                    }}
                                />
                            )}
                        </Button>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default AvailableTwilioNumbers;

const InputWrapper = styled.div`
    width: 10.5rem;
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
            > input {
                font-family: inherit;
                text-align: center;
                font-size: var(--p-font);
            }
        }
    }
`;

const Container = styled.div`
    display: flex;
    align-items: center;
`;
