// eslint-disable-next-line no-unused-vars
import React, { useContext, useRef, useState } from "react";
import { Alert, Card, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.services.js";
import { AuthContext } from "../../context/AuthContext.js";
import { getUserData } from "../../services/users.services.js";
import { LOG_IN } from "../../common/common.js";

/**
 * A component for user login.
 *
 * Allows users to log in using their email and password.
 *
 * @component
 * @example
 * return (
 *   <Login />
 * );
 */
export default function Login() {
  const { setUser } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  /**
   * Handle form submission for user login.
   * @param {Event} e - The form submission event.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const data = await loginUser(
        emailRef.current.value,
        passwordRef.current.value
      );
      (async () => {
        const loggedUserSnapshot = await getUserData(data.user.uid);
        const loggedInUser = Object.values(loggedUserSnapshot.val()).find(
          (el) => el.uid === data.user.uid
        );
        setUser((prev) => ({ ...prev, loggedInUser, user: data.user }));
      })();
      navigate("/");
    } catch (error) {
      setError(`${error.message}`);
    }

    setLoading(false);
  }

  return (
    <>
      <Card className="border-0">
        <Card.Body style={{ marginTop: "-20px" }}>
          <h2 className="text-center mb-4">Log in</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                required
              ></Form.Control>
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100 mt-3"
              type="submit"
              variant="dark"
            >
              {LOG_IN}
            </Button>
            <div className="w-100 text-center mt-2">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/sign-up">Sign up</Link>
      </div>
    </>
  );
}
