import "../../App.css";
import cfp_button from "../../assets/images/emojis/cfp/button.png";
import cfp_clicked from "../../assets/images/emojis/cfp/clicked.png";
import goob from "../../assets/images/goofy_goober.png";
import "./Message.css";

interface EmojiDict {
  [key: string]: string; // Keys are strings, values are strings
}

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
  const emojis: EmojiDict = {
    goob: goob,
    cfp_button: cfp_button,
    cfp_clicked: cfp_clicked,
  };

  const splitContent = content.split(/(:[^:]+:)/);
  const styledContent = splitContent.map((item) => {
    if (item[0] === ":" && item[item.length - 1] === ":") {
      const emojiName = item.slice(1, item.length - 1);
      if (emojiName in emojis) {
        if (item === content) {
          return (
            <img
              key={item}
              className="chat-message-content-emoji-big"
              src={emojis[emojiName]}
            ></img>
          );
        }

        return (
          <img
            key={item}
            className="chat-message-content-emoji"
            src={emojis[emojiName]}
          ></img>
        );
      } else {
        return <div className="chat-message-content-text">{item}</div>;
      }
    } else {
      return <div className="chat-message-content-text">{item}</div>;
    }
  });

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
        <div className="chat-message-no-avatar"></div>
      )}
      {showAvatar && (
        <p className="chat-message-display-name">
          {userID == "0" ? "Deleted user" : displayName}
        </p>
      )}
      {showAvatar && <p className="chat-message-time">{time}</p>}
      <pre className="chat-message-content">{styledContent}</pre>
    </div>
  );
};

export default MessageDisplay;
