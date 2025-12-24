import { ChangeEvent, useRef } from "react";
import "../../App.css";
import { socket } from "../../socket";

const ChatExtrasButton = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const handleInputClick = (event: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();

    if (!event.currentTarget.files) return;

    const file = event.currentTarget.files[0];

    if (!file.type.startsWith("image/")) {
      console.error("Not an image file!");
      return;
    }

    formData.append("file", file);

    console.log(formData);
    socket.emit("upload image", formData);
  };

  return (
    <main>
      <button className="chat-extras-button" onClick={handleClick}>
        <div className="chat-extras-text">+</div>
      </button>
      <input
        type="file"
        className="chat-extras-upload-input"
        ref={inputRef}
        onChange={handleInputClick}
        accept="image/*"
      />
    </main>
  );
};

export default ChatExtrasButton;
