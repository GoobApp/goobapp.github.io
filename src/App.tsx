import type { Session } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import ChatInput from "./components/Chat/Input";
import SwitcherPanel from "./components/Chat/UsersPanel";
import ChatWindow from "./components/Chat/Window";
import TopBar from "./components/Profile/TopBar";
import { Client } from "./components/supabase/Client";
import ChatUsersPanel from "./components/SwitcherPanel";
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

  const [username, setUsername] = useState<string | null>(null);

  const [clientUserID, setClientUserID] = useState<string>("0");
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected!");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onRateLimited = () => {
      // TODO: maybe add a ui message not just an alert
      console.error("Rate limit exceeded:");
      alert(`Please stop spamming :D`);
    };

    const clientReceiveMessage = (value: ChatMessageObject) => {
      addNewInput(value);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("client receive message", clientReceiveMessage);
    socket.on("rate limited", onRateLimited);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("client receive message", clientReceiveMessage);
      socket.off("rate limited", onRateLimited);
    };
  }, []);

  useEffect(() => {}, [messages]);

  const addNewInput = (newMessage: ChatMessageObject) => {
    newMessage.messageTime = new Date(newMessage.messageTime); // Websockets can't accept Dates, so they turn them into strings. This turns it back
    setMessages((prevMessage) =>
      prevMessage.length < 200
        ? prevMessage.concat(newMessage)
        : prevMessage.slice(1).concat(newMessage)
    );
  };

  const handleMessageSent = () => {
    if (!chatInputRef.current) return;
    if (!clientUserID) return;
    if (!username) return;

    const contentText: string = chatInputRef.current.getInputValueToSend();
    if (contentText.trim() != "") {
      // Make sure the content isn't blank!
      let message: ChatMessageObject = createChatObject({
        newUserDisplayName: username,
        newUserID: clientUserID,
        newUserProfilePicture: userProfilePicture,
        newMessageContent: contentText,
      });
      socket.emit("message sent", message, session);
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

  const [session, setSession] = useState<Session | null>(null);

  const retreiveUserData = async (session: Session) => {
    console.log("retreiving");
    const { data, error } = await Client.from("profiles")
      .select("username, profile_image_url, user_id")
      .eq("user_uuid", session.user.id)
      .single();
    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }
    setUsername(data.username);
    setUserProfilePicture(data.profile_image_url);
    setClientUserID(data.user_id);
  };

  useEffect(() => {
    const { data: authListener } = Client.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        if (session) {
          setSession(session);

          if (
            _event == "INITIAL_SESSION" ||
            "SIGNED_IN" ||
            _event == "TOKEN_REFRESHED"
          ) {
            retreiveUserData(session);
          }
        } else {
          setSession(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="wrapper">
      <TopBar
        profile={createProfileObject({
          newUserDisplayName: username,
          newUserProfilePicture: userProfilePicture,
        })}
        session={session}
      ></TopBar>
      <SwitcherPanel></SwitcherPanel>
      <ChatWindow messages={messages} ref={chatWindowRef}></ChatWindow>
      <ChatInput onSend={handleMessageSent} ref={chatInputRef}></ChatInput>
      <ChatUsersPanel></ChatUsersPanel>
    </div>
  );
};

export default App;
