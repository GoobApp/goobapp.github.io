import { useState } from "react";
import "../../App.css";
import LoginPanel from "./LoginPanel";
import "./Profile.css";
import SignupPanel from "./SignupPanel";

const LoginSignupButtons = () => {
  const [loginOpened, setLoginOpened] = useState(false);
  const [signupOpened, setSignupOpened] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleLoginClick = () => {
    setLoginOpened(!loginOpened);
    if (signupOpened) {
      setSignupOpened(false);
    }
  };

  const handleSignUpClick = () => {
    setSignupOpened(!signupOpened);
    if (loginOpened) {
      setLoginOpened(false);
    }
  };

  return (
    <div className="login-signup-div">
      <button className="login-signup-button" onClick={handleLoginClick}>
        Log In
      </button>
      <button className="login-signup-button" onClick={handleSignUpClick}>
        Sign Up
      </button>
      {loginOpened && <LoginPanel></LoginPanel>}
      {signupOpened && <SignupPanel></SignupPanel>}
    </div>
  );
};
export default LoginSignupButtons;
