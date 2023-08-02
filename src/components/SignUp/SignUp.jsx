import './SignUp.css'
import React, {useState} from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
export default function RegistrationForm() {
    
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [password,setPassword] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit  = (event) => {
        event.preventDefault();
        setError(null)
        
        if (firstName.length < 4 || firstName.length > 32) {
            setError('First name should be between 4 and 32 symbols')
        }
        if (lastName.length < 4 || lastName.length > 32) {
            setError('Last name should be between 4 and 32 symbols')
        }
        if (password !== confirmPassword) {
            setError('Please check if your passwords match!')
        }
        // Todo: To valid
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
            <Button onClick={handleSubmit}>Register</Button>
          </div>
        </div>
      );
}