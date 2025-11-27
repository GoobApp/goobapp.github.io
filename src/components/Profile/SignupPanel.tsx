// Modified from tutorial: https://mobisoftinfotech.com/resources/blog/app-development/supabase-react-typescript-tutorial

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { Provider } from "@supabase/supabase-js";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import "../../App.css";
import { Client } from "../supabase/Client";
import "./Profile.css";

const SignupPanel = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [passwords_match, setPasswordsMatch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError(null);
      setSignUpLoading(true);
      const profilePicture = await fetch("https://picsum.photos/512");
      const { error } = await Client.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          data: {
            name: username,
            picture: profilePicture.url,
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign up"
      );
    } finally {
      setSignUpLoading(false);
      if (!turnstileRef.current) return;
      turnstileRef.current.reset();
    }
  };

  const handleSignUpWithProvider = async (provider: Provider) => {
    try {
      setError(null);
      setSignUpLoading(true);
      Client.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (err) {
      print();
      setError(
        err instanceof Error ? err.message : "An error occurred during sign up"
      );
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleUpdatePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value == confirm_password);
  };

  const handleUpdateConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password == e.target.value);
  };

  return (
    <form className="signup-panel-form" onSubmit={handleSignUp}>
      <Turnstile
        siteKey="0x4AAAAAACDL09dyN0WgJyZL"
        onSuccess={(token) => {
          setCaptchaToken(token);
        }}
        onExpire={() => setCaptchaToken("")}
        ref={turnstileRef}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={signUpLoading}
        className="login-signup-input"
      />
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={signUpLoading}
        className="login-signup-input"
      />
      <input
        value={password}
        onChange={handleUpdatePassword}
        placeholder="Password"
        type="password"
        disabled={signUpLoading}
        className="login-signup-input"
      />
      <input
        value={confirm_password}
        onChange={handleUpdateConfirmPassword}
        placeholder="Confirm Password"
        type="password"
        disabled={signUpLoading}
        className="login-signup-input"
      />
      {!passwords_match && (
        <p className="password-error-text">Passwords do not match!</p>
      )}
      {password != "" && passwords_match && password.length < 6 && (
        <p className="password-error-text">
          Password must be at least 6 characters!
        </p>
      )}
      <br></br>
      <button
        type="submit"
        disabled={
          signUpLoading ||
          email == "" ||
          username == "" ||
          !passwords_match ||
          password == "" ||
          password.length < 6
        }
        className="login-signup-panel-button"
      >
        {signUpLoading ? "Loading..." : "Sign Up"}
      </button>
      <button type="button" onClick={() => handleSignUpWithProvider("google")}>
        Sign up with Google
      </button>
      <button type="button" onClick={() => handleSignUpWithProvider("github")}>
        Sign up with GitHub
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default SignupPanel;
