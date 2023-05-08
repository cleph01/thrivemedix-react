import React, { Suspense, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import GeneralLoading from "../../components/loading/GeneralLoading";

import { ButtonGroup, IconButton, TextField } from "@mui/material";
import {
    AccountCircle,
    AutoGraph,
    ContentCopy,
    Edit,
    FormatListNumbered,
    Storefront,
    Textsms,
} from "@mui/icons-material";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../../utils/db/firebaseConfig";
import { connect } from "react-redux";

import { setBusiness } from "../../redux/actions/businessProfileActions";
import AvailableTwilioNumbers from "../../components/business/AvailableTwilioNumbers";
import ToolTip from "../../components/ToolTip";
import CopyToClipboard from "react-copy-to-clipboard";

const SpecificBusinessPage = ({ setBusiness }) => {
    const { businessId } = useParams();
    const history = useHistory();

    const [business, loading, error] = useDocument(
        doc(db, "businesses", businessId)
    );

    if (business) {
        setBusiness(business.data());
    }

    // handle menu choice click from icons
    const handleMenuIconClick = (menuChoice) => {
        setMenuChoice(menuChoice);
    };

    // menu selection state from icon clicks; determines which component we show below icon bar
    const [menuChoice, setMenuChoice] = useState();

    const showSelectionWindow = () => {
        switch (menuChoice) {
            case "msgLog":
                return <MessageLog />;
            case "stats":
                return <Stats />;
            default:
                return <Account />;
        }
    };
    return (
        <Suspense fallback={<GeneralLoading />}>
            <Container>
                <HeaderIcons>
                    <IconContainer
                        onClick={() => {
                            business.data().twilioNumber
                                ? history.push(`/business/${businessId}/chat`)
                                : alert("Select a Number Below to Enable");
                        }}
                    >
                        <IconButton>
                            <Textsms />
                        </IconButton>
                        <p>Live SMS </p>
                    </IconContainer>
                    <IconContainer
                        onClick={() => handleMenuIconClick("msgLog")}
                    >
                        <IconButton>
                            <FormatListNumbered />
                        </IconButton>
                        <p>Msg Log</p>
                    </IconContainer>
                    <IconContainer onClick={() => handleMenuIconClick("stats")}>
                        <IconButton>
                            <AutoGraph />
                        </IconButton>
                        <p>Stats</p>
                    </IconContainer>
                    <IconContainer
                        onClick={() => handleMenuIconClick("account")}
                    >
                        <IconButton>
                            <Storefront />
                        </IconButton>
                        <p>Account</p>
                    </IconContainer>
                </HeaderIcons>

                <Box>{showSelectionWindow()}</Box>
            </Container>
        </Suspense>
    );
};

export default connect(null, { setBusiness })(SpecificBusinessPage);

const IconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    > p {
        font-size: 1.2rem;
    }

    > .MuiButtonBase-root > .MuiSvgIcon-root {
        font-size: 2.6rem;
    }
`;
const HeaderIcons = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 2rem 0.5rem;
    background: whitesmoke;
`;

const Box = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: calc(var(--vh, 1vh) * 85);
    padding: 0 1rem;
`;

const MessageLog = () => {
    return <div>Message Log</div>;
};

const Stats = () => {
    return <div>Stats</div>;
};

const Account = () => {
    const { businessId } = useParams();

    const [business, loading, error] = useDocument(
        doc(db, "businesses", businessId)
    );

    if (loading) return <GeneralLoading />;
    if (error) return <div>"error: " {error}</div>;

    console.log("business at profile: ", business.data());
    return (
        <Content>
            <h2>Account</h2>
            <ItemWrapper>
                <Title>Business Name: </Title>
                <TextInput>
                    <div>{business.data().businessName}</div>
                    <div>
                        <Edit />
                    </div>
                </TextInput>
            </ItemWrapper>
            <ItemWrapper>
                <Title>Website: </Title>
                <TextInput>
                    <div>{business.data().website} </div>
                    <div>
                        <Edit />
                    </div>
                </TextInput>
            </ItemWrapper>
            <ItemWrapper>
                <Title>Business Cell Phone: </Title>
                <TextInput>
                    <div>{business.data().businessCell} </div>
                    <div>
                        <Edit />
                    </div>
                </TextInput>
            </ItemWrapper>
            <ItemWrapper>
                <Title>Back Button Color: </Title>
                <TextInput>
                    <div>{business.data().backBtnColor} </div>
                    <div>
                        <Edit />
                    </div>
                </TextInput>
            </ItemWrapper>
            <ItemWrapper>
                <Title>Nav Bar Color: </Title>
                <TextInput>
                    <div>{business.data().navBarColor} </div>
                    <div>
                        <Edit />
                    </div>
                </TextInput>
            </ItemWrapper>
            <ItemWrapper>
                <Title>Logo Url: </Title>
                <TextInput>
                    <div>
                        {business.data().logoUrl.length > 25
                            ? business.data().logoUrl.slice(0, 25) + "..."
                            : business.data().logoUrl}{" "}
                    </div>
                    <div>
                        <Edit />
                    </div>
                </TextInput>
            </ItemWrapper>
            <ItemWrapper>
                <Title>Contact Form Link: </Title>

                {/* copy btn */}
                <TextInput>
                    <CopyToClipboard
                        text={`${window.location.href.slice(
                            0,
                            window.location.href.lastIndexOf("/") - 9
                        )}/contact/${businessId}`}
                    >
                        <CopyInner>
                            <div>
                                {`${window.location.href.slice(
                                    0,
                                    window.location.href.lastIndexOf("/") - 9
                                )}/contact/${businessId}`.length > 25
                                    ? `${window.location.href.slice(
                                          0,
                                          window.location.href.lastIndexOf(
                                              "/"
                                          ) - 9
                                      )}/contact/${businessId}`.slice(0, 25) +
                                      "..."
                                    : `${window.location.href.slice(
                                          0,
                                          window.location.href.lastIndexOf(
                                              "/"
                                          ) - 9
                                      )}/contact/${businessId}`}
                            </div>
                            <ToolTip content="Copied!" direction="top">
                                <ContentCopy
                                    sx={{
                                        color: "action.active",
                                    }}
                                />
                            </ToolTip>
                        </CopyInner>
                    </CopyToClipboard>
                </TextInput>
            </ItemWrapper>
            <ItemWrapper>
                <Title>Text Number: </Title>
                {business.data().twilioNumber ? (
                    <TextInput>
                        <CopyToClipboard text={business.data().twilioNumber}>
                            <CopyInner>
                                <div>{business.data().twilioNumber}</div>
                                <ToolTip content="Copied!" direction="top">
                                    <ContentCopy
                                        sx={{
                                            color: "action.active",
                                        }}
                                    />
                                </ToolTip>
                            </CopyInner>
                        </CopyToClipboard>
                    </TextInput>
                ) : (
                    <TextInput>
                        {business.data().twilioNumber
                            ? business.data().twilioNumber
                            : "Select a Phone Number Below"}{" "}
                    </TextInput>
                )}
            </ItemWrapper>
            {!business.data().twilioNumber && (
                <ItemWrapper>
                    <AvailableTwilioNumbers business={business} />
                </ItemWrapper>
            )}
        </Content>
    );
};

const CopyInner = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
`;

const TextInput = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding-left: 1rem;
`;

const Title = styled.div`
    background: whitesmoke;
    padding: 0.8rem;
    border-radius: 0.8rem;
    flex: 0.4;
`;

const ItemWrapper = styled.div`
    display: flex;
    align-items: center;

    font-size: var(--p-font);
    margin: 0 0.5rem 1rem;
    border-bottom: 1px solid #ccc;
`;

const Content = styled.div`
    padding: 1rem 1rem;
`;
