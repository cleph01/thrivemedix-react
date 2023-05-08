import { useHistory } from "react-router-dom";
import styled from "styled-components";
import LandingPageSalesCard from "./LandingPageSalesCard";
import { connect } from "react-redux";
import { setBusinessId } from "../../redux/actions/businessProfileActions";

const SalesContainer = ({ sales, setBusinessId }) => {
    const history = useHistory();

    const handleRedirect = (businessId) => {
        setBusinessId(businessId);
        history.push(`/business/${businessId}`);
    };
    return (
        <CardContainer>
            <h2>Sales Clients</h2>
            {sales.map((userId, idx) => (
                <LandingPageSalesCard
                    key={userId}
                    salesClientId={userId}
                    handleRedirect={handleRedirect}
                />
            ))}
        </CardContainer>
    );
};

export default connect(null, { setBusinessId })(SalesContainer);

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
