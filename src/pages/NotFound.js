import styled from "styled-components";

function NotFound() {
    return (
        <Container>
            <Wrapper>
                <h1>404</h1>
                <h3>Page Not Found</h3>
            </Wrapper>
        </Container>
    );
}

export default NotFound;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-image: url("/logo192.png");
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    color: #999999;
    height: 75vh;
    background-color: #fff;
    margin: 95px 0px;
    opacity: 0.85;
    padding: 20px;
    border-radius: 5px;
`;
