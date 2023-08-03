import React, { useContext, useRef, useState } from 'react'
import { Alert, Card, Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth.services.js';
import { AuthContext } from '../../context/AuthContext.js';
import { getUserData } from '../../services/users.services.js';

export default function Login() {
  const { user, setUser } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      const data = await loginUser(emailRef.current.value, passwordRef.current.value);
      const snapshot = await getUserData(data.user.uid);
      const userData = data.user.id.val(Object.keys(snapshot.val())[0]);
      setUser({ user: data, userData });
      navigate('/');
    } catch (error) {
      setError(`${error}`)
      return;
    }

    setLoading(false);
  }

  console.log(user);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Log in</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required></Form.Control>
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} required></Form.Control>
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type='submit'>
              Log in
            </Button>
            <div className='w-100 text-center mt-2'>
              <Link to='/forgot-password'>Forgot password?</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/sign-up'>Sign up</Link>
      </div>
    </>
  )
}
