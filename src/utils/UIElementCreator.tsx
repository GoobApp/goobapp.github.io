import UIElement from "../types/UIElementObject";

const createUIElement = ({
  newEmoji,
  newName,
}: {
  newEmoji: string | null;
  newName: string;
}) => {
  let inputObject = {
    emoji: newEmoji,
    name: newName,
  } as UIElement;

  return inputObject;
};

export default createUIElement;
