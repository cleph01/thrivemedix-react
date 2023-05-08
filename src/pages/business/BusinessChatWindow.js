import { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Sidebar from "../../components/businessChat/Sidebar";
import { Route, Switch, useParams } from "react-router-dom";
import ChatScreen from "../../components/businessChat/ChatScreen";

const BusinessChatWindow = () => {
    const { businessId } = useParams();

    return (
        <Container>
            <Helmet>
                <title>SmartSeed Text | Live SMS Chat</title>
            </Helmet>
            {/* Chat Channel List */}
            <Sidebar />
            {/* Chat Window */}
            <Switch>
                <Route exact path="/business/hub/:businessId/chat">
                    <ChatContainer>
                        <div style={{ width: "100%", flex: 0.7 }}>
                            Chat Welcome Screen
                        </div>
                    </ChatContainer>
                </Route>
                <Route exact path="/business/hub/:businessId/chat/:chatId">
                    <ChatContainer>
                        <ChatScreen />
                    </ChatContainer>
                </Route>
            </Switch>
        </Container>
    );
};

export default BusinessChatWindow;

const ChatContainer = styled.div`
    overflow: scroll;
    /* height: 100%; */

    /* height: calc(var(--vh, 1vh) * 100); */
    flex: 0.6;
    /* width: 100%; */

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

const Container = styled.div`
    display: flex;
    flex: 0.7;
    background-color: var(--chatscreen-bg-color);
    margin-top: 60px;
`;
