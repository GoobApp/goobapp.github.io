import "../App.css";
import UserProfileObject from "../types/UserProfileObject";

const ProfileTopBar = ({ profile }: { profile: UserProfileObject }) => {
  return (
    <div id="profileTopBar" className="profile-top-bar">
      <p className="{title-text}">GoobApp</p>
      <button className="profile-picture-button">
        <img
          src={profile.userProfilePicture}
          className="profile-picture-image"
        ></img>
      </button>
    </div>
  );
};

export default ProfileTopBar;
