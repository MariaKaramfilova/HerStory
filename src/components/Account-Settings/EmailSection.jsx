import { updateEmail, reauthenticateWithCredential } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";
import { updateProfileEmail } from "../../services/users.services";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllUsers } from "../../services/users.services";
import { Button, Card, Form, Alert } from 'react-bootstrap';

/**
 * Component that allows the user to change their email address associated with their account.
 *
 * @component
 * @example
 * return <EmailSection />;
 */
export default function EmailSection() {

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { loggedInUser, user, setUser } = useContext(AuthContext);

   /**
   * Handles the email change process.
   * @async
   */
  const changeEmail = async () => {
    const password = prompt(
      "Please enter your password to confirm email change:"
    );
    if (password) {
      const credentials = EmailAuthProvider.credential(loggedInUser.email, password);
      try {
        await reauthenticateWithCredential(user, credentials);
        if (email) {
          await updateEmail(user, email);
          alert("Congratulations! You successfully changed your email!");
          const allUsers = await getAllUsers();
          setUser((prev) => ({ ...prev, allUsers }));
          await updateProfileEmail(email, loggedInUser.username);
          setEmail("");
          setEmailError("");
        }
      } catch (error) {
        setEmailError("Invalid email or password! Please try again.");
        console.error(error);
      }
    }
  };

  return (
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
  );
}
