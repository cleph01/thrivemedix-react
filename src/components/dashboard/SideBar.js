import {
    Add,
    Apps,
    BookmarkBorder,
    Create,
    Drafts,
    ExpandLess,
    ExpandMore,
    FiberManualRecord,
    FileCopy,
    Inbox,
    InsertComment,
    PeopleAlt,
    Insights,
} from "@mui/icons-material";

import styled from "styled-components";
import SideBarOption from "./SideBarOption";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../utils/db/firebaseConfig";
import { collection } from "firebase/firestore";
import { connect } from "react-redux";
import { Avatar } from "@mui/material";

const SideBar = ({ user, business }) => {
    const [channels, loading, error] = useCollection(collection(db, "rooms"));

    return (
        <SideBarContainer>
            <SideBarHeader>
                <SideBarInfo>
                    <h2>{business.businessName}</h2>
                    <h3>
                        <FiberManualRecord />
                        {user.displayName}
                    </h3>
                </SideBarInfo>
                <HeaderAvatar
                    src={user.photoURL}
                    onClick={() => auth.signOut()}
                />
            </SideBarHeader>
            <SideBarOption Icon={Insights} title="Insights" />
            <SideBarOption Icon={InsertComment} title="Chats" />
            <SideBarOption Icon={Inbox} title="Mentions & reactions" />
            <SideBarOption Icon={Drafts} title="Saved items" />
            <SideBarOption Icon={BookmarkBorder} title="Channel browser" />
            <SideBarOption Icon={PeopleAlt} title="People & user groups" />
            <SideBarOption Icon={Apps} title="Apps" />
            <SideBarOption Icon={FileCopy} title="File browser" />
            <SideBarOption Icon={ExpandLess} title="Show less" />

            <hr />
            <SideBarOption Icon={ExpandMore} title="Channels" />
            <hr />
            <SideBarOption Icon={Add} addChannelOption title="Add Channel" />
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Channels: Loading...</span>}
            {channels &&
                channels.docs.map((doc) => (
                    <SideBarOption
                        key={doc.id}
                        id={doc.id}
                        title={doc.data().name}
                    />
                ))}
        </SideBarContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        message: state.message.message,
        business: state.business.business,
    };
};

export default connect(mapStateToProps, {})(SideBar);

const SideBarInfo = styled.div`
    flex: 1;

    > h2 {
        font-size: 1.5rem;
        font-weight: 900;
        margin-bottom: 0.5rem;
    }

    > h3 {
        display: flex;
        font-size: var(--sidebar-h3-font-size);
        font-weight: 400;
        align-items: center;
    }

    > h3 > .MuiSvgIcon-root {
        font-size: var(--onlilne-icon-font-size);
        margin: 0.1rem 0.2rem 0 0;
        color: green;
    }
`;

const SideBarHeader = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding: 1.3rem;

    > .MuiSvgIcon-root {
        padding: 0.8rem;
        color: var(--icon-text-color);
        font-size: var(--icon-font-size);
        background: var(--icon-bg-color);
        border-radius: 999px;
    }
`;

// with styled components, we can edit the styleing of
// a mui component by using it as an arg
const HeaderAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const SideBarContainer = styled.div`
    background: var(--main-color);
    color: var(--text-color);
    flex: 0.3;
    border-top: 1px solid var(--border-color);
    max-width: 26rem;
    margin-top: 6rem;

    > hr {
        margin-top: 1rem;
        margin-bottom: 1rem;
        border: 1px solid var(--border-color);
    }
`;
