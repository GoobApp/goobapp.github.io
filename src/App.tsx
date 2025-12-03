import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import ChatWindow from "./components/Chat/Window";
import Layout from "./components/Layout";
import ChatLoggedOutWindow from "./components/Pages/ChatLoggedOutWindow";
import GamesList from "./components/Pages/GamesList";
import PrivacyPolicy from "./components/Pages/PrivacyPolicy";
import SettingsPage from "./components/Pages/SettingsPage";
import TOS from "./components/Pages/TOS";
import { Client } from "./components/supabase/Client";
import { socket } from "./socket";
import ChatMessageObject from "./types/ChatMessageObject";
import UserProfile from "./types/UserProfileObject";
import createChatObject from "./utils/ChatMessageCreator";
import createProfileObject from "./utils/UserProfileCreator";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessageObject[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile>(
    createProfileObject({
      newUserDisplayName: null,
      newUserProfilePicture: null,
      newUserUUID: null,
      newUserID: null,
    })
  );

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

    const onRecentMessagesRequestReceived = (value: ChatMessageObject[]) => {
      value.reverse().forEach((element) => {
        addNewInput(element, false);
      });
    };

    if (!isAuthLoading && session) {
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("client receive message", clientReceiveMessage);
      socket.on("rate limited", onRateLimited);
      socket.on("receive recent messages", onRecentMessagesRequestReceived);

      if (!socket.connected) {
        socket.connect();
      }
    } else {
      console.log("Not logged in or not finished loading!");
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("client receive message", clientReceiveMessage);
      socket.off("rate limited", onRateLimited);
      socket.off("receive recent messages", onRecentMessagesRequestReceived);

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [session, isAuthLoading]);

  // useEffect(() => {
  //   document.title =
  //     unreadMessageCount == 0 ? "GoobApp" : `GoobApp (${unreadMessageCount})`;
  // }, [unreadMessageCount]);

  // useEffect(() => {
  //   if (document.hasFocus()) {
  //     setUnreadMessageCount(0);
  //   }
  // }, [document.hasFocus()]);

  const addNewInput = (
    newMessage: ChatMessageObject,
    shouldNotify: boolean = true
  ) => {
    if (!document.hasFocus() && shouldNotify) {
      const img = newMessage.userProfilePicture;
      const notification = new Notification(
        `New message from ${newMessage.userDisplayName}`,
        {
          body: newMessage.messageContent,
          icon: img,
        }
      );
      // setUnreadMessageCount(unreadMessageCount + 1);
    }

    newMessage.messageTime = new Date(newMessage.messageTime); // Websockets can't accept Dates, so they turn them into strings. This turns it back
    setMessages((prevMessage) =>
      prevMessage.length < 200
        ? prevMessage.concat(newMessage)
        : prevMessage.slice(1).concat(newMessage)
    );
  };

  const handleMessageSent = (contentText: string) => {
    if (!import.meta.env.PROD && !profile.userUUID) {
      addNewInput(
        createChatObject({
          newUserDisplayName: "Test User",
          newUserUUID: "0",
          newUserProfilePicture: null,
          newMessageContent: contentText,
        }),
        false
      );
      return;
    }

    if (!profile.userUUID) return;
    if (!profile.username) return;

    if (contentText.trim() != "") {
      // Make sure the content isn't blank!
      let message: ChatMessageObject = createChatObject({
        newUserDisplayName: profile.username,
        newUserUUID: profile.userUUID,
        newUserProfilePicture: profile.userProfilePicture,
        newMessageContent: contentText,
      });

      socket.emit("message sent", message, session);
    }
  };

  const retreiveUserData = async (session: Session) => {
    console.log("Retreiving user data...");
    const { data, error } = await Client.from("profiles")
      .select("username, profile_image_url, user_id")
      .eq("user_uuid", session.user.id)
      .single();
    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }

    setProfile(
      createProfileObject({
        newUserDisplayName: data.username,
        newUserProfilePicture: data.profile_image_url,
        newUserID: data.user_id,
        newUserUUID: session.user.id,
      })
    );
  };

  const retreiveRecentMessages = () => {
    console.log("Retreiving previous messages...");
    socket.emit("request recent messages");
  };

  useEffect(() => {
    const { data: authListener } = Client.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setIsAuthLoading(false);
        if (session) {
          setSession(session);
          if (_event == "INITIAL_SESSION") {
            retreiveUserData(session);
            retreiveRecentMessages();
          } else if (_event == "TOKEN_REFRESHED") {
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

  const routes = [
    {
      path: "/",
      element: <Layout session={session} profileObject={profile}></Layout>,
      children: [
        {
          index: true,
          element: isAuthLoading ? (
            <div></div>
          ) : session != null ? (
            <ChatWindow
              messages={messages}
              sendMessage={handleMessageSent}
              clientUserUUID={profile.userUUID}
            ></ChatWindow>
          ) : (
            <ChatLoggedOutWindow></ChatLoggedOutWindow>
          ),
        },
        {
          path: "/settings/*",
          element:
            !isAuthLoading && session != null ? (
              <SettingsPage profile={profile}></SettingsPage>
            ) : (
              <ChatLoggedOutWindow></ChatLoggedOutWindow>
            ),
        },
        {
          path: "/tos/*",
          element: <TOS></TOS>,
        },
        {
          path: "/privacy/*",
          element: <PrivacyPolicy></PrivacyPolicy>,
        },
        {
          path: "/games/*",
          element: <GamesList></GamesList>,
        },
        {
          path: "/games/plat/*",
          element: (
            <div className="iframe-wrapper">
              <iframe
                src="https://supkittymeow.github.io/plat"
                className="fullscreen-game"
                allow="fullscreen"
              ></iframe>
            </div>
          ),
        },
        {
          path: "/games/br2/*",
          element: (
            <div className="iframe-wrapper">
              <iframe
                src="https://supkittymeow.github.io/br2"
                className="fullscreen-game"
                allow="fullscreen"
              ></iframe>
            </div>
          ),
        },
        {
          path: "/games/br3/*",
          element: (
            <div className="iframe-wrapper">
              <iframe
                src="https://supkittymeow.github.io/super_secret_banana_run_3_build_thing"
                className="fullscreen-game"
                allow="fullscreen"
              ></iframe>
            </div>
          ),
        },
        {
          path: "/games/cfp/*",
          element: (
            <div className="iframe-wrapper">
              <iframe
                src="https://supkittymeow.github.io/cfp"
                className="fullscreen-game"
                allow="fullscreen"
              ></iframe>
            </div>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <h2>Loading...</h2>,
    },
  ];

  const router = createBrowserRouter(routes, {
    basename: import.meta.env.BASE_URL,
  });

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
};
export default App;
