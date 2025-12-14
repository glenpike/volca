import React from 'react';
import { render, screen } from '@testing-library/react';
import Step from './Step';

describe('Step Component', () => {
  const mockStepData = {
    id: 0,
    on: true,
    notes: [
      { id: 0, note: [60], velocity: 100, gateTime: "50", trigger: true },
      { id: 1, note: [48], velocity: 80, gateTime: "70", trigger: true },
      { id: 2, note: [72], velocity: 60, gateTime: "40", trigger: true },
    ],
    motionData: {},
    motionFuncTranspose: false
  }

  // TODO: On change, etc...
  it('renders without crashing', () => {
    const { container } = render(<Step step={mockStepData} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct step number', () => {
    render(<Step step={mockStepData} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays the correct checkbox state for "Step On"', () => {
    render(<Step step={mockStepData} />);
    const checkbox = screen.getByLabelText('Step On:');
    expect(checkbox.checked).toBe(true);
  });

  it('renders the correct number of notes', () => {
    render(<Step step={mockStepData} />);
    const notes = screen.getAllByRole('listitem');
    expect(notes.length).toBe(3);
  });
});