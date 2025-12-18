import type { Session } from "@supabase/supabase-js";
import { useLocation } from "react-router";
import "../../App.css";
import UserProfileObject from "../../types/UserProfileObject";
import LoginSignupButtons from "./LoginSignupButtons";
import "./Profile.css";
import ProfilePictureButton from "./ProfilePictureButton";

const TopBar = ({
  profile,
  session,
}: {
  profile: UserProfileObject;
  session: Session | null;
}) => {
  const location = useLocation();
  return (
    <div id="profileTopBar" className="profile-top-bar">
      <p className="title-text">
        GoobApp{" "}
        {location.pathname.replaceAll("/", " -> ") == " -> "
          ? ""
          : location.pathname.replaceAll("/", " -> ")}
      </p>
      {!import.meta.env.PROD || session ? (
        <ProfilePictureButton profile={profile}></ProfilePictureButton>
      ) : (
        <LoginSignupButtons></LoginSignupButtons>
      )}
    </div>
  );
};

export default TopBar;
