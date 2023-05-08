import React from "react";

import styled from "styled-components";

const LandingPageCard = ({ businessId }) => {
    return (
        <Container>
            <ImageWrapper>
                <img
                    src="https://pbs.twimg.com/media/DVM8dLZVoAAZ7do.jpg"
                    alt="logo"
                />
            </ImageWrapper>
            <ContainerText>
                <p>SmartSeed Tech</p>
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
