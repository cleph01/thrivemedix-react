import React, { useEffect } from "react";

import GeneralLoading from "../components/loading/GeneralLoading";
import styled from "styled-components";

import LandingPageAdminCard from "../components/loggedInLandingPage/LandingPageAdminCard";

import { db } from "../utils/db/firebaseConfig";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import BusinessesContainer from "../components/loggedInLandingPage/BusinessesContainer";
import SalesContainer from "../components/loggedInLandingPage/SalesContainer";
import { connect } from "react-redux";
import {
    setFullUser,
    setSalesPersonToUser,
} from "../redux/actions/authActions";
import SignUp from "../components/loggedInLandingPage/SignUp";
import { Button } from "@mui/material";
import { useHistory, useLocation, useParams } from "react-router-dom";
import queryString from "query-string";

const LoggedInLandingPage = ({
    authUser,
    setFullUser,
    setSalesPersonToUser,
}) => {
    const history = useHistory();

    const { search } = useLocation();
    const queryStringValue = queryString.parse(search);
    // console.log("QueryStringValue: ", queryStringValue);

    const [user, loading, error] = useDocument(doc(db, "users", authUser.uid));

    if (loading) return <GeneralLoading />;
    if (error) return <div>"error: " {error}</div>;

    // Need to parse query-string to see if salesperson exists
    if (!!queryStringValue.sid) {
        setSalesPersonToUser({
            id: user?.id,
            salesPersonId: queryStringValue.sid,
            ...user?.data(),
        });
    } else {
        // Dispatch Update of full user to redux store
        setFullUser({ id: user?.id, ...user?.data() });
    }

    /* If the user IS NOT an Admin, Salesperson, AND HAS NOT PURCHASED
                our inital signup of $300.00 then show the Buy Now Page  */

    // return
    return (
        <>
            <Container>
                {/* If the user IS NOT an Admin, Salesperson, AND HAS NOT PURCHASED
                our inital signup of $300.00 then show the Buy Now Page  */}
                {/* {!!!user?.data().businesses &&
                    !!!user?.data().sales &&
                    !!!user?.data().admin && <SignUp />} */}

                {/* If the user IS an Admin, Salesperson, OR HAS PURCHASED
                our inital signup of $300.00 then show the Account Container  */}
                {(!!user?.data().businesses ||
                    !!user?.data().sales ||
                    !!user?.data().admin) && (
                    <>
                        <h1>Choose an account</h1>
                        <h3>to continue to your admin panel</h3>

                        <Box>
                            {/* Admin Component */}
                            {user?.data().admin && <AdminContainer />}

                            {/* List of Business User has access to */}
                            {user?.data().businesses && (
                                <BusinessesContainer
                                    businesses={user.data().businesses}
                                />
                            )}

                            {/* Include Button when user.businesses array is empty */}

                            {!!user?.data().businesses &&
                                user?.data().businesses.length === 0 && (
                                    <Button
                                        onClick={() => {
                                            history.push(
                                                `/user/${authUser.uid}/`
                                            );
                                        }}
                                        sx={{
                                            width: "100%",
                                            fontSize: "1.4rem",
                                        }}
                                    >
                                        Click to Add Your First Business
                                    </Button>
                                )}

                            {/* List of Sales Clients user has */}
                            {user?.data().sales && (
                                <SalesContainer sales={user.data().sales} />
                            )}
                        </Box>
                    </>
                )}
            </Container>
        </>
    );
};

export default connect(null, { setFullUser, setSalesPersonToUser })(
    LoggedInLandingPage
);

const CardContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.6rem;
    align-items: center;
    margin-top: 0.4rem;
    width: 100%;

    > h2 {
        line-height: 1.5rem;
        padding: 1rem;
        background: whitesmoke;
        border-radius: 0.8rem;
    }
    @media (min-width: 380px) {
        width: 35rem;
    }
`;

const Box = styled.div`
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

const Inner = styled.div``;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: calc(var(--vh, 1vh) * 85);
`;

const AdminContainer = ({ businesses }) => {
    return (
        <CardContainer>
            <h2>Admin</h2>

            <LandingPageAdminCard />
        </CardContainer>
    );
};
