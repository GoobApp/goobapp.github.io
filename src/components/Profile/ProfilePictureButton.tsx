import { useState } from "react";
import "../../App.css";
import UserProfileObject from "../../types/UserProfileObject";
import ProfilePanel from "./ProfilePanel";

const ProfilePictureButton = ({ profile }: { profile: UserProfileObject }) => {
  const [panelOpened, setPanelOpened] = useState(false);
  const handleClick = () => {
    setPanelOpened(!panelOpened);
  };

  return (
    <div className="profile-picture-div">
      <button className="profile-picture-button" onClick={handleClick}>
        <img src={profile.userProfilePicture} className="profile-picture"></img>
      </button>
      {panelOpened && <ProfilePanel profile={profile}></ProfilePanel>}
    </div>
  );
};

export default ProfilePictureButton;
