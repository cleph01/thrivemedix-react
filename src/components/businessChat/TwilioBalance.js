import {
    collectionGroup,
    doc,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { connect } from "react-redux";
import styled from "styled-components";
import { db } from "../../utils/db/firebaseConfig";
import GeneralLoading from "../loading/GeneralLoading";

import { setRemainingMessagesCount } from "../../redux/actions/businessProfileActions";
import ReplenishButton from "./ReplenishButton";

const TwilioBalance = ({ businessId, setRemainingMessagesCount }) => {
    const [business, loading, error] = useDocument(
        doc(db, "businesses", businessId)
    );

    if (loading) return <GeneralLoading />;
    if (error) return <div>"error: " {error}</div>;

    return (
        <Container>
            <Count
                twilioNumber={business?.data().twilioNumber}
                currPurchasedCount={business?.data().twilioSmsPurchased}
                setRemainingMessagesCount={setRemainingMessagesCount}
            />
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        business: state.business.business,
        message: state.message.message,
    };
};

export default connect(mapStateToProps, { setRemainingMessagesCount })(
    TwilioBalance
);

const Container = styled.div`
    padding: 0.5rem 2rem;
    font-size: var(--p-font);

    &&& {
        border-bottom: 1px solid var(--border-color);
    }
`;

const Count = ({
    twilioNumber,
    currPurchasedCount,
    setRemainingMessagesCount,
}) => {
    const [totalSmsCount, setTotalSmsCount] = useState();
    const [messagesRemaining, setMessagesRemaining] = useState();

    useEffect(() => {
        // Query to retrieve count of ALL messages sent/received by a
        // business filtered by their twilio number
        const twilioMsgsQuery = query(
            collectionGroup(db, `messages`),
            where("twilioNumber", "==", twilioNumber)
        );

        const unsubscribe = onSnapshot(twilioMsgsQuery, (querySnapshot) => {
            setTotalSmsCount(querySnapshot.docs.length);
            setMessagesRemaining(
                currPurchasedCount - querySnapshot.docs.length
            );

            // Dispatch Redux action to update business store
            setRemainingMessagesCount(
                currPurchasedCount - querySnapshot.docs.length
            );
        });

        return () => unsubscribe();
    }, []);

    // Dispatch an Update to the Business State with Twilio Remaining Msg count
    // if (messagesRemaining) {
    //     setRemainingMessagesCount(messagesRemaining);
    // }

    return (
        <TextWrapper alert={messagesRemaining <= 100}>
            {messagesRemaining <= 100 ? (
                <>
                    <Text>Remaining Balance: ${messagesRemaining * 0.01}</Text>
                    <ReplenishButton />
                </>
            ) : (
                <>
                    <Text>Messages Remaining: {messagesRemaining}</Text>
                    <BuyButton>Replenish</BuyButton>
                </>
            )}
        </TextWrapper>
    );
};

const BuyButton = styled.div`
    padding: 1rem;
    border: 1px solid;
    border-radius: 1rem;
`;

const Text = styled.div`
    font-size: var(--p-font);
`;

const TextWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${(props) => (props.alert ? "red" : "inherit")};
`;
