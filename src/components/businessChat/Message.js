import { Avatar } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { db, auth } from "../../utils/db/firebaseConfig";
import { getRecipientCellPhone } from "../../utils/lib/chatModel";

import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";

const Message = ({ chatId, business }) => {
    const { businessId } = useParams();
    // router to be used in the onClick to push the user
    // to the new route
    const history = useHistory();

    // getRecipientEmain in utils/lib/chatModel
    const q = query(collection(db, "users"), where("cellPhone", "==", chatId));
    const [recipientSnapshot] = useCollection(q);
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    // ------------- //

    const enterChat = () => {
        if (business.remainingMessagesCount <= 100) {
            alert(
                "You will not be able to reply to messages until you Buy more messages"
            );

            // Chat Id is the recipient cellPhone
            history.push(`/business/hub/${businessId}/chat/${chatId}`);
        } else {
            // Chat Id is the recipient cellPhone
            history.push(`/business/hub/${businessId}/chat/${chatId}`);
        }
    };

    return (
        <Container onClick={() => enterChat()}>
            {recipient ? (
                <UserAvatar
                    src={recipient?.photoUrl}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <UserAvatar />
            )}
            <p>{recipient ? recipient.displayName : chatId}</p>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        business: state.business.business,
        message: state.message.message,
    };
};

export default connect(mapStateToProps, {})(Message);

const UserAvatar = styled(Avatar)`
    margin: 0.5rem 2rem 0 0;
`;
const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 1.5rem;
    word-break: break-word;

    :hover {
        background-color: var(--msg-bg-color);
    }

    > p {
        font-size: var(--font-size);
    }
`;
