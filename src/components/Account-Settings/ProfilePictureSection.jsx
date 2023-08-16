/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import { getAllUsers } from '../../services/users.services';
import { updateProfilePic } from '../../services/users.services';
import { useState } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import Skeleton from 'react-loading-skeleton';
import { AVATAR_API_URL, DEFAULT_PROF_PIC_DIR } from '../../common/common.js';

/**
 * Component that allows the user to manage their profile picture.
 *
 * @component
 * @return {JSX.Element} The rendered ProfilePictureSection component.
 */
export default function ProfilePictureSection() {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [prevProfilePictureURL, setPrevProfilePictureURL] =
    useState(profilePictureURL);
  const [isRandomAvatarDisabled, setIsRandomAvatarDisabled] = useState(false);
  const { loggedInUser, user, setUser } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(true);
    }
    if (user) {
      setFirstName(loggedInUser.firstName);
      setSurname(loggedInUser.lastName);
      setProfilePictureURL(
        loggedInUser.profilePictureURL || DEFAULT_PROF_PIC_DIR
      );
      setPrevProfilePictureURL(
        loggedInUser.profilePictureURL || DEFAULT_PROF_PIC_DIR
      );
      setUsername(loggedInUser.username);
    }
    setLoading(false);
  }, [loggedInUser]);

  /**
   * Handle photo selection from input.
   * @param {Event} e - The change event object.
   */
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
  /**
     * Create a File object from a URL.
     * @async
     * @param {string} url - The URL of the image.
     * @returns {Promise<File>} A Promise resolving to the created File object.
     */
  async function createFileFromUrl(url) {
    try {
      let response = await fetch(url);
      let data = await response.blob();
      let metadata = {
        type: "image/jpg",
      };
      let file = new File([data], `${crypto.randomUUID()}.jpg`, metadata);
      return file;
    } catch (error) {
      console.error(error);
    }
  }

  /**
     * Switch to the previous profile picture URL.
     */
  function switchToPrevProfilePictureURL() {
    setProfilePictureURL(prevProfilePictureURL);
  }

  /**
   * Handle click event for generating a random avatar.
   */
  const handleClickRandomAvatar = async () => {
    try {
      const image = await fetch(
        `${AVATAR_API_URL}${crypto.randomUUID()}`
      );
      setProfilePictureURL(image.url);
      const file = await createFileFromUrl(image.url);
      setPhoto(file);
      setIsRandomAvatarDisabled(true);
    } catch (error) {
      setError(error);
    }
  };

  /**
   * Handle click event for uploading a profile picture.
   * @async
   */
  async function handleClick() {
    if (photo && loggedInUser.username) {
      try {
        const data = await updateProfilePic(photo, loggedInUser.username);
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
    <>
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
    </>
  );
}
