/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import React from 'react';
import '@testing-library/jest-dom'
import CreatePost from '../src/components/CreatePost/CreatePost.jsx';

test('renders Create post page', () => {
  render(<CreatePost />);
  expect(screen.getByRole("heading")).toHaveTextContent(/Create a post/);
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Choose topic");
  expect(screen.getByRole("radio", { name: "Image/video post" })).not.toBeChecked();
});

test('runs custom form validations', () => {
  render(<CreatePost />);
  
})