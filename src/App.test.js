import { render, screen, act, } from '@testing-library/react';
import { mockUseVolcaStore } from '../test/mockUseVolcaStore'
jest.unmock('zustand')

import App from './App';

const storeState = {
  currentSequenceNumber: 10,
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseVolcaStore(storeState);
  })
  test('renders ok', async () => {
    await act(async () => {
      render(<App />)
    })

    const title = screen.getByText(/KORG volca fm Sequences/i)
    expect(title).toBeInTheDocument()
  })

  test('shows MIDI input/output selects and channel input', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByLabelText(/Input Device/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Output Device/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Channel/i)).toBeInTheDocument();
  });

  test('shows Test MIDI mode toggle and defaults to test mode', async () => {
    await act(async () => {
      render(<App />);
    });
    const toggle = screen.getByRole('switch', { name: /"Test Midi" Mode/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('renders main sequence components', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Get Sequence/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sequence Number/i)).toBeInTheDocument();
  });
})
