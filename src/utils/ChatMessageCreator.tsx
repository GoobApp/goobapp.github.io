import ChatMessageObject from "../types/ChatMessageObject";

const createChatObject = ({
  newUserDisplayName,
  newUserUUID,
  newUserProfilePicture,
  newMessageContent: newUserContent,
}: {
  newUserDisplayName: string;
  newUserUUID: string;
  newUserProfilePicture: string | null;
  newMessageContent: string;
}) => {
  let inputObject = {
    userDisplayName: newUserDisplayName,
    userUUID: newUserUUID,
    userProfilePicture: newUserProfilePicture,
    messageContent: newUserContent,
    messageTime: new Date(),
    messageId: Date.now(), // This gets autoset by supabase but no reason not to set it also here (local testing)
  } as ChatMessageObject;

  return inputObject;
};

export default createChatObject;
