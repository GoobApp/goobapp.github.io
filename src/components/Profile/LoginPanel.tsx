// Modified from tutorial: https://mobisoftinfotech.com/resources/blog/app-development/supabase-react-typescript-tutorial

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { Provider } from "@supabase/supabase-js";
import { FormEvent, useRef, useState } from "react";
import "../../App.css";
import { Client } from "../supabase/Client";
import "./Profile.css";

const LoginPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [logInLoading, setLogInLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleLogIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError(null);
      setLogInLoading(true);
      const { error } = await Client.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });
      if (error) throw error;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign in"
      );
    } finally {
      setLogInLoading(false);
      if (!turnstileRef.current) return;
      turnstileRef.current.reset();
    }
  };

  const handleSignInWithProvider = async (provider: Provider) => {
    try {
      setError(null);
      setLogInLoading(true);

      const { data, error } = await Client.auth.signInWithOAuth({
        provider: provider,
      });

      if (error) throw error;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign up"
      );
    } finally {
      setLogInLoading(false);
    }
  };

  return (
    <form className="login-panel-form" onSubmit={handleLogIn}>
      <Turnstile
        siteKey="0x4AAAAAACDL09dyN0WgJyZL"
        onSuccess={(token) => {
          setCaptchaToken(token);
        }}
        ref={turnstileRef}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={logInLoading}
        className="login-signup-input"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        disabled={logInLoading}
        className="login-signup-input"
      />
      <br></br>
      <button
        type="submit"
        disabled={logInLoading || email == "" || password == ""}
        className="login-signup-panel-button"
      >
        {logInLoading ? "Loading..." : "Sign In"}
      </button>
      <hr className="login-signup-panel-divider"></hr>or
      <button type="button" onClick={() => handleSignInWithProvider("google")}>
        Sign in with Google
      </button>
      <button type="button" onClick={() => handleSignInWithProvider("github")}>
        Sign in with GitHub
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default LoginPanel;
