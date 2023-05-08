import { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";

import NavBar from "../../components/liveContactForm/NavBar";
import Blocked from "./Blocked";

import { db } from "../../utils/db/firebaseConfig";

import TextField from "@mui/material/TextField";

import styled from "styled-components";
import { useDocument } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc } from "firebase/firestore";
import GeneralLoading from "../../components/loading/GeneralLoading";

import "../../utils/lib/css/landingPage.css";
import { CircularProgress } from "@mui/material";

function LandingPage() {
    const { businessId } = useParams();

    const [businessExists, setBusinessExists] = useState(false);
    const [businessInfo, setBusinessInfo] = useState();

    const [message, setMessage] = useState({
        message: {
            customerCell: "",
            customerName: "",
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

    const [business, loading, error] = useDocument(
        doc(db, "businesses", businessId)
    );

    if (loading) return <GeneralLoading />;

    if (error) return <div>"error: " {error}</div>;

    if (!loading && !error && !business) {
        return <Redirect to="/page-not-found/404" />;
    }

    if (businessInfo?.isBlocked) {
        return <Blocked />;
    }

    // Using in the copyright footer to get fullYear
    const today = new Date();

    console.log("business at laive contact form: ", business.data());

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (message.message.body !== "") {
            setMessage({ ...message, submitting: true });

            const twilioPayload = {
                to: business?.data().businessCell,
                from: business?.data().twilioNumber,
                body: `New Message from LocalWorx Form: Customer Name: ${message.message.customerName} - ${message.message.body} - Call them @ : ${message.message.customerCell}`,
                businessId: businessId,
                businessName: business?.data().businessName,
            };

            // grab chat dom element
            const chat = document.getElementsByClassName("chat")[0];
            // append the "sending message"
            chat.innerHTML +=
                "<div class='yours messages'><div class='message last'>" +
                message.message.body +
                "</div></div><div id='sending' class='mine messages'><div class='message last'>Sending Your Message...</div></div>";

            // attempt to add message to Twilio Collection
            try {
                // Add a new document with a generated id.
                const docRef = await addDoc(
                    collection(db, "textMessages"),
                    twilioPayload
                );

                // If twilio message successfully added/sent
                if (docRef.id) {
                    // set Success Message
                    setMessage({
                        ...message,
                        submitting: false,
                        success: true,
                    });

                    // Grab recently appended "sending" message
                    const sendingEl = document.getElementById("sending");
                    // remove the "sending" message
                    sendingEl.remove();
                    // append "successfully sent" message
                    chat.innerHTML +=
                        "<div class='mine messages'><div class='message last'>Your message has successfully been sent!! Someone will be in touch with you shortly. ✅ </div></div>";

                    // Reset Message Fields,
                    setMessage((prevState) => ({
                        ...prevState,
                        message: {
                            ...prevState.message,
                            customerCell: "",
                            customerName: "",
                            body: "",
                        },
                    }));
                }
            } catch (error) {
                console.log("Error Creating New text message: ", error);

                // set error flag to true
                setMessage({ ...message, submitting: false, error: true });
                // append error message in chat windowm
                chat.innerHTML +=
                    "<div class='mine messages'><div class='message last'>There was an error sending your message !! 😟 Please Call us at " +
                    business?.data().businessCell +
                    "</div></div>";
            }
        } else {
            alert("Message cannot be empty");
        }
    };

    return (
        <>
            <NavBar business={business.data()} />
            <Container>
                <div id="response_div"></div>
                <div className="chat-container">
                    <header>
                        <h2>
                            Text Message
                            <br />
                            Contact Form
                        </h2>

                        <InputWrapper>
                            <TextField
                                className="input"
                                label="Your Name"
                                type="text"
                                name="customerName"
                                placeholder="Enter your Name"
                                value={message.message.customerName}
                                onChange={handleChange}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <TextField
                                className="input"
                                type="tel"
                                label="Your Phone Number"
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
                        <button
                            disabled={message.submitting}
                            className="send-button"
                            id="twilio-contact-form-submit"
                            onClick={handleSubmit}
                        >
                            {message.submitting ? "Sending..." : "Send"}
                            {message.submitting && (
                                <CircularProgress
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        color: "#fff",
                                        marginLeft: "15px",
                                    }}
                                />
                            )}
                        </button>
                    </header>
                    <div className="chat">
                        <div className="mine messages">
                            <div className="message">
                                Welcome to {business?.data().businessName}! Send
                                us a text message below and we will get in touch
                                with you shortly.
                            </div>
                            <div className="message last">
                                Include your name and your Cellphone number.
                            </div>
                        </div>
                    </div>
                    <div className="msg-input-container"></div>

                    <Footer>
                        <p>
                            Powered by{" "}
                            <span style={{ color: "blue" }}>Local</span>
                            <span style={{ color: "gray" }}>Worx</span>
                            <br />
                            Copyright &copy; {today.getFullYear()}
                        </p>
                    </Footer>
                </div>
            </Container>
        </>
    );
}

export default LandingPage;

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    font-size: small;
    color: #979595;
    margin-top: 0.8rem;
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

    > .MuiFormControl-root {
        > .MuiInputBase-root {
            font-size: 16px;
        }
    }
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
    font-size: var(--p-font);
`;
