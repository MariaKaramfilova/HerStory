import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { getAllUsers } from '../../services/users.services';
import { updateProfilePic } from '../../services/users.services';
import { useState } from 'react';
export default function ProfilePictureSection({ loggedInUser, user, setUser }) {
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPhotoSelected, setIsPhotoSelected] = useState(false);
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [prevProfilePictureURL, setPrevProfilePictureURL] = useState(profilePictureURL);

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
        if (photo && loggedInUser.username) {
          try {
            const data = await updateProfilePic(photo, loggedInUser.username);
            setProfilePictureURL(data);
            setPrevProfilePictureURL(data);
    
            setLoading(false);
            window.location.reload();
            alert('You have successfully changed your profile picture! Please refresh the page to see your new profile picture!');
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
  )
}
