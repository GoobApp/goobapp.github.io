export default interface ChatMessage {
  userDisplayName: string;
  userProfilePicture: string | null;
  userID: string;
  messageContent: string;
  messageTime: Date;
  messageId: string;
}
