import "../../App.css";

const ChatSendButton = ({
  onSend,
  disabled,
}: {
  onSend: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      id="sendButton"
      className="chat-send-button"
      onClick={onSend}
      disabled={disabled}
    >
      ↑
    </button>
  );
};

export default ChatSendButton;
