import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import styled from "styled-components";

import { signupPaymentSuccessful } from "../redux/actions/authActions";
import { Button } from "@mui/material";

const SignupSuccessfulPage = ({ user, signupPaymentSuccessful }) => {
    const history = useHistory();

    const [counter, setCounter] = useState(15);

    const countDown = () => {
        setCounter((prev) => prev - 1);
    };

    useEffect(() => {
        signupPaymentSuccessful(user.id);

        const interval = setInterval(() => countDown(), 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            <h1>
                <span style={{ color: "blue" }}>Local</span>
                <span style={{ color: "gray" }}>Worx</span>
            </h1>

            <h2>Thanks for signing up.</h2>

            <h2>
                You will be redirected to a page where you will need to setup
                your business details
            </h2>

            <h1>{counter}</h1>

            <h2>If you are done reading...</h2>

            <Button
                onClick={() => history.push(`user/${user.id}/business/add`)}
                sx={{ fontSize: "2.5rem" }}
            >
                Click Here to Go Now
            </Button>

            {counter === 0 && (
                <Redirect
                    to={{
                        pathname: `user/${user.id}/business/add`,

                        state: { referrer: "/signup-successful" },
                    }}
                />
            )}
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
export default connect(mapStateToProps, { signupPaymentSuccessful })(
    SignupSuccessfulPage
);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 8rem 0;

    > h1 {
        font-size: var(--brand-font);
    }
`;
