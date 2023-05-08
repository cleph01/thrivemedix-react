//// PUBLIC ROUTES ////
//
// Display Public Facing Landing SMS Page
const PUBLIC_CONTACT_FORM = "/contact/:businessId";

// Login Page
const LOGIN = "/login";
// Add Business Page

//// PROTECTED ROUTES ////
//
// The Landing Page after LoggingIn
// Lists out clickable buttons to direct to
// AdminHome, SalesHome, BusinessHome depending on permision
const LOGGED_IN_LANDING_PAGE = "/welcome";

// The Dashboard page
const DASHBOARD = "/business/hub/:businessId";

// The Signup page
const SIGN_UP = "/signup";

// SignUp Successfull page; Need this page to set a flag in the db
// indicating that the user paid the signup fee. Gonna do this by setting
// the business field, and setting it with an empty array.
const SIGNUP_SUCCESSFUL_PAGE = "/signup-successful";

// Display Sales Home page
const SALES_HOME = "/sales/:userId";

// Display Business_Client Home page
const SPECIFIC_BUSINESS_HOME = "/business/:businessId";

// Display Business_Client Live Chat Interface
const BUSINESS_CHAT_WINDOW = "/business/:businessId/chat";

// Display the SmartSeed Admin Home page
const ADMIN_HOME = "/admin";

// Display User Profile Page
const USER_PROFILE = "/user/:userId";
// NESTED PAGE //
// Display User's List of Businesses
const USER_BUSINESS_LIST = "/user/:userId/business";
// Add a Business to User's List of Businesses
const USER_ADD_BUSINESS = "/user/:userId/business/add";

export {
    LOGGED_IN_LANDING_PAGE,
    DASHBOARD,
    SIGN_UP,
    SIGNUP_SUCCESSFUL_PAGE,
    SALES_HOME,
    SPECIFIC_BUSINESS_HOME,
    BUSINESS_CHAT_WINDOW,
    ADMIN_HOME,
    PUBLIC_CONTACT_FORM,
    LOGIN,
    USER_PROFILE,
    USER_BUSINESS_LIST,
    USER_ADD_BUSINESS,
};
