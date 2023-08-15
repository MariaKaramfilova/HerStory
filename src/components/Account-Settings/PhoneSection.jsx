import { reauthenticateWithCredential } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";
import { updateProfilePhone } from "../../services/users.services";
import { Button, Card, Form } from 'react-bootstrap';
import { getAllUsers } from "../../services/users.services";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.js";

/**
 * A component that allows a user with administrative rights to change their phone number.
 *
 * @component
 * @example
 * return <PhoneSection />;
 */
export default function PhoneSection() {

  const [phone, setPhone] = useState("");
  const { loggedInUser, user, setUser } = useContext(AuthContext);

   /**
   * Handles the phone number change process.
   * @async
   */
  const changePhone = async () => {
    const password = prompt(
      "Please enter your password to confirm email change:"
    );
    if (password) {
      const credentials = EmailAuthProvider.credential(loggedInUser.email, password);
      try {
        await reauthenticateWithCredential(user, credentials);
        if (phone) {
          await updateProfilePhone(phone, loggedInUser.username);
          alert("Congratulations! You successfully changed your phone!");
          const allUsers = await getAllUsers();
          setUser((prev) => ({ ...prev, allUsers }));
          setPhone(phone);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
    <Form.Label htmlFor="" style={{ fontSize: "20px", color: "gray", fontWeight: "normal", paddingTop: "40px", }}>
            Want to change your phone number?
          </Form.Label>
          <Card>
            <Card.Body>
              <Form.Group controlId="confirmPhone">
                <Form.Label style={{ marginTop: "8px" }}>Change phone number</Form.Label>
                <Form.Control
                  type="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="New phone"
                />
                <Button onClick={changePhone} style={{ margin: "0 auto", display: "block", marginTop: "15px", fontSize: "17px", }}>
                  Update Phone
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>
    </>
  )
}
