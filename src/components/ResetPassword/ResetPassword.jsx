import { resetPassword } from "../../services/auth.services";
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Card, Button, Form } from 'react-bootstrap'
import { useState, useRef } from "react";
import Error from "../../views/Error/Error.jsx";

/**
 * Component for resetting a forgotten password.
 *
 * Renders a form for users to submit their email and receive a password reset email.
 *
 * @component
 * @returns {JSX.Element} Rendered component for resetting a forgotten password.
 * @example
 * return (
 *   <ForgottenPassword />
 * );
 */
export default function ForgottenPassword() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();

  const navigate = useNavigate();

  /**
   * Handle password reset submission.
   * @param {Event} e - The submit event.
   */
  async function handleResetPassword(e) {
    e.preventDefault();

    try {

      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      alert('Password reset email has been sent successfully!');
      navigate('/');

    } catch (error) {
      setError(`${error.message}`)
    }

    setLoading(false);
  }

  if (error) {
    return <Error error={error} />
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Reset Password</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleResetPassword}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required></Form.Control>
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type='submit' variant="dark">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/sign-up'>Sign up</Link>
      </div>
    </>
  )

}