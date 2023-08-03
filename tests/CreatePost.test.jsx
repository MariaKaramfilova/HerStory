/**
 * @jest-environment jsdom
 */
import { render, fireEvent, screen } from '@testing-library/react';
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
  
  const formTitle = screen.findByPlaceholderText('Add post title');
  fireEvent.click(screen.getByTestId("create-post-btn"))
  expect(screen.getByRole("alert")).toHaveTextContent(/The title must be between 16 and 64 symbols./)
});

test('create post in db', () => {
  render(<CreatePost />);
  
})