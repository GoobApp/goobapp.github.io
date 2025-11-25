import ChatMessageObject from "../types/ChatMessageObject";

const createChatObject = ({
  newUserDisplayName,
  newUserID,
  newUserProfilePicture,
  newMessageContent: newUserContent,
}: {
  newUserDisplayName: string;
  newUserID: string;
  newUserProfilePicture: string | null;
  newMessageContent: string;
}) => {
  let inputObject = {
    userDisplayName: newUserDisplayName,
    userID: newUserID,
    userProfilePicture: newUserProfilePicture,
    messageContent: newUserContent,
    messageTime: new Date(),
    messageId: Date.now().toString(), // TODO: Change
  } as ChatMessageObject;

  return inputObject;
};

export default createChatObject;
