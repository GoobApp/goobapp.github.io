import {
  FocusEvent,
  FocusEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import "../../App.css";
import UserProfileObject from "../../types/UserProfileObject";
import { Client } from "../supabase/Client";
import "./Profile.css";

const ProfilePanel = ({
  profile,
  onClose,
}: {
  profile: UserProfileObject;
  onClose: FocusEventHandler<HTMLDivElement> | undefined;
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSettings = () => {
    onClose();
    navigate("/settings", { viewTransition: true });
  };

  const handleLogOut = async () => {
    try {
      setError(null);
      setIsLoggingOut(true);
      if (!Client) return;
      const { error } = await Client.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error!");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) panel.focus();
  }, []);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!panelRef.current?.contains(event.relatedTarget)) {
      onClose?.(event);
    }
  };

  return (
    <div
      className="profile-panel-div"
      onBlur={handleBlur}
      tabIndex={-1}
      ref={panelRef}
    >
      <p className="profile-panel-username">Hello, {profile.username}!</p>
      <img
        src={profile.userProfilePicture}
        className="profile-panel-profile-picture"
      ></img>
      {profile.userRole && (
        <span className="profile-panel-role">{profile.userRole}</span>
      )}
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
