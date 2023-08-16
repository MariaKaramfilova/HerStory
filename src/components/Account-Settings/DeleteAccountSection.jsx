import { EmailAuthProvider, deleteUser, reauthenticateWithCredential } from 'firebase/auth';
import React, { useContext } from 'react'
import { Button, Card, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext.js';
import { deleteUserData, getAllUsers } from '../../services/users.services.js';
import { PostsContext } from '../../context/PostsContext.js';
import { getAllPosts } from '../../services/post.services.js';
import { getAllComments } from '../../services/comment.services.js';
import _ from 'lodash';
import { logoutUser } from '../../services/auth.services.js';


/**
 * Component that provides the functionality to delete the user's account,
 * along with associated posts, comments, and voting data.
 *
 * @return {<DeleteAccountSection />};
 */
export default function DeleteAccountSection() {
  const { loggedInUser, user, setUser } = useContext(AuthContext);
  const { allPosts, setAllPosts } = useContext(PostsContext);


   /**
   * Deletes the user account, associated data, and logs out the user.
   * @async
   */

  const deleteAccount = async () => {
    const password = prompt("Please enter your password to confirm account deletion:");
    if (password) {
      const credentials = EmailAuthProvider.credential(loggedInUser.email, password);
      try {
        await reauthenticateWithCredential(user, credentials);
        if (window.confirm("Are you sure you want to delete your account? This action is irreversible. Your account, posts, comments and other activity will be deleted.")) {
          try {
            const postToBeDeleted = allPosts.filter(el => el.userId === loggedInUser.uid);
            let commentsToBeDeleted = await getAllComments();
            commentsToBeDeleted = commentsToBeDeleted.filter(el => el.userUid === loggedInUser.uid);
            console.log(loggedInUser.upvotedPosts);
            console.log(loggedInUser.downvotedPosts);
            const upvotedPosts = loggedInUser.upvotedPosts ? Object.keys(loggedInUser.upvotedPosts) : [];
            const downvotedPosts = loggedInUser.downvotedPosts ? Object.keys(loggedInUser.downvotedPosts) : [];

            console.log(downvotedPosts);
            console.log(upvotedPosts);

            await deleteUser(user);
            await deleteUserData(loggedInUser.username, postToBeDeleted, commentsToBeDeleted, upvotedPosts, downvotedPosts);
            alert('Your account has been deleted.');
            logoutUser();
          } catch (error) {
            console.error('An error occurred while deleting the account:', error);
            alert('An error occurred while deleting your account. Please try again.');
          }
        }
      } catch (error) {
        console.error('An error occurred during re-authentication:', error);
        alert('Failed to re-authenticate. Please check your password and try again.');
      } finally {
        const allUsers = await getAllUsers();
        setUser((prev) => ({ ...prev, allUsers }));
        let result = await getAllPosts();
        setAllPosts((prev) => ({ ...prev, allPosts: result }));
      }
    }
  };

  return (
    <>
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
    </>
  )
}
