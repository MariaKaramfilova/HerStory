import { updatePassword, } from "firebase/auth";
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.js";

/**
 * Component that allows the user to change their account password.
 *
 * @return {<PasswordSection />};
 */
export default function PasswordSection() {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const { loggedInUser, user } = useContext(AuthContext);

  /**
   * Handles the password change process.
   * @async
   */
  const changePassword = async () => {
    try {
      if (loggedInUser && user.metadata.lastSignInTime) {
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

  return (
    <>
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
    </>
  )
}
