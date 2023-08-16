import './SignUp.css'
import React, { useContext, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { createUserByUsername, getAllUsers, getUserByUsername, getUserData } from '../../services/users.services';
import { registerUser } from '../../services/auth.services';
import { Link, useNavigate } from 'react-router-dom/dist';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
import { URL_TO_EXTERNAL_DEFAULT_PROF_PIC } from '../../common/common.js';
import { LOG_IN_PATH } from '../../common/common';

/**
 * Component for user registration form.
 *
 * This component allows users to sign up with their personal information.
 *
 * @component
 * @returns {JSX.Element} Rendered component for user registration.
 * @example
 * return (
 *   <RegistrationForm />
 * );
 */
export default function RegistrationForm() {

  const [profilePictureURL, setProfilePictureURL] = useState(URL_TO_EXTERNAL_DEFAULT_PROF_PIC);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const { setUser } = useContext(AuthContext);

  /**
   * Check if an email is already in use.
   * @param {string} email - The email to check.
   * @returns {boolean} True if the email is already in use, false otherwise.
   */
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

  /**
   * Handle registration form submission.
   * @param {Event} event - The form submit event.
   */
  const handleSubmit = async (event) => {
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
      setError('Password should be more than 6 characters!')
      return;
    }
    try {
      const snapshot = await getUserByUsername(userName);
      if (snapshot.exists()) {
        return alert('This Username already exists!')
      }
      const emailExists = await checkEmailExistence(email);
      if (emailExists) {
        setError('This Email is already in use!');
      }
      const credential = await registerUser(email, password);
      await createUserByUsername(firstName, lastName, credential.user.uid, credential.user.email, userName, profilePictureURL);
      const loggedUserSnapshot = await getUserData(credential.user.uid);
      const loggedInUser = Object.values(loggedUserSnapshot.val()).find((el) => el.uid === credential.user.uid);
      const allUsers = await getAllUsers();
      setUser({
        user: credential.user,
        loggedInUser,
        allUsers
      });
      navigate('/success-register');
    } catch (error) {
      console.error(error);
    }
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
        <p>Already have registration? <Link to={LOG_IN_PATH}>Log in</Link></p>
      </div>
    </div>
  );
}