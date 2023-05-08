import { lazy } from "react";

//// PUBLIC PAGE COMPONENTS ////
//
// Landing Page
const LiveContactForm = lazy(() => import("../pages/business/LiveContactForm"));

// Login Page
const Login = lazy(() => import("../pages/Login"));

/* ----------------------------- */

//// PRIVATE PAGE COMPONENTS ////
//
// LoggedIn Landing Page
const LoggedInLandingPage = lazy(() =>
    import("../pages/LoggedInLandingPage.js")
);

// the Dashboard
const Dashboard = lazy(() => import("../pages/Dashboard.js"));

///////

// Signup Landing Page
const SignupLandingPage = lazy(() =>
    import("../components/loggedInLandingPage/SignUp")
);

// Signup Successful Page
const SignupSuccessfulPage = lazy(() =>
    import("../pages/SignupSuccessfulPage.js")
);

// Admin Home
// const AdminHome = lazy(() => import("../pages/admin/AdminHome.js"));

// Specific Business Page
const SpecificBusinessHome = lazy(() =>
    import("../pages/business/SpecificBusinessHome.js")
);

// Business Chat Window
const BusinessChatWindow = lazy(() =>
    import("../pages/business/BusinessChatWindow.js")
);

// Sales Home
// const SalesHome = lazy(() => import("../pages/sales/SalesHome.js"));

// Demo Text Page
const DemoText = lazy(() => import("../pages/sales/DemoContactForm"));

// Add Business Page
// const AddBusiness = lazy(() => import("../components/user/AddBusiness"));

// All Clients Page
// const ClientList = lazy(() => import("../pages/sales/ClientList"));

// User Profile Page
// const UserProfilePage = lazy(() => import("../pages/user/UserProfilePage"));

// Not Found Page
const NotFound = lazy(() => import("../pages/NotFound"));

export {
    LoggedInLandingPage,
    Dashboard,
    SignupLandingPage,
    SignupSuccessfulPage,
    // AdminHome,
    SpecificBusinessHome,
    BusinessChatWindow,
    // SalesHome,
    LiveContactForm,
    Login,
    DemoText,
    // AddBusiness,
    // ClientList,
    // UserProfilePage,
    NotFound,
};
