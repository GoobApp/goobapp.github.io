import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import "../App.css";
import ChatMessageObject from "../types/ChatMessageObject";
import MessageDisplay from "./ChatMessage";

type ChatWindowProps = {
  messages: ChatMessageObject[];
};

type ChatWindowRef = {
  scrollToBottom: () => void;
};

const ChatWindow = forwardRef<ChatWindowRef, ChatWindowProps>((props, ref) => {
  // Wrap the component with forwardRef so the parent can pass a ref;  useImperativeHandle exposes methods to that ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  let wasAtBottom = useRef<boolean>(true);

  useImperativeHandle(ref, () => ({
    // Think of this as a more complex version of a public method in C#
    scrollToBottom: () => {
      // this will, once called, animate a scroll to bottom animation
      const el = scrollContainerRef.current;
      if (!el) return;

      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    },
  }));

  useLayoutEffect(() => {
    // Runs before the screen gets rendered but after the screen gets painted
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      // sets wasAtBottom to a small pixel-perfect check. Probably should change in the future
      wasAtBottom.current =
        el.scrollTop + el.clientHeight > el.scrollHeight - 50;
    };

    handleScroll(); // Call once before starting everything
    el.addEventListener("scroll", handleScroll); // When 'scroll' gets called, handle it!
    return () => el.removeEventListener("scroll", handleScroll); // Remove when done
  }, []);

  useLayoutEffect(() => {
    // Actually handle the scrolling
    const el = scrollContainerRef.current;
    if (!el) return;
    if (wasAtBottom.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "instant",
      });
    }
  }, [props.messages]); // This is in a different useLayoutEffect as you want this to be called ONLY when messages gets updated. Don't do it on a random button click!

  return (
    <div id="chatWindow" className="chat-window" ref={scrollContainerRef}>
      {props.messages.map((message, index) => {
        let showAvatar = false;
        let showSpacer = false;

        if (index === 0) {
          showAvatar = true;
          showSpacer = false;
        } else {
          let prev = props.messages[index - 1];
          if (prev.userID !== message.userID) {
            showAvatar = true;
            showSpacer = true;
          }
        }

        return (
          <MessageDisplay
            key={message.messageId}
            profilePicture={message.userProfilePicture}
            displayName={message.userDisplayName}
            time={message.messageTime.toLocaleString(undefined, {
              dateStyle:
                new Date().getDate() != message.messageTime.getDate()
                  ? "medium"
                  : undefined,
              timeStyle: "short",
            })}
            content={message.messageContent}
            showAvatar={showAvatar}
            showSpacer={showSpacer}
          ></MessageDisplay>
        );
      })}
    </div>
  );
});
ChatWindow.displayName = "ChatWindow";

export default ChatWindow;
