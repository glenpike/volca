import React from 'react';
import { render } from '@testing-library/react';
import Step from './Step';

jest.mock('../Note/Note.js', () => () => <div className="mock-note">Mock Note</div>);

describe('Step Component', () => {
  const mockStepData = {
    on: true,
    active: true,
    stepData: {
      _data: {
        voiceNoteNumbers: [[60], [62], [64]],
        voiceGateTimes: [{ gateTime: 0.5, trigger: true }, { gateTime: 0.5, trigger: true }, { gateTime: 0.5, trigger: true }],
        voiceVelocities: [100, 100, 100],
        motionData: {}
      }
    }
  };

  it('renders without crashing', () => {
    const { container } = render(<Step stepNumber={0} stepData={mockStepData} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct step number', () => {
    const { getByText } = render(<Step stepNumber={0} stepData={mockStepData} />);
    expect(getByText('1')).toBeInTheDocument();
  });

  it('displays the correct checkbox state for "Step On"', () => {
    const { getByLabelText } = render(<Step stepNumber={0} stepData={mockStepData} />);
    const checkbox = getByLabelText('Step On:');
    expect(checkbox.checked).toBe(true);
  });

  it('renders the correct number of notes', () => {
    const { container } = render(<Step stepNumber={0} stepData={mockStepData} />);
    const notes = container.querySelectorAll('.step-note');
    expect(notes.length).toBe(3);
  });
});