export const HOST = "https://easychat-3iur.onrender.com";

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;

//
export const CREATE_USER_ROUTE = `${AUTH_ROUTE}/onboardUser`;
export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/checkUser`;
export const GET_ALL_CONTACTS_ROUTE = `${AUTH_ROUTE}/get-contacts`;

//
export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-message`;
export const GET_MESSAGES = `${MESSAGES_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`;
