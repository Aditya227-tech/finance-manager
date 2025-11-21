import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from './DashboardPage';

// Mocking Firebase and other dependencies
vi.mock('../firebase', () => ({
  db: {},
  auth: {
    currentUser: {
      uid: 'test-uid',
      displayName: 'Test User',
      email: 'test@example.com',
    },
    onAuthStateChanged: vi.fn(),
  },
}));

vi.mock('../components/TransactionList', () => ({
  default: () => <div>TransactionList</div>,
}));

describe('DashboardPage', () => {
  it('renders the dashboard with user data', async () => {
    render(<DashboardPage />);
    
    // Check for the welcome message
    expect(await screen.findByText(/Welcome back, Test!/)).toBeInTheDocument();

    // Check for the main sections
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Income vs. Expenses')).toBeInTheDocument();
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();

    // Check that the mocked TransactionList is rendered
    expect(screen.getByText('TransactionList')).toBeInTheDocument();
  });
});
