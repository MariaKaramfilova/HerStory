/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, queryByPlaceholderText, getByRole, getByText, getByPlaceholderText } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom'
import CreatePost from '../src/components/CreatePost/CreatePost.jsx';

describe('CreatePost', () => {
  test('renders Create post page', () => {
    render(<CreatePost />);
    expect(screen.getByRole("heading")).toHaveTextContent(/Create a post/);
    expect(screen.getByRole("combobox")).toHaveDisplayValue("Choose topic");
    expect(screen.getByRole("radio", { name: "Image/video post" })).not.toBeChecked();
  });

  test('should display an error message if the title is too short or too long', () => {
    const { getByPlaceholderText, getByText } = render(<CreatePost />);
    const titleInput = getByPlaceholderText('Add post title');
    const descriptionInput = getByPlaceholderText('Write post description');
    const submitButton = getByText('Create post');

    fireEvent.change(titleInput, { target: { value: 'Short' } });
    fireEvent.change(descriptionInput, { target: { value: 'Valid description' } });
    fireEvent.click(submitButton);
    expect(screen.getByText('The title must be between 16 and 64 symbols.')).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: 'A very long title that is longer than 64 characters and goes on and on and then again' } });
    fireEvent.click(submitButton);
    expect(screen.getByText('The title must be between 16 and 64 symbols.')).toBeInTheDocument();
  });
});