import React, { useContext, useState, useEffect } from "react";
import { Alert, Button, Form, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { getAllUsers, updateProfilePic} from "../../services/users.services";
import { Link } from "react-router-dom/dist";
import Skeleton from "react-loading-skeleton";
import DeleteAccountSection from "./DeleteAccountSection.jsx";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";
import PhoneSection from "./PhoneSection";
import ProfilePictureSection from "./ProfilePictureSection";

const AccountSettings = () => {
  const { loggedInUser, user, setUser } = useContext(AuthContext);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [prevProfilePictureURL, setPrevProfilePictureURL] =
    useState(profilePictureURL);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [isRandomAvatarDisabled, setIsRandomAvatarDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(true);
    }
    if (user) {
      setFirstName(loggedInUser.firstName);
      setSurname(loggedInUser.lastName);
      setProfilePictureURL(
        loggedInUser.profilePictureURL || "../../assets/basic_avatar.png"
      );
      setPrevProfilePictureURL(
        loggedInUser.profilePictureURL || "../../assets/basic_avatar.png"
      );
      setUsername(loggedInUser.username);
      setUserRole(loggedInUser.role);
    }
    setLoading(false);
  }, [loggedInUser]);

  function switchToPrevProfilePictureURL() {
    setProfilePictureURL(prevProfilePictureURL);
  }

  async function createFileFromUrl(url) {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: "image/jpg",
    };
    let file = new File([data], `${crypto.randomUUID()}.jpg`, metadata);
    return file;
  }

  const handleClickRandomAvatar = async () => {
    try {
      const image = await fetch(
        `https://api.dicebear.com/6.x/personas/jpg?seed=${crypto.randomUUID()}`
      );
      setProfilePictureURL(image.url);
      const file = await createFileFromUrl(image.url);
      setPhoto(file);
      setIsRandomAvatarDisabled(true);
    } catch (error) {
      setError(error);
    }
  };

  async function handleClick() {
    if (photo && username) {
      try {
        const data = await updateProfilePic(photo, username);
        setProfilePictureURL(data);
        setPrevProfilePictureURL(data);

        setLoading(false);
        window.location.reload();
        alert(
          "You have successfully changed your profile picture! Please refresh the page to see your new profile picture!"
        );
        const allUsers = await getAllUsers();
        setUser((prev) => ({ ...prev, allUsers }));
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    } else {
      console.error("No file selected.");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginTop: "20px", flexGrow: 1 }}>Account Settings</h1>
        <Link
          to="/home"
          style={{
            display: "block",
            color: "black",
            fontSize: "23px",
            textDecoration: "none",
            marginRight: "15px",
          }}
        >
          Back To Home
        </Link>
      </div>
      <hr />
      {loading || !user ? (
        <Skeleton height={100} width={300} />
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          {profilePictureURL && (
            <img
              src={profilePictureURL}
              alt="Profile picture"
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "pink" }}
            >
              {firstName} {surname}
            </div>
            <div
              style={{ fontSize: "14px", color: "gray", fontWeight: "normal" }}
            >
              @{username}
            </div>
            <div className="d-flex">
              {!isRandomAvatarDisabled ? (
                <Button onClick={handleClickRandomAvatar}>
                  Generate random avatar
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleClick();
                    setIsRandomAvatarDisabled(true);
                  }}
                >
                  Upload
                </Button>
              )}
              {isRandomAvatarDisabled && (
                <Button
                  onClick={() => {
                    setIsRandomAvatarDisabled(false);
                    switchToPrevProfilePictureURL();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
        <ProfilePictureSection
          loggedInUser={loggedInUser}
          user={user}
          setUser={setUser}
        />
      </div>
      <hr />
      <div>
        <PasswordSection
          loggedInUser={loggedInUser}
          user={user}
          setUser={setUser}
        />
      </div>
      <div>
        <EmailSection
          loggedInUser={loggedInUser}
          user={user}
          setUser={setUser}
        />
      </div>

      {userRole === "admin" && (
        <div>
          <PhoneSection
            loggedInUser={loggedInUser}
            user={user}
            setUser={setUser}
          />
        </div>
      )}

      <div>
        <DeleteAccountSection />
      </div>
    </div>
  );
};

export default AccountSettings;
