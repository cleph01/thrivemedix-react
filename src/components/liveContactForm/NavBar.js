import styled from "styled-components";

function NavBar({ business }) {
    return (
        <Container style={{ backgroundColor: business.navBarColor }}>
            <LogoWrapper>
                <Logo src={business.logoUrl} alt="logo" />
            </LogoWrapper>
            <NavbarBody>
                <NavButton className="nav__btn">
                    <a
                        href={business.website}
                        style={{
                            color: business.backBtnColor,
                            fontWeight: "700",
                        }}
                    >
                        Go Back
                    </a>
                </NavButton>
            </NavbarBody>
        </Container>
    );
}

export default NavBar;

const Logo = styled.img``;

const NavButton = styled.div`
    margin-right: 0;
    padding: 0px 5px;
    cursor: pointer;

    > a {
        text-decoration: none;
        font-size: var(--p-font);
    }
`;

const NavbarBody = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const LogoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > img {
        width: 75px;
        height: auto;
    }
`;

const Container = styled.div`
    z-index: 100;
    width: 100%;
    height: 75px;
    color: #ffffff;
    padding: 10px;
    display: flex;
    padding: 0px 20px;

    justify-content: space-between;
    background-color: #0095ce;
    position: fixed;
    top: 0;
    box-shadow: 0 1px 6px -2px #000;
    z-index: 1;
`;
