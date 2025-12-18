import { useRef, useState } from "react";
import { Link } from "react-router";
import "../../App.css";
import cfp_button from "../../assets/images/emojis/cfp/button.png";
import cfp_clicked from "../../assets/images/emojis/cfp/clicked.png";
import goob from "../../assets/images/goofy_goober.png";
import { socket } from "../../socket";
import ChatMessage from "../../types/ChatMessageObject";
import UserProfile from "../../types/UserProfileObject";
import "./Message.css";

interface EmojiDict {
  [key: string]: string; // Keys are strings, values are strings
}

const MessageDisplay = ({
  message,
  showAvatar,
  showSpacer,
  clientProfile,
}: {
  message: ChatMessage;
  showAvatar: boolean;
  showSpacer: boolean;
  clientProfile: UserProfile;
}) => {
  const [showHover, setShowHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLPreElement>(null);

  const emojis: EmojiDict = {
    goob: goob,
    cfp_button: cfp_button,
    cfp_clicked: cfp_clicked,
  };

  const urlSplitRegex =
    /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const urlTestRegex = /^(https?|ftp|file):\/\//i;

  var emojiRegex = /(:[a-zA-Z0-9_]+:)/;
  if (!message.messageContent && message.messageContent != "") return null;
  let splitContent = message.messageContent.split(emojiRegex);

  const styledContent = splitContent.map((item, index) => {
    if (item[0] === ":" && item[item.length - 1] === ":") {
      const emojiName = item.slice(1, item.length - 1);
      if (emojiName in emojis) {
        if (item === message.messageContent) {
          return (
            <img
              className="chat-message-content-emoji-big"
              src={emojis[emojiName]}
              key={index}
            ></img>
          );
        }

        return (
          <img
            className="chat-message-content-emoji"
            src={emojis[emojiName]}
            key={index}
          ></img>
        );
      } else {
        const splitItem = item.split(urlSplitRegex);
        return splitItem.map((itemItem, indexIndex) => {
          if (urlTestRegex.test(itemItem)) {
            return (
              <Link
                className="chat-message-content-text"
                key={indexIndex}
                to={`/extras/search/?q=${itemItem}`}
                viewTransition={true}
              >
                {itemItem}
              </Link>
            );
          } else {
            return (
              <div className="chat-message-content-text" key={indexIndex}>
                {itemItem}
              </div>
            );
          }
        });
      }
    } else {
      const splitItem = item.split(urlSplitRegex);
      return splitItem.map((itemItem, indexIndex) => {
        if (urlTestRegex.test(itemItem)) {
          return (
            <Link
              className="chat-message-content-text"
              key={indexIndex}
              to={`/extras/search?q=${itemItem}`}
              viewTransition={true}
            >
              {itemItem}
            </Link>
          );
        } else {
          return (
            <div className="chat-message-content-text" key={indexIndex}>
              {itemItem}
            </div>
          );
        }
      });
    }
  });

  const editClicked = () => {
    const ref = contentRef.current;
    if (ref) {
      setIsEditing(true);
      ref.contentEditable = "true";
      ref.focus();
      let range = document.createRange();
      range.selectNodeContents(ref);
      let sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const replyClicked = () => {
    console.warn("Reply not implemented!");
  };

  const deleteClicked = () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (shouldDelete) {
      socket.emit("delete message", message.messageId);
    }
  };

  const finishEdit = () => {
    const ref = contentRef.current;
    if (!ref) return;
    socket.emit("edit message", message.messageId, ref.innerText);
    cancelEdit();
  };

  const cancelEdit = () => {
    const ref = contentRef.current;
    if (!ref) return;
    ref.innerText = message.messageContent;
    ref.contentEditable = "false";
    setIsEditing(false);
  };

  const mouseOver = () => {
    setShowHover(true);
  };

  const mouseLeave = () => {
    setShowHover(false);
  };

  return (
    <div
      className={
        showHover
          ? "chat-message-container-container-hover"
          : "chat-message-container-container"
      }
      onMouseOver={mouseOver}
      onMouseLeave={mouseLeave}
    >
      <div
        className={
          showSpacer
            ? "chat-message-container-spaced"
            : "chat-message-container"
        }
      >
        {showAvatar ? (
          <img
            src={message.userProfilePicture}
            alt=""
            className="chat-message-profile-picture"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="chat-message-no-avatar"></div>
        )}
        {showAvatar && (
          <p className="chat-message-display-name">
            {message.userUUID == "0" ? "Deleted user" : message.userDisplayName}
          </p>
        )}
        {showAvatar && (
          <p className="chat-message-time">
            {message.messageTime.toLocaleString(undefined, {
              dateStyle:
                new Date().getDate() != message.messageTime.getDate()
                  ? "medium"
                  : undefined,
              timeStyle: "short",
            })}
          </p>
        )}

        <div className="chat-message-content">
          <pre className="chat-message-content" ref={contentRef}>
            {isEditing ? message.messageContent : styledContent}
          </pre>
          {message.isEdited && <p className="chat-message-edited"> (edited)</p>}
        </div>
      </div>

      {isEditing && (
        <div className="editing-hover-div">
          <button className="hover-button" onClick={finishEdit}>
            Edit
          </button>
          <button className="hover-button" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      )}
      {!isEditing && showHover && (
        <div className="hover-div">
          {((clientProfile.userUUID == message.userUUID &&
            message.messageId != null) ||
            !import.meta.env.PROD ||
            clientProfile.userRole == "Owner") && (
            <button className="hover-button" onClick={editClicked}>
              Edit
            </button>
          )}
          {/* <button className="hover-button" onClick={replyClicked}>
            Reply
          </button>
          */}

          {((clientProfile.userUUID == message.userUUID &&
            message.messageId != null) ||
            !import.meta.env.PROD ||
            clientProfile.userRole == "Owner") && (
            <button className="hover-button" onClick={deleteClicked}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;
