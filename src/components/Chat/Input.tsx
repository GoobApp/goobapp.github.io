import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "../../App.css";
import ChatExtrasButton from "./ExtrasButton";
import "./Input.css";
import ChatSendButton from "./SendButton";
import UIPopup from "../../utils/UIPopup";
import EmojiList from "../../types/EmojiList";
import createUIElement from "../../utils/UIElementCreator";

const ChatInput = forwardRef(({ onSend }: { onSend: () => void }, ref) => {
  // Wrap the component with forwardRef so the parent can pass a ref;  useImperativeHandle exposes methods to that ref
  const textAreaRef = useRef<HTMLParagraphElement>(null);
  const [textAreaValue, setTextAreaValue] = useState(""); // useState is used to make React update stuff on the screen when something changes
  const [isInputBlank, setIsInputBlank] = useState(true);
  const maxLength: number = 1201;

  const onChange = (event: ChangeEvent<HTMLParagraphElement>) => {
    setIsInputBlank(event.target.textContent == "");
    setTextAreaValue(event.target.innerText); // for some reason React makes setting vars a function with useState. probably because it needs to update the page
  };

  const onSubmit = (event: FormEvent | KeyboardEvent) => {
    event.preventDefault();
    if (textAreaValue.length <= maxLength) {
      if (!isInputBlank) {
        onSend(); // This will send the onSend function up to the parent
      }
    }
  };

  useImperativeHandle(ref, () => ({
    // Think of this as a more complex version of a public method in C#
    getInputValueToSend: () => {
      // This is one of these methods, and adding more is like adding to a dictionary. This one just returns the current value.
      if (!textAreaRef.current) return; // Typescript thing to ensure safety, otherwise error. Just makes sure inputRef is not null
      textAreaRef.current.innerHTML = "<br>";
      setTextAreaValue("");
      setIsInputBlank(true);
      return textAreaValue;
    },
  }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement) {
        if (document.activeElement instanceof HTMLElement) {
          let activeElement: HTMLElement = document.activeElement;
          if (
            activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLTextAreaElement ||
            activeElement.isContentEditable
          ) {
            if (
              document.activeElement.parentElement?.parentElement?.id !=
              "chatInputForm"
            )
              return; // Don't refocus if something like an input is already focused!
          }
        }
      }

      if (event.key == "Enter" && !event.shiftKey) {
        if (textAreaRef.current) {
          onSubmit(event);
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
      ) {
        return; // Don't refocus if it's not a valid character
      }

      if (document.activeElement !== textAreaRef.current) {
        if (!textAreaRef.current)
          // Only refocus if it's not already focused
          return; // Typescript thing to ensure safety, otherwise error. Just makes sure inputRef is not null
        textAreaRef.current.focus(); // Focus the text area
        const range = document.createRange(); // Create a new range object
        const selection = window.getSelection(); // Get the current selection object
        range.selectNodeContents(textAreaRef.current); // Select the element (more advanced than that i think but who knows)
        range.collapse(false); // Place the cursor at the end
        selection?.removeAllRanges(); // Remove existing selections

        // 7. Add the new range to the selection
        selection?.addRange(range);
      }
    };

    document.addEventListener("keydown", handleKeyDown); // Do this always when on key down

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }; // Once everything is done and cleaning up, remove the event listener. Not a great garbage collection in react/js D:
  }, [textAreaValue]);

  useEffect(() => {
    if (textAreaRef.current?.innerText == "") {
      textAreaRef.current.innerHTML = "<br>";
    }
  }, [textAreaRef]);

  return (
    <form
      className="chat-input-form"
      id="chatInputForm"
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <ChatExtrasButton></ChatExtrasButton>
      <div className="chat-input-div" role="textbox">
        <div
          contentEditable={"plaintext-only"}
          className="chat-input"
          id="chatInput"
          ref={textAreaRef}
          onInput={onChange}
        ></div>
        {/:[^_:\s]*$/.test(textAreaValue) && (
          <UIPopup
            elements={
              Object.entries(EmojiList).map(([name, emoji]) => (
                createUIElement({newEmoji: emoji, newName: name})
              ))
            }
          ></UIPopup>
        )
        }
        {/* {/:[^_:\s]*$/.test(textAreaValue) && (
          <UIPopup
            elements={
              Object.entries(ActiveUsers).map(([name, profilePic]) => (
                createUIElement({newEmoji: profilePic, newName: name})
              ))
            }
          ></UIPopup>
        )
        } */}
        {isInputBlank && <p className="chat-input-placeholder">Type here...</p>}
      </div>
      <ChatSendButton
        onSend={onSend}
        disabled={textAreaValue.length > maxLength}
      ></ChatSendButton>
    </form>
  );
});
ChatInput.displayName = "ChatInput";

export default ChatInput;
