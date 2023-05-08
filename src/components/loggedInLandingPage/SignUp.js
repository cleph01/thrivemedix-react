import { Star } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { db } from "../../utils/db/firebaseConfig";
import { connect } from "react-redux";
import { getApp } from "firebase/app";
import {
    getStripePayments,
    createCheckoutSession,
} from "@stripe/firestore-stripe-payments";
import { useLocation } from "react-router-dom";

const features = [
    "easy to use. customer just texts a number",
    "you get live Text-to-Web chatting",
    "sms based contact form; no more emails",
    "dedictated local phone number ",
    "1,000 initial text messages",
    "QR code display",
    "facilitate communications",
    "one upfront fee",
    "start using it now or deploy during emergency",
];
const app = getApp();
const payments = getStripePayments(app, {
    productsCollection: "products",
    customersCollection: "users",
});
const SignUp = ({ user }) => {
    const location = useLocation();
    console.log("location: ", location);
    console.log(
        "domain: ",
        `${window.location.href.slice(
            0,
            window.location.href.lastIndexOf("/")
        )}/hubbie`
    );

    const [checkoutSessionLoading, setCheckoutSessionLoading] = useState(false);

    const handlePayment = async () => {
        setCheckoutSessionLoading(true);

        const paymentData = {
            mode: "payment",
            price: "price_1MtAKDIiVTqMeBbY3Lv4wJKP", // One-time price created in Stripe
            success_url: `${window.location.href.slice(
                0,
                window.location.href.lastIndexOf("/")
            )}/signup-successful`, //http://localhost:3000/signup-successful
            cancel_url: `${window.location.href.slice(
                0,
                window.location.href.lastIndexOf("/")
            )}/hub`, // window.location.origin
        };

        const session = await createCheckoutSession(payments, paymentData);

        if (session.url) {
            setCheckoutSessionLoading(false);
            window.location.assign(session.url);
        }
    };

    // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyDAgnUWOllFkRRDObJpKaSB4vRv6IaCiBew&usqp=CAU
    return (
        <Container>
            <Header>
                <h1>Never Lose Business Again</h1>
                <h3>
                    <span style={{ color: "#48679a", fontSize: "1.3rem" }}>
                        Local
                    </span>
                    <span style={{ color: "#848689", fontSize: "1.3rem" }}>
                        Worx
                    </span>{" "}
                    protects your business during hard times
                </h3>
            </Header>
            <Image>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXhZm9BZSdKjvTxeOtJPZNJNhYDSJnU18oNA&usqp=CAU"
                    alt="lockdown"
                />
            </Image>
            <Inner>
                <Content>
                    <PunchLine>
                        Staying connected to your customers is #1
                    </PunchLine>

                    <p>Are you open, delivering, or servicing curb-side?</p>

                    <p>How do your customers know?</p>
                    <PunchLine>
                        Invest in{" "}
                        <span style={{ color: "#48679a" }}>Local</span>
                        <span style={{ color: "#848689" }}>Worx</span> and stay
                        connected with your customers, even in the toughest of
                        times.
                    </PunchLine>
                    <p>
                        We are an easy Text-to-Web communication tool that helps
                        your business continue running as smooth as possible.
                    </p>
                    <p>
                        Your customer simply texts your{" "}
                        <span style={{ color: "#48679a" }}>Local</span>
                        <span style={{ color: "#848689" }}>Worx</span> number
                        and you engage via a live-chat screen.
                    </p>
                </Content>

                <PricingContainer>
                    <OneTimePrice>
                        <p>
                            $300 <PricingSubtext>one-time fee</PricingSubtext>
                        </p>
                        <p>
                            $20{" "}
                            <PricingSubtext>
                                /month + $0.01 per sms
                            </PricingSubtext>
                        </p>
                        <p>
                            {" "}
                            * Monthly subscription optional after 1,000 messages
                        </p>
                        <Button
                            onClick={handlePayment}
                            disabled={checkoutSessionLoading}
                        >
                            Purchase Now {"  "}{" "}
                            {checkoutSessionLoading && (
                                <CircularProgress
                                    style={{
                                        marginLeft: "10px",
                                        width: "20px",
                                        height: "auto",
                                    }}
                                />
                            )}
                        </Button>
                    </OneTimePrice>
                    <FeatureContainer>
                        <Box>
                            <h2>Features</h2>
                            {features.map((feature, idx) => (
                                <Feature key={idx} feature={feature} />
                            ))}
                            <Button
                                onClick={handlePayment}
                                disabled={checkoutSessionLoading}
                            >
                                Purchase Now {"  "}{" "}
                                {checkoutSessionLoading && (
                                    <CircularProgress
                                        style={{
                                            marginLeft: "10px",
                                            width: "20px",
                                            height: "auto",
                                        }}
                                    />
                                )}
                            </Button>
                        </Box>
                    </FeatureContainer>
                </PricingContainer>
            </Inner>
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

export default connect(mapStateToProps, {})(SignUp);

const FeatureContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem 0;
`;

const PricingSubtext = styled.span`
    font-size: 1.4rem;
`;

const OneTimePrice = styled.div`
    font-size: var(--h2-font);
    font-weight: 700;
    width: 100%;
    padding: 1rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background: whitesmoke;

    > p:last-of-type {
        font-size: 1rem;
    }
`;

const PricingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
`;

const PunchLine = styled.p`
    font-size: var(--h2-font);
    font-weight: 700;
`;

const Content = styled.div`
    padding: 1rem 1rem;
    background: #fff;
    border-radius: 8px 8px 0 0;

    > p {
        font-size: var(--p-font);
    }

    > p:last-child {
        font-weight: 700;
    }
`;

const Image = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;

    > img {
        border-radius: 0.8rem;
    }
`;
const Header = styled.div`
    /* background: rgb(103, 138, 188, 0.5); */
    padding: 1rem;
`;

const Inner = styled.div`
    width: 35rem;
    height: 100%;
    padding: 0 1rem;
    overflow: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

const Container = styled.div`
    padding: 1rem 2rem;
    color: var(--text-color);
    background: whitesmoke;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: calc(var(--vh, 1vh) * 95);
`;

const Feature = ({ feature }) => {
    return (
        <FeatureWrapper>
            <Star />
            <p>{feature}</p>
        </FeatureWrapper>
    );
};

const Box = styled.div`
    margin-bottom: 1rem;
`;
const FeatureWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0 1rem;

    > p {
        font-size: var(--p-font);
    }
    > .MuiSvgIcon-root {
        margin-right: 0.5rem;
        color: var(--rating-star-color);
    }
`;
