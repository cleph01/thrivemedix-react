import { Avatar } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { auth, db } from "../../utils/db/firebaseConfig";
import { getRecipientCellPhone } from "../../utils/lib/chatModel";

const Recipient = ({ chatId }) => {
    
    // Get recipient snapshot in order to populate header
    const recipientQuery = query(
        collection(db, "users"),
        where("cellPhone", "==", chatId)
    );
    const [recipientSnapshot, loading, error] = useCollection(recipientQuery);

    if (error) {
        return <strong>Error: {JSON.stringify(error)}</strong>;
    }

    if (loading) {
        return <span>Document: Loading...</span>;
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientCellPhone = chatId;

    return (
        <>
            {recipient ? (
                <Avatar
                    src={recipient?.photoURL}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <Avatar referrerPolicy="no-referrer" />
            )}

            <HeaderInformation>
                <h3>{recipient ? recipient.displayName : chatId}</h3>
                {recipientSnapshot ? (
                    <p>
                        Last active: {"  "}
                        {recipient?.lastSeen ? (
                            <TimeAgo datetime={recipient?.lastSeen.toDate()} />
                        ) : (
                            "unavailable"
                        )}
                    </p>
                ) : (
                    <p>Loading last active...</p>
                )}
            </HeaderInformation>
        </>
    );
};

export default Recipient;

const HeaderInformation = styled.div`
    margin-left: 1.5rem;
    flex: 1;

    > h3 {
        font-size: 1.4rem;
        margin-bottom: 0.3rem;
    }

    > p {
        font-size: 1.4rem;
        color: #ccc;
        margin: 0;
    }
`;
