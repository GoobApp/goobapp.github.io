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
      <div className="image-role-div">
        <img
          src={userData.userProfilePicture}
          alt=""
          className="user-profile-picture"
        />
        {userData.userRole && <span className="role">{userData.userRole}</span>}
      </div>

      <p className="username">
        {userData.userID == "0" ? "Deleted user" : userData.username}
      </p>
    </button>
  );
};

export default UserDisplay;
