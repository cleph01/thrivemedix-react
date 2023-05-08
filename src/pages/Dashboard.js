import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
} from "react-router-dom";

import Header from "../components/dashboard/Header";
import SideBar from "../components/dashboard/SideBar";

import styled from "styled-components";
import BusinessChatWindow from "./business/BusinessChatWindow";
import Summary from "../components/dashboard/Summary";
import Insights from "../components/insights/Insights";
import { Suspense } from "react";
import GeneralLoading from "../components/loading/GeneralLoading";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../utils/db/firebaseConfig";
import { setBusiness } from "../redux/actions/businessProfileActions";
import { connect } from "react-redux";

const Dashboard = ({ setBusiness }) => {
    const { businessId } = useParams();

    const [business, loading, error] = useDocumentData(
        doc(db, "businesses", businessId)
    );

    if (business) {
        setBusiness(business);
    }

    return (
        <Router>
            <>
                <Suspense fallback={<GeneralLoading />}>
                    <AppBody>
                        <Header />
                        <SideBar />
                        <Switch>
                            <Route exact path={`/business/hub/:businessId`}>
                                <Summary />
                            </Route>
                            <Route path={`/business/hub/:businessId/insights`}>
                                <Insights />
                            </Route>
                            <Route path={`/business/hub/:businessId/chat`}>
                                <BusinessChatWindow />
                            </Route>
                        </Switch>
                    </AppBody>
                </Suspense>
            </>
        </Router>
    );
};

export default connect(null, { setBusiness })(Dashboard);

const AppBody = styled.div`
    display: flex;
    height: 100vh;
`;
