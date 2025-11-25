import { useEffect, useRef, useState } from "react";
import "./App.css";
import ChatInput from "./components/ChatInput";
import ChatUsersPanel from "./components/ChatUsersPanel";
import ChatWindow from "./components/ChatWindow";
import ProfileTopBar from "./components/ProfileTopBar";
import SwitcherPanel from "./components/SwitcherPanel";
import { socket } from "./socket";
import ChatInputRef from "./types/ChatInputRef";
import ChatMessageObject from "./types/ChatMessageObject";
import ChatWindowRef from "./types/ChatWindowRef";
import createChatObject from "./utils/ChatMessageCreator";
import createProfileObject from "./utils/UserProfileCreator";

const App = () => {
  const [messages, setMessages] = useState<ChatMessageObject[]>([]);
  const chatInputRef = useRef<ChatInputRef>(null);
  const chatWindowRef = useRef<ChatWindowRef>(null);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(
    null
  );
  const [clientUserID, setClientUserID] = useState<string>("0");

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log("Connected!");
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function clientReceiveMessage(value: ChatMessageObject) {
      addNewInput(value);
    }

    function clientReceiveUserID(value: string) {
      setClientUserID(value);
      setUserProfilePicture("https://picsum.photos/seed/" + value + "/512");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("client receive message", clientReceiveMessage);
    socket.on("get user id", clientReceiveUserID);
    socket.on("rate limited", () => {
      // TODO: maybe add a ui message not just an alert
      console.error("Rate limit exceeded:");
      alert(`Please stop spamming :D`);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("client receive message", clientReceiveMessage);
      socket.off("rate limited", clientReceiveMessage);
    };
  }, []);

  useEffect(() => {}, [messages]);

  const addNewInput = (newMessage: ChatMessageObject) => {
    newMessage.messageTime = new Date(newMessage.messageTime); // Websockets can't accept Dates, so they turn them into strings. This turns it back
    setMessages((prevMessage) =>
      prevMessage.length < 50
        ? prevMessage.concat(newMessage)
        : prevMessage.slice(1).concat(newMessage)
    );
  };

  const handleMessageSent = () => {
    if (!chatInputRef.current) return;
    if (!clientUserID) return;
    const contentText: string = chatInputRef.current.getInputValueToSend();
    if (contentText.trim() != "") {
      // Make sure the content isn't blank!
      let message: ChatMessageObject = createChatObject({
        newUserDisplayName: "John Doe",
        newUserID: clientUserID,
        newUserProfilePicture: userProfilePicture,
        newMessageContent: contentText,
      });
      socket.emit("message sent", message);
      if (!chatWindowRef.current) return;
    }
  };

  useEffect(() => {
    if (!chatWindowRef.current) return;
    if (messages.length == 0) return;
    if (messages[messages.length - 1].userID == clientUserID) {
      chatWindowRef.current.scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="wrapper">
      <ProfileTopBar
        profile={createProfileObject({
          newUserDisplayName: "John Doe",
          newUserProfilePicture: userProfilePicture,
        })}
      ></ProfileTopBar>
      <SwitcherPanel></SwitcherPanel>
      <ChatWindow messages={messages} ref={chatWindowRef}></ChatWindow>
      <ChatInput onSend={handleMessageSent} ref={chatInputRef}></ChatInput>
      <ChatUsersPanel></ChatUsersPanel>
    </div>
  );
};

export default App;
