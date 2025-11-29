export default interface ChatMessage {
  userDisplayName: string;
  userProfilePicture: string;
  userID: string;
  messageContent: string;
  messageTime: Date;
  messageId: string;
}
