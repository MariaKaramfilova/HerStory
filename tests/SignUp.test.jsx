// /**
//  * @jest-environment jsdom
//  */

// import { render, screen, fireEvent } from '@testing-library/react';
// import React from 'react';
// import '@testing-library/jest-dom';
// import RegistrationForm from '../src/components/SignUp/SignUp';

// test('renders the registration form', () => {
//   render(<RegistrationForm />);
//   expect(screen.getByRole('heading', { name: /Signup/ })).toBeInTheDocument();
//   expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
//   expect(screen.getByRole('button', { name: /Register/ })).toBeInTheDocument();
// });

// test('runs custom form validations', () => {
//   render(<RegistrationForm />);
  
//   // Invalid first name
//   fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'Ab' } });
//   fireEvent.click(screen.getByRole('button', { name: /Register/ }));
//   expect(screen.getByText(/First name should be between 4 and 32 symbols/)).toBeInTheDocument();

//   // Valid first name
//   fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } });
//   fireEvent.click(screen.getByRole('button', { name: /Register/ }));
//   expect(screen.queryByText(/First name should be between 4 and 32 symbols/)).not.toBeInTheDocument();

//   // Similar tests for other fields (last name, password, confirmPassword, etc.)
// });
