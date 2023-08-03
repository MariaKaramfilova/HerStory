/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import App from '../src/App.jsx';
import React from 'react';
import '@testing-library/jest-dom';

test("renders without crashing", () => {
  render(<App />);
});