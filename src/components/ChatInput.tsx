import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "../App.css";
import ChatExtrasButton from "./ChatExtrasButton";
import "./ChatInput.css";
import ChatSendButton from "./ChatSendButton";

const ChatInput = forwardRef(({ onSend }: { onSend: () => void }, ref) => {
  // Wrap the component with forwardRef so the parent can pass a ref;  useImperativeHandle exposes methods to that ref
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaValue, setTextAreaValue] = useState(""); // useState is used to make React update stuff on the screen when something changes

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(event.target.value); // for some reason React makes setting vars a function with useState. probably because it needs to update the page
  };

  const onSubmit = (event: FormEvent | KeyboardEvent) => {
    if (textAreaValue.length <= 1001) {
      onSend(); // This will send the onSend function up to the parent
    }
  };

  useImperativeHandle(ref, () => ({
    // Think of this as a more complex version of a public method in C#
    getInputValueToSend: () => {
      // This is one of these methods, and adding more is like adding to a dictionary. This one just returns the current value.
      if (!textAreaRef.current) return; // Typescript thing to ensure safety, otherwise error. Just makes sure inputRef is not null
      textAreaRef.current.value = "";
      setTextAreaValue("");
      return textAreaValue;
    },
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "Enter" && !event.shiftKey) {
        if (textAreaRef.current) {
          if (textAreaValue.trim() != "") {
            onSubmit(event);
          }
        }
        event.preventDefault(); // Prevent the default beheivor of stuff (textarea, form, etc). In this case its for textarea
        return;
      }
      // This will focus the input box any time any character is pressed, as long as it's a valid character.
      const otherKeys = [
        "Shift",
        "CapsLock",
        "ArrowDown",
        "ArrowUp",
        "ArrowRight",
        "ArrowLeft",
        "Tab",
        "Escape",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "Insert",
        " ",
      ];
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        otherKeys.includes(event.key)
      )
        return; // Don't refocus if it's not a valid character
      if (document.activeElement !== textAreaRef.current) {
        // Only refocus if it's not already focused
        if (!textAreaRef.current) return; // Typescript thing to ensure safety, otherwise error. Just makes sure inputRef is not null
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(
          textAreaRef.current.selectionEnd,
          textAreaRef.current.selectionEnd
        ); // FIXME: doesn't work yet; aims to reset the typing back to the final character instead of saving the previous selection
      }
    };

    document.addEventListener("keydown", handleKeyDown); // Do this always when on key down

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }; // Once everything is done and cleaning up, remove the event listener. Not a great garbage collection in react/js D:
  }, [textAreaValue]);

  return (
    <form
      className="chat-input-form"
      id="chatInputForm"
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <ChatExtrasButton></ChatExtrasButton>
      <span className="chat-input-div" role="textbox">
        <textarea
          className="chat-input"
          id="chatInput"
          placeholder="Type here..."
          maxLength={1001}
          ref={textAreaRef}
          onChange={onChange}
        />
        <p className="chat-input-char-limit">{textAreaValue.length}/1001</p>
      </span>
      <ChatSendButton onSend={onSend}></ChatSendButton>
    </form>
  );
});
ChatInput.displayName = "ChatInput";

export default ChatInput;
