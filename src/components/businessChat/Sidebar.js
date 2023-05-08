import { useState } from "react";
import axios from "axios";
import { Chat, MoreVert, Phone, Search, Textsms } from "@mui/icons-material";
import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import styled from "styled-components";

import { db, auth } from "../../utils/db/firebaseConfig";
import {
    collection,
    addDoc,
    query,
    where,
    setDoc,
    doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useParams, useHistory } from "react-router-dom";
import { formatPhoneNumber } from "../../utils/lib/formatPhoneNumber";
import { connect } from "react-redux";
import TwilioBalance from "./TwilioBalance";

const Sidebar = ({ user, business }) => {
    const history = useHistory();

    const { businessId } = useParams();

    // create query with collection ref inside
    const chatsCollRef = collection(db, `businesses/${businessId}/chats`);
    // use react-firebase-hook to query collection
    const [chatsSnapshot] = useCollection(chatsCollRef);

    // Helper function to prevent duplicate channels in db
    const chatAlreadyExists = (inputCellphone) => {
        const result = chatsSnapshot?.docs.find(
            (chat) => chat.id === inputCellphone
        );

        return !!result;
    };

    // MUI Menu Logic on MoreVert Icon
    const handleRedirect = (path) => {
        history.push(path);
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (path) => {
        history.push(path);
        setAnchorEl(null);
    };

    // Logic to handle phone number input formatting

    const [cellphone, setCellphone] = useState({
        formatted: "",
        raw: "",
    });

    const handleCellChange = (e) => {
        e.preventDefault();

        // this is where we'll call our future formatPhoneNumber function that's saved in the lib dir
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        // we'll set the input value using our setInputValue

        setCellphone({
            formatted: formattedPhoneNumber,
            raw: formattedPhoneNumber.replace(/[^\d]/g, ""),
        });
    };

    // function to create chat in db
    const createChat = async () => {
        // Check if sufficient SMS balance
        if (business.remainingMessagesCount < 100) {
            alert("Please Replenish. Insufficient Sms balance");
            return;
        }

        // Check if phone number is incomplete
        if (!cellphone.raw || cellphone.raw.length < 10) {
            alert("Phone Num Incomplete");
            return;
        }

        if (
            !chatAlreadyExists(cellphone.raw) &&
            cellphone.raw !== user.cellPhone
        ) {
            // check if number is a mobile #

            axios
                .post(
                    "https://us-central1-thrivemedx.cloudfunctions.net/handleTwilioRequests/lookup-number",
                    {
                        cellPhone: `+1${cellphone.raw}`,
                    }
                )
                .then(function (response) {
                    console.log("axios res: ", response);
                    if (response.data.type === "mobile") {
                        try {
                            // adding a chat into the db chats collection
                            // between the logged in user and the cellphone entered in input
                            setDoc(
                                doc(
                                    db,
                                    `businesses/${businessId}/chats`,
                                    cellphone.raw
                                ),
                                {
                                    recipient: cellphone.raw,
                                }
                            );
                        } catch (error) {
                            console.log("error creating channel: ", error);
                        }
                    } else {
                        alert("Number not mobile");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            alert("Channel already exists");
        }
    };

    return (
        <Container>
            <SearchContainer>
                <Textsms />
                <SearchInput
                    placeholder="Enter Cellphone"
                    onChange={handleCellChange}
                    value={cellphone.formatted}
                />
            </SearchContainer>
            <SidebarButton onClick={createChat}>START A NEW CHAT</SidebarButton>

            {/* SMS Message Counter */}
            <TwilioBalance businessId={business.businessId} />

            {/* List of Chats  */}
            {chatsSnapshot?.docs.map((chat) => (
                <Message key={chat.id} chatId={chat.id} />
            ))}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        message: state.message.message,
        business: state.business.business,
    };
};

export default connect(mapStateToProps, {})(Sidebar);

const SidebarButton = styled(Button)`
    width: 100%;
    font-size: var(--font-size);

    &&& {
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
    }
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    font-size: 1.6rem;

    ::placeholder {
        font-size: var(--font-size);
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 0.2rem;

    > .MuiSvgIcon-root {
        font-size: 2.5rem;
        margin: 0 0.8rem;
        color: #ccc;
    }
`;

const Container = styled.div`
    flex: 0.4;
    background: #fff;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;
