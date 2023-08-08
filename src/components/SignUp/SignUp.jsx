import './SignUp.css'
import React, { useContext, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { createUserByUsername, getUserByUsername } from '../../services/users.services';
import { registerUser } from '../../services/auth.services';
import { Link, useNavigate } from 'react-router-dom/dist';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
export default function RegistrationForm() {

  const [profilePictureURL, setProfilePictureURL] = useState('https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const { setUser } = useContext(AuthContext);

  const checkEmailExistence = async (email) => {
    const auth = getAuth();
    
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null)

    if (firstName.length < 4 || firstName.length > 32 || !firstName) {
      setError('First name should be between 4 and 32 symbols')
      return;
    }
    if (lastName.length < 4 || lastName.length > 32 || !lastName) {
      setError('Last name should be between 4 and 32 symbols')
      return;
    }
    if (password !== confirmPassword || !password) {
      setError('Please check if your passwords match!')
      return;
    }
    if (password.length < 6) {
      setError('Password should be more 6 characters!')
      return;
    }
    getUserByUsername(userName)
      .then(snapshot => {
        if (snapshot.exists()) {
          return alert('This Username already exist!')
        }
        return checkEmailExistence(email);
      })
      .then((emailExists) => {
        if (emailExists) {
          setError('This Email is already in use!');
        }
        return registerUser(email, password);
      })
      .then(credential => {
        return createUserByUsername(firstName, lastName, credential.user.uid, credential.user.email, userName, profilePictureURL)
          .then(() => {
            setUser({
              user: credential.user
            })
              navigate('/success-register')
          })
      })
  }

  return (
    <div className="form">
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 className="sign-up">Signup</h1>
      <div className="form-body">
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Group>
        <Form.Group controlId="userName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </Form.Group>
      </div>
      <div className="footer">
        <Button onClick={handleSubmit} className='w-100 mt-3' type='submit' variant="dark">Register</Button>
        <p>Already have registration? <Link to="/log-in">Log in</Link></p>
      </div>
    </div>
  );
}