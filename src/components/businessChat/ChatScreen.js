import { InsertEmoticon, Mic } from "@mui/icons-material";

import {
    collection,
    query,
    orderBy,
    doc,
    serverTimestamp,
    writeBatch,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../../utils/db/firebaseConfig";

import ChatMessage from "./ChatMessage";

import { connect } from "react-redux";

const ChatScreen = ({ user, business }) => {
    const { businessId, chatId } = useParams();
    const endOfMessagesRef = useRef();
    const [chatMessage, setChatMessage] = useState("");

    const msgQuery = query(
        collection(db, `businesses/${businessId}/chats/${chatId}/messages`),
        orderBy("timestamp", "asc")
    );
    const [messagesSnapshot] = useCollection(msgQuery);

    // scroll to bottom after ever sent message
    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Handle the submitting of message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (business.remainingMessagesCount <= 100) {
            alert("Account balance too low. Please buy more messages");
        } else {
            try {
                const batch = writeBatch(db);

                // Updates the lastSeen
                const usersRef = doc(db, `users/${user.id}`);

                batch.set(
                    usersRef,
                    {
                        lastSeen: serverTimestamp(),
                    },
                    { merge: true }
                );

                // Adds Message to be OutGoing Text Collection for Twilio
                const outTextDocRef = doc(collection(db, "textMessages"));

                batch.set(outTextDocRef, {
                    to: `+${chatId}`,
                    from: business.twilioNumber,
                    body: chatMessage,
                });

                // Since we don't have a doc id to set, we have to generate
                // a new id; so we use the doc(collection()) vs. the doc(db, path)
                // format above

                // sends message
                const messagesRef = doc(
                    collection(
                        db,
                        `businesses/${businessId}/chats/${chatId}/messages`
                    )
                );

                batch.set(messagesRef, {
                    timestamp: serverTimestamp(),
                    message: chatMessage,
                    user: user.cellPhone,
                    recipient: `+${chatId}`,
                    twilioNumber: business.twilioNumber,
                    direction: "out",
                });

                await batch.commit();
                // Reset input field
                setChatMessage("");
                // Scroll to the Bottom
                // scrollToBottom();
            } catch (error) {
                console.log("error sending message: ", error);
            }
        }
    };

    return (
        <Container>
            <MesssageContainer>
                {messagesSnapshot?.docs.map((message) => (
                    <ChatMessage
                        key={message.id}
                        recipient={message.data().recipient}
                        message={{
                            ...message.data(),
                            timestamp: Date(
                                message.data().timestamp
                            ).toLocaleString(),
                        }}
                    />
                ))}
                <EndOfMessage ref={endOfMessagesRef} />
            </MesssageContainer>

            <InputContainer onSubmit={sendMessage}>
                <InsertEmoticon />
                <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                />
                <button type="submit" hidden disabled={!chatMessage}>
                    Send Message
                </button>
                <Mic />
            </InputContainer>
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

export default connect(mapStateToProps, {})(ChatScreen);

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background: whitesmoke;
    padding: 1rem;
    margin: 0 1.5rem 0;
    font-size: 17px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;

    padding: 1rem;
    position: sticky;
    /* top: calc(var(--vh, 1vh) * 100); */
    bottom: 0;
    background: #fff;
    z-index: 100;
`;

const EndOfMessage = styled.div`
    margin-bottom: 5rem;
`;

const MesssageContainer = styled.div`
    padding: 0.5rem 0.1rem 0;
    background: var(--chatscreen-bg-color);
    min-height: 100%;

    display: flex;
    flex-direction: column;
    flex: 1;
`;

const Container = styled.div`
    // this is what pushes the footer down to the bottom
    height: 100%;
`;
