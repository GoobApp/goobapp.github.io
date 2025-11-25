import UserProfile from "../types/UserProfileObject";

const createProfileObject = ({
  newUserDisplayName,
  newUserProfilePicture,
}: {
  newUserDisplayName: string;
  newUserProfilePicture: string | null;
}) => {
  let inputObject = {
    userDisplayName: newUserDisplayName,
    userProfilePicture: newUserProfilePicture,
  } as UserProfile;

  return inputObject;
};

export default createProfileObject;
