import type { Session } from "@supabase/supabase-js";
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
  return (
    <div id="profileTopBar" className="profile-top-bar">
      <p className="{title-text}">GoobApp</p>
      {session ? (
        <ProfilePictureButton profile={profile}></ProfilePictureButton>
      ) : (
        <LoginSignupButtons></LoginSignupButtons>
      )}
    </div>
  );
};

export default TopBar;
