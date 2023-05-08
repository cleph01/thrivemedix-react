import { doc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { useDocument } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { db } from "../../utils/db/firebaseConfig";
import GeneralLoading from "../loading/GeneralLoading";

const LandingPageCard = ({ businessId, setBusinessId }) => {
    const history = useHistory();
    const [business, loading, error] = useDocument(
        doc(db, "businesses", businessId)
    );

    if (loading) return <GeneralLoading />;
    if (error) return <div>"error: " {error}</div>;

    const handleRedirect = () => {
        setBusinessId(businessId);
        history.push(`/business/hub/${businessId}`);
    };

    return (
        <Container onClick={() => handleRedirect()}>
            <ImageWrapper>
                <img src={business?.data().logoUrl} alt="logo" />
            </ImageWrapper>
            <ContainerText>
                <p>{business?.data().businessName}</p>
            </ContainerText>
        </Container>
    );
};

export default LandingPageCard;

const ContainerText = styled.div`
    > p {
        font-size: 1.2rem;
        font-weight: 500;
    }
`;

const ImageWrapper = styled.div`
    width: 2.5rem;
    height: auto;
    text-align: center;

    > img {
        width: 100%;
        height: auto;
    }
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1.4rem;

    height: 5rem;
    background: var(--bg-color);
    border-bottom: 1px solid #ccc;
    /* box-shadow: 0.25rem 0.25rem 1.5rem #657689; */

    padding: 0rem 0rem 0 1rem;
    cursor: pointer;
    transition: all 0.45s ease;

    :hover {
        transform: translateX(1rem);
    }
`;
