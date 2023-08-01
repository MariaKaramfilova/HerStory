/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import React from 'react';
import '@testing-library/jest-dom'

test('renders App heading', () => {
  render(<App />);
  expect(screen.getByText(/Forum/i)).toBeInTheDocument();
});