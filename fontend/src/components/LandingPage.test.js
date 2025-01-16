import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';

// Mock fetch for category gigs
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ title: 'Test Gig', price: 100, image: 'test-image.jpg' }]),
  })
);

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LandingPage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders landing page with search input', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );
    expect(screen.getByPlaceholderText('What Services are you looking today')).toBeInTheDocument();
  });

  test('displays category suggestions as user types', () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('What Services are you looking today');
    fireEvent.change(searchInput, { target: { value: 'Design' } });

    expect(screen.getByText('Graphics & Design')).toBeInTheDocument();
  });

  test('navigates to search results on search button click', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <Router>
        <LandingPage />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('What Services are you looking today');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, { target: { value: 'Design' } });
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('/landingsearchResults?category=Design');
  });

  test('fetches and displays category gigs', async () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Test Gig')).toBeInTheDocument();
  });

  test('handles API fetch failure gracefully', async () => {
    fetch.mockImplementationOnce(() => Promise.reject('API Error'));

    render(
      <Router>
        <LandingPage />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(
      screen.getByText('Failed to fetch gigs. Please check your internet connection or try again.')
    ).toBeInTheDocument();
  });
});
