import cfp_button from "../assets/images/emojis/cfp/button.png";
import cfp_clicked from "../assets/images/emojis/cfp/clicked.png"
import goob from "../assets/images/goofy_goober.png";

interface EmojiDict {
  [key: string]: string; // Keys are strings, values are strings
}

export const EmojiList: EmojiDict = {
    goob: goob,
    cfp_button: cfp_button,
    cfp_clicked: cfp_clicked,
}

export default EmojiList;