import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MiniWindow from "./components/Chat/MiniWindow";
import ChatWindow from "./components/Chat/Window";
import Layout from "./components/Layout";
import ChatLoggedOutWindow from "./components/Pages/ChatLoggedOutWindow";
import EmptyPanel from "./components/Pages/EmptyPanel";
import ErrorPage from "./components/Pages/ErrorPage";
import ExtrasList from "./components/Pages/ExtrasList";
import GamesList from "./components/Pages/GamesList";
import IFrameLearnMore from "./components/Pages/iframeLearnMore";
import PrivacyPolicy from "./components/Pages/PrivacyPolicy";
import Search from "./components/Pages/Search";
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

  const [activeUsers, setActiveUsers] = useState<UserProfile[]>([]);

  const [profile, setProfile] = useState<UserProfile>(
    createProfileObject({
      newUserDisplayName: null,
      newUserProfilePicture: null,
      newUserUUID: null,
      newUserID: null,
      newUserRole: null,
    })
  );

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected!");

      setIsConnected(true);

      if (profile.userUUID != null) {
        retrieveActiveUsers();
        socket.emit("add to active users list", profile);
      }
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
      console.log("Message received!");
      addNewInput(value);

      if (session?.user.id == value.userUUID || document.hasFocus()) return;

      setUnreadMessageCount((prevCount) => prevCount + 1);

      if ("Notification" in window) {
        const img = value.userProfilePicture;
        const notification = new Notification(
          `New message from ${value.userDisplayName}`,
          {
            body: value.messageContent,
            icon: img,
          }
        );
      }
    };

    const onRecentMessagesRequestReceived = (value: ChatMessageObject[]) => {
      value.reverse().forEach((element) => {
        addNewInput(element);
      });
    };

    const onActiveUsersRequestReceived = (users: UserProfile[]) => {
      if (users) {
        setActiveUsers(users);
      }
    };

    const onAddActiveUser = (value: UserProfile) => {
      console.log("New user joined!");

      setActiveUsers((prevActiveUsers) => {
        const newActiveUsers = prevActiveUsers.slice();
        const index = newActiveUsers.findIndex(
          (e) => e.userUUID === value.userUUID
        );

        if (index != -1) {
          newActiveUsers[index] = value;
        } else {
          newActiveUsers.push(value);
        }

        return newActiveUsers;
      });
    };

    const onRemoveActiveUser = (value: UserProfile) => {
      console.log("User left :(");
      setActiveUsers((prevActiveUsers) => {
        const newActiveUsers = prevActiveUsers.filter(
          (user) => user.userUUID !== value.userUUID
        );
        return newActiveUsers;
      });
    };

    const onMessageEdited = (messageId: number, messageContent: string) => {
      setMessages((prevMessages) => {
        const messageIndex = prevMessages.findIndex(
          (event) => event.messageId == messageId
        );
        if (messageIndex != -1) {
          const newMessages = prevMessages.slice();
          newMessages[messageIndex].isEdited = true;
          newMessages[messageIndex].messageContent = messageContent;

          return newMessages;
        } else {
          return prevMessages;
        }
      });
    };

    const onMessageDeleted = (messageId: number) => {
      setMessages((prevMessages) => {
        const messageIndex = prevMessages.findIndex(
          (event) => event.messageId == messageId
        );
        if (messageIndex != -1) {
          const newMessages = prevMessages.slice();
          newMessages.splice(messageIndex, 1);

          return newMessages;
        } else {
          return prevMessages;
        }
      });
    };

    if ((!isAuthLoading && session) || !import.meta.env.PROD) {
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("client receive message", clientReceiveMessage);
      socket.on("rate limited", onRateLimited);
      socket.on("message edited", onMessageEdited);
      socket.on("deleted message", onMessageDeleted);
      socket.on("receive recent messages", onRecentMessagesRequestReceived);
      socket.on("receive active users", onActiveUsersRequestReceived);
      socket.on("new active user", onAddActiveUser);
      socket.on("remove active user", onRemoveActiveUser);

      if ((!isAuthLoading && session) || !import.meta.env.PROD) {
        socket.auth = { token: session?.access_token };

        if (!socket.connected) {
          socket.connect();
        }
      } else {
        if (socket.connected && !isAuthLoading) {
          socket.disconnect();
        }
      }
    } else {
      console.log("Not logged in or not finished loading!");
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("client receive message", clientReceiveMessage);
      socket.off("rate limited", onRateLimited);
      socket.off("message edited", onMessageEdited);
      socket.off("deleted message", onMessageDeleted);
      socket.off("receive recent messages", onRecentMessagesRequestReceived);
      socket.off("receive active users", onActiveUsersRequestReceived);
      socket.off("new active user", onAddActiveUser);
      socket.off("remove active user", onRemoveActiveUser);
    };
  }, [session, isAuthLoading]);

  useEffect(() => {
    document.title =
      unreadMessageCount === 0 ? "GoobApp" : `GoobApp (${unreadMessageCount})`;
  }, [unreadMessageCount]);

  const onFocus = () => {
    setUnreadMessageCount(0);
    document.title = "GoobApp";
  };

  useEffect(() => {
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const addNewInput = (newMessage: ChatMessageObject) => {
    newMessage.messageTime = new Date(newMessage.messageTime); // Websockets can't accept Dates, so they turn them into strings. This turns it back
    setMessages((prevMessage) =>
      prevMessage.length < 200
        ? prevMessage.concat(newMessage)
        : prevMessage.slice(1).concat(newMessage)
    );
  };

  const handleMessageSent = (contentText: string) => {
    if (!import.meta.env.PROD && !session?.user.id) {
      let input = createChatObject({
        newUserDisplayName: "Test User",
        newUserUUID: "1",
        newUserProfilePicture: null,
        newMessageContent: contentText,
        newIsEdited: false,
      });

      addNewInput(input);

      // socket.emit("message sent", input);
      return;
    }

    if (!profile.username) return;

    if (contentText.trim() != "") {
      // Make sure the content isn't blank!
      let message: ChatMessageObject = createChatObject({
        newUserDisplayName: profile.username,
        newUserUUID: profile.userUUID,
        newUserProfilePicture: profile.userProfilePicture,
        newMessageContent: contentText,
        newIsEdited: false,
      });

      socket.emit("message sent", message);
    }
  };

  const retrieveUserData = async (session: Session) => {
    console.log("Retrieving user data...");
    if (!Client) return;
    const { data, error } = await Client.from("profiles")
      .select("username, profile_image_url, user_id, role")
      .eq("user_uuid", session.user.id)
      .single();
    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }

    const newProfile = createProfileObject({
      newUserDisplayName: data.username,
      newUserProfilePicture: data.profile_image_url,
      newUserID: data.user_id,
      newUserUUID: session.user.id,
      newUserRole: data.role,
    });

    setProfile(newProfile);
    socket.emit("add to active users list", newProfile);
  };

  const retrieveRecentMessages = () => {
    console.log("Retrieving previous messages...");
    socket.emit("request recent messages");
  };

  const retrieveActiveUsers = () => {
    console.log("Retrieving active users...");
    socket.emit("request active users");
  };

  useEffect(() => {
    if (!import.meta.env.PROD) {
      const newProfile = createProfileObject({
        newUserDisplayName: "Hampter Hampter Hampter Hampter",
        newUserUUID: "1",
        newUserProfilePicture: null,
        newUserRole: "Owner",
        newUserID: "1",
      });

      setProfile(newProfile);

      setActiveUsers([newProfile, newProfile, newProfile]);
      setIsAuthLoading(false);
      setSession(session);
    }

    if (!Client) {
      setIsAuthLoading(false);
      return;
    }

    const { data: authListener } = Client.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setIsAuthLoading(false);
        if (session) {
          setSession(session);
          if (_event == "INITIAL_SESSION") {
            retrieveUserData(session);
            retrieveRecentMessages();
            retrieveActiveUsers();
          } else if (_event == "TOKEN_REFRESHED") {
            socket.auth = { token: session?.access_token };
            if (socket.connected) {
              socket.disconnect();
            }

            if (!socket.connected) {
              socket.connect();
            }

            retrieveUserData(session);
            retrieveActiveUsers();
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
      element: (
        <Layout
          session={session}
          profileObject={profile}
          usersList={activeUsers}
          maxUsers={activeUsers.length}
          chatWindow={
            (isAuthLoading || session == null) && import.meta.env.PROD ? (
              <div className="chat-users-panel-container"></div>
            ) : (
              <MiniWindow
                messages={messages}
                sendMessage={handleMessageSent}
                clientProfile={profile}
              ></MiniWindow>
            )
          }
        ></Layout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: isAuthLoading ? (
            <EmptyPanel></EmptyPanel>
          ) : session != null || !import.meta.env.PROD ? (
            <ChatWindow
              messages={messages}
              sendMessage={handleMessageSent}
              clientProfile={profile}
            ></ChatWindow>
          ) : (
            <ChatLoggedOutWindow></ChatLoggedOutWindow>
          ),
        },
        {
          path: "/settings/*",
          element:
            (!isAuthLoading && session != null) || !import.meta.env.PROD ? (
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
          path: "/dev/logout/*",
          element: <ChatLoggedOutWindow></ChatLoggedOutWindow>,
        },
        {
          path: "/extras/*",
          element: <ExtrasList></ExtrasList>,
        },
        {
          path: "/extras/search/*",
          element: <Search></Search>,
        },
        {
          path: "/extras/search/learnmore/*",
          element: <IFrameLearnMore></IFrameLearnMore>,
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
        {
          path: "/games/amazing-game-idk-name-yet",
          element: (
            <div className="iframe-wrapper">
              <iframe
                src="https://scratch.mit.edu/projects/1175964459/embed"
                className="fullscreen-game"
                allow="fullscreen"
              ></iframe>
            </div>
          ),
        },
      ],
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
