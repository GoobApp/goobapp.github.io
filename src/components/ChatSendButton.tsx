import "../App.css";

const ChatSendButton = ({ onSend }: { onSend: () => void }) => {
  return (
    <button id="sendButton" className="chat-send-button" onClick={onSend}>
      ↑
    </button>
  );
};

export default ChatSendButton;
