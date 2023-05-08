import { useState, useRef } from "react";

import { db } from "../../utils/db/firebaseConfig";

import TextField from "@mui/material/TextField";

import styled from "styled-components";

const businessInfo = {
    logoUrl: "/logo.png",
    website: "https://www.smartseed.agency/",
    navBarColor: "#ffffff",
    backBtnColor: "#55c0da",
};

function DemoText({ user }) {
    const chatRef = useRef();

    const [message, setMessage] = useState({
        message: {
            customerCell: "",
            customerName: "",
            rooferCell: "",
            body: "",
        },
        submitting: false,
        error: false,
        success: false,
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setMessage((prevState) => ({
            ...prevState,
            message: { ...prevState.message, [name]: event.target.value },
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage({ ...message, submitting: true });

        const twilioPayload = {
            to: message.message.rooferCell,
            body: `New Message from Contact Form: Customer Name: ${message.message.customerName} - ${message.message.body} - Call them @ : ${message.message.customerCell}`,
            repId: user.userId,
            displayName: user.displayName,
            demo: true,
        };

        const chat = document.getElementsByClassName("chat")[0];

        chat.innerHTML +=
            "<div class='yours messages'><div class='message last'>" +
            message.message.body +
            "</div></div><div id='sending' class='mine messages'><div class='message last'>Sending Your Message...</div></div>";

        db.collection("textMessages")
            .add(twilioPayload)
            .then((docRef) => {
                setMessage({ ...message, submitting: false, success: true });
                const sendingEl = document.getElementById("sending");

                sendingEl.remove();

                chat.innerHTML +=
                    "<div class='mine messages'><div class='message last'>Your message has successfully been sent!! 🙌  Someone will be in touch with you shortly. 💯</div></div>";

                // Refocus to chat window
                chatRef.current.focus();

                // Reset Message Fields, Keeping Roofer # intact
                setMessage((prevState) => ({
                    ...prevState,
                    message: {
                        ...prevState.message,
                        customerCell: "",
                        customerName: "",
                        body: "",
                        rooferName: "",
                    },
                }));
            })
            .catch((error) => {
                console.log("Error Creating New text message: ", error);

                setMessage({ ...message, submitting: false, error: true });

                chat.innerHTML +=
                    "<div class='mine messages'><div class='message last'>There was an error sending your message !! 😟 Please Call us at " +
                    businessInfo.businessCell +
                    "</div></div>";

                // Refocus to chat window
                chatRef.current.focus();
            });
    };

    console.log("User State: ", user);
    return (
        <>
            <Container>
                <ChatContainer>
                    <Header>
                        <h2>Demo Text Message Contact Form</h2>

                        <InputWrapper>
                            <TextField
                                className="input"
                                label="Demo Customer Name"
                                type="text"
                                name="customerName"
                                placeholder="Enter Customer Name"
                                value={message.message.customerName}
                                onChange={handleChange}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <TextField
                                className="input"
                                type="tel"
                                label="Demo Customer Number"
                                name="customerCell"
                                id="cellphone"
                                placeholder="NO Spaces, Dashes, or Parantheses"
                                value={message.message.customerCell}
                                onChange={handleChange}
                                inputProps={{ maxLength: 10 }}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <TextField
                                className="input"
                                type="tel"
                                label="The Cell # To Receive Test"
                                name="rooferCell"
                                id="cellphone"
                                placeholder="NO Spaces, Dashes, or Parantheses"
                                value={message.message.rooferCell}
                                onChange={handleChange}
                                inputProps={{ maxLength: 10 }}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <TextField
                                id="msg"
                                className="msg-input"
                                label="Your Message"
                                variant="outlined"
                                name="body"
                                placeholder="Enter Message (100 Characters Max)"
                                value={message.message.body}
                                onChange={handleChange}
                                inputProps={{ maxLength: 100 }}
                                multiline
                            />
                        </InputWrapper>

                        <Button
                            id="twilio-contact-form-submit"
                            onClick={handleSubmit}
                        >
                            Send
                        </Button>
                    </Header>
                    <Chat>
                        <MyMessages>
                            <Message>
                                Welcome to Valley Roofing and Siding! Send us a
                                text message below and we will get in touch with
                                you shortly.
                            </Message>
                            <LastMessage>
                                Include your name and your Cellphone number.
                            </LastMessage>
                        </MyMessages>
                    </Chat>

                    <Footer ref={chatRef}>
                        <p>Powered by SmartSeed Technologies</p>
                        <p>Copyright &copy; 2021</p>
                    </Footer>
                </ChatContainer>
            </Container>
        </>
    );
}

export default DemoText;

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    font-size: small;
    color: #979595;
`;

const Message = styled.div`
    border-radius: 20px;
    padding: 8px 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    display: inline-block;
    text-align: left;
`;

const MyMessage = styled.div`
    color: white;
    margin-left: 25%;
    background: rgb(0, 120, 254);
    position: relative;
`;

const LastMessage = styled(MyMessage)`
    :before {
        content: "";
        position: absolute;
        z-index: 0;
        bottom: 0;
        right: -8px;
        height: 20px;
        width: 20px;
        background: rgb(0, 120, 254);
        border-bottom-left-radius: 15px;
    }

    :after {
        content: "";
        position: absolute;
        z-index: 1;
        bottom: 0;
        right: -10px;
        width: 10px;
        height: 20px;
        background: white;
        border-bottom-left-radius: 10px;
    }
`;

const Messages = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
`;

const MyMessages = styled(Messages)`
    align-items: flex-end;
`;

const Chat = styled.div`
    width: 80%;
    border: solid 1px #eee;
    display: flex;
    flex-direction: column;
    margin-top: 25px;
    padding: 10px;
    border: 1px solid #000;
    border-radius: 5px;
    // box-shadow: 5px 5px 5px rgba(68, 68, 68, 0.6);
`;
const Button = styled.button`
    text-align: center;
    width: 100%;
    background-color: #68cb61;
    color: #fcfcfc;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
`;

const InputWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 70%;
    border-radius: 5px;
    background-color: #fff;
    margin: 95px;
    padding: 20px;
    opacity: 0.85;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 95px 0px;
`;
