import React, { useContext, useState, useEffect } from "react";
import { Alert, Button, Form, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { getUserData } from "../../services/users.services";
import { uploadProfilePicture } from "../../services/storage.services";
import { updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom/dist";
import { updateProfileEmail } from "../../services/users.services";


const AccountSettings = () => {
  const { user } = useContext(AuthContext);
  const [profilePictureURL, setProfilePictureURL] = useState(
    "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png"
  );
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");


  function handleChange(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        console.error("Invalid file type. Please select an image or gif file.");
        return;
      }

      setPhoto(selectedFile);
    }
  }

  async function handleClick() {
    if (photo && username) {
      try {
        const data = await uploadProfilePicture(photo, username);
        setProfilePictureURL(data);

        setLoading(false);
        alert('You have successfully changed your profile picture! Please refresh the page to see your new profile picture!');
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    } else {
      console.error("No file selected.");
    }
  }


  useEffect(() => {
    const getProfileData = async () => {
      try {
        const snapshot = await getUserData(user.uid);
        const userData = snapshot.val();
        const profileData = Object.values(userData).find((el) => el.uid === user.uid);
  
        if (profileData) {          
          setProfilePictureURL(profileData.profilePictureURL);
          setFirstName(profileData.firstName);
          setSurname(profileData.lastName);
          setUsername(profileData.username);
          setEmail(profileData.email);
        }
      } catch (error) {
        console.error("Error fetching profile picture URL:", error);
      }
    };
  
    if (user) {
      getProfileData();
    }
    return () => {
      setIsPhotoSelected(false);
    };
  }, [user, profilePictureURL]);


  const changePassword = async () => {
    try {
      if (user && user.metadata.lastSignInTime) {
        const lastSignInTime = new Date(user.metadata.lastSignInTime);
        const currentTime = new Date();

        const timeDifferenceInMinutes =
          (currentTime - lastSignInTime) / (1000 * 60);
        const acceptableTimeDifference = 5;

        if (timeDifferenceInMinutes <= acceptableTimeDifference) {
          if (password && confirmPassword) {
            if (password === confirmPassword) {
              await updatePassword(user, password);
              setPassword('');
              setConfirmPassword('');
              alert("Congratulations! You successfully changed your password!");
              setError("");
            } else {
              setPasswordError("Please check if the two passwords match!");
            }
          } else {
            setPasswordError("Please enter your password in both fields!");
          }
        } else {
          setPasswordError(
            "For security reasons, please sign in again before changing your password."
          );
        }
      }
    } catch (error) {
      setPasswordError(
        "An error occurred while changing the password. Please try again."
      );
      console.error(error);
    }
  };
  const changeEmail = async () => {
    const password = prompt(
      "Please enter your password to confirm email change:"
    );
    if (password) {
      const credentials = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, credentials);
        if (email) {
          await updateEmail(user, email);
          alert("Congratulations! You successfully changed your email!");
          await updateProfileEmail(email, username);
          setEmail("");
          setEmailError("");
        }
      } catch (error) {
        setEmailError("Invalid email or password! Please try again.");
        console.error(error);
      }
    }
  };

  const deleteAccount = async () => {
    const password = prompt("Please enter your password to confirm account deletion:");
    if (password) {
      const credentials = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, credentials);
        if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
          try {
            await deleteUser(user);
            alert('Your account has been deleted.');
          } catch (error) {
            console.error('An error occurred while deleting the account:', error);
            alert('An error occurred while deleting your account. Please try again.');
          }
        }
      } catch (error) {
        console.error('An error occurred during re-authentication:', error);
        alert('Failed to re-authenticate. Please check your password and try again.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h1 style={{ marginTop: "20px", flexGrow: 1 }}>Account Settings</h1>
  <Link
    to="/home"
    style={{
      display: "block",
      color: "black",
      fontSize: "23px",
      textDecoration: "none",
      marginRight: '15px'
    }}
  >
    Back To Home
  </Link>
</div>
<hr />
      <div style={{ display: "flex", alignItems: "center" }}>
        {profilePictureURL &&
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
        }
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "pink" }}>
            {firstName} {surname}
          </div>
          <div
            style={{ fontSize: "14px", color: "gray", fontWeight: "normal" }}
          >
            @{username}
          </div>
        </div>
      </div>
      <Form.Label
        htmlFor=""
        style={{
          fontSize: "20px",
          color: "gray",
          fontWeight: "normal",
          marginTop: "15px",
        }}
      >
        Want to change your profile picture? <br />
        The allowed files that you can upload are: png, jpg/jpeg, GIF!
      </Form.Label>
      <br />
      <Form.Control
        type="file"
        onChange={handleChange}
        style={{ marginTop: "5px" }}
      ></Form.Control>
      {!isPhotoSelected && (
        <Button onClick={handleClick} disabled={loading || !photo}>
          Upload
        </Button>
      )}
      <hr />
      <div>
        <Form.Label
          htmlFor=""
          style={{
            fontSize: "20px",
            color: "gray",
            fontWeight: "normal",
            marginTop: "15px",
          }}
        >
          Want to change your password?
        </Form.Label>
      </div>
      <Card>
        <Card.Body>
          <Form.Group controlId="password">
            <Form.Label>Change Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
            {passwordError && <Alert>{passwordError}</Alert>}
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label style={{ marginTop: "8px" }}>
              Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            <Button
              onClick={changePassword}
              style={{ margin: "0 auto", display: "block", marginTop: "15px" }}
            >
              Update Password
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>
      <div>
        <Form.Label
          htmlFor=""
          style={{
            fontSize: "20px",
            color: "gray",
            fontWeight: "normal",
            paddingTop: "40px",
          }}
        >
          Want to change your email?
        </Form.Label>
        <Card>
          <Card.Body>
            <Form.Group controlId="confirmEmail">
              <Form.Label style={{ marginTop: "8px" }}>Change email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="New email"
              />
               {emailError && <Alert>{emailError}</Alert>}
              <Button
                onClick={changeEmail}
                style={{
                  margin: "0 auto",
                  display: "block",
                  marginTop: "15px",
                  fontSize: "17px",
                }}
              >
                Update Email
              </Button>
            </Form.Group>
          </Card.Body>
        </Card>
      </div>
      <Form.Label
  htmlFor=""
  style={{
    fontSize: "20px",
    color: "gray",
    fontWeight: "normal",
    paddingTop: "40px",
  }}
>
  Want to delete your account?
</Form.Label>
<Card style={{ marginBottom: "50px" }}>
  <Card.Body>
    <Form.Group controlId="confirmEmail">
      <span
        style={{
          fontSize: "20px",
          color: "gray",
          fontWeight: "normal",
          paddingTop: "40px",
        }}
      >
        Click the Button and delete your account:
      </span>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15px",
        }}
      >
        <Button
          onClick={deleteAccount}
          variant="danger"
          style={{
            fontSize: "16px",
            color: "white",
            marginBottom: '15px'
          }}
        >
          Delete Account
        </Button>
      </div>
    </Form.Group>
  </Card.Body>
</Card>
    </div>
  );
};

export default AccountSettings;