
import styled from "styled-components";
import LandingPageCard from "./LandingPageCard";
import { connect } from "react-redux";
import { setBusinessId } from "../../redux/actions/businessProfileActions";

const BusinessesContainer = ({ businesses, setBusinessId }) => {
    return (
        <CardContainer>
            <h2>Your Businesses</h2>
            {businesses.map((businessId, idx) => (
                <LandingPageCard
                    key={businessId}
                    businessId={businessId}
                    setBusinessId={setBusinessId}
                />
            ))}
        </CardContainer>
    );
};

export default connect(null, { setBusinessId })(BusinessesContainer);

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
