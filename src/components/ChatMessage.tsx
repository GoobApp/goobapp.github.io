import "../App.css";
import "./ChatMessage.css";
// Is this the worst code i've ever written? I would care but if it works it works
const MessageDisplay = ({
  userID,
  displayName,
  time,
  content,
  profilePicture,
  showAvatar,
  showSpacer,
}: {
  userID: string;
  displayName: string;
  time: string;
  content: string;
  profilePicture: string;
  showAvatar: boolean;
  showSpacer: boolean;
}) => {
  return (
    <div
      className={
        showSpacer ? "chat-message-container-spaced" : "chat-message-container"
      }
    >
      {showAvatar ? (
        <img
          src={profilePicture}
          alt=""
          className="chat-message-profile-picture"
        />
      ) : (
        <></>
      )}
      {showAvatar ? (
        <p className="chat-message-display-name">
          {userID == "0" ? "Deleted user" : displayName}
        </p>
      ) : (
        <></>
      )}
      {showAvatar ? <p className="chat-message-time">{time}</p> : <></>}
      {showAvatar ? (
        <pre className="chat-message-content">{content}</pre>
      ) : (
        <pre className="chat-message-content-no-avatar">{content}</pre>
      )}
    </div>
  );
};

export default MessageDisplay;
