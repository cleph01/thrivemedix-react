// Filters out the RecipientCellPhone from the chat-message users array
// which is an array that holds who the chat conversation is between
const getRecipientCellPhone = (users, userLoggedIn) =>
    users?.filter(
        (userToFilter) => userToFilter !== userLoggedIn?.cellPhone
    )[0];

export { getRecipientCellPhone };
