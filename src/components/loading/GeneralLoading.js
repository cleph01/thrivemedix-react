import { Skeleton } from "@mui/material";
import React from "react";
import styled from "styled-components";

const GeneralLoading = () => {
    return (
        <Container>
            <Skeleton variant="rectangular" width={350} height={218} />
        </Container>
    );
};

export default GeneralLoading;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;
