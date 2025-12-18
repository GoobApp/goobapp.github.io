import "../../../App.css";
import { socket } from "../../../socket";
import UserProfile from "../../../types/UserProfileObject";
import "./Users.css";

const UserDisplay = ({
  userData,
  isDarkBG,
  clientUserData,
}: {
  userData: UserProfile;
  isDarkBG: boolean;
  clientUserData: UserProfile;
}) => {
  const clickedUser = () => {
    if (clientUserData.userRole == "Owner" || !import.meta.env.PROD) {
      const role = window.prompt("Role name to give?");

      if (role != null) {
        socket.emit("give user role", userData.userUUID, role);
      }
    }
  };

  return (
    <button
      className={isDarkBG ? "user-container-dark" : "user-container-light"}
      onClick={clickedUser}
    >
      <img
        src={userData.userProfilePicture}
        alt=""
        className="user-profile-picture"
      />

      <span className="username">
        {userData.userID == "0" ? "Deleted user" : userData.username}
      </span>
      {userData.userRole && <span className="role">{userData.userRole}</span>}
    </button>
  );
};

export default UserDisplay;
