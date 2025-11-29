import { useState } from "react";
import "../../App.css";
import UserProfileObject from "../../types/UserProfileObject";
import { Client } from "../supabase/Client";
import "./Profile.css";

const ProfilePanel = ({ profile }: { profile: UserProfileObject }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSettings = () => {};
  const handleLogOut = async () => {
    try {
      setError(null);
      setIsLoggingOut(true);
      const { error } = await Client.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error!");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="profile-panel-div">
      <p className="profile-panel-username">
        Hello, {profile.userDisplayName}!
      </p>
      <img
        src={profile.userProfilePicture}
        className="profile-panel-profile-picture"
      ></img>
      <button className="profile-panel-button" onClick={handleSettings}>
        Settings
      </button>
      <button className="profile-panel-button" onClick={handleLogOut}>
        {isLoggingOut ? "Loading..." : "Log Out"}
        <div className="error-message">{error}</div>
      </button>
    </div>
  );
};

export default ProfilePanel;
