import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step from './Step';
import { mockUseVolcaStore } from '../../../test/mockUseVolcaStore'

const updateStep = jest.fn()

const renderStep = ({ sequenceId = 0, stepId = 0 } = {}) => {
  const mockStepData = {
    id: 0,
    on: true,
    active: true,
    notes: [
      { id: 0, note: [60], velocity: 100, gateTime: "50", trigger: true },
      { id: 1, note: [48], velocity: 80, gateTime: "70", trigger: true },
      { id: 2, note: [72], velocity: 60, gateTime: "40", trigger: true },
    ],
    motionData: {},
    motionFuncTranspose: false
  }

  const sequence = {
    programNumber: 0,
    steps: [mockStepData],
  }

  const storeState = {
    currentSequenceNumber: 0,
    sequences: [sequence],
    updateStep,
  }
  jest.clearAllMocks();
  mockUseVolcaStore(storeState);

  const defaultProps = { sequenceId, stepId }

  return render(<Step {...defaultProps} />)
}

describe('Step Component', () => {
  it('renders without crashing', () => {
    const { container } = renderStep();
    expect(container).toBeInTheDocument();
  });

  it('displays the correct step number', () => {
    renderStep();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays the correct checkbox state for "Step On"', () => {
    renderStep();
    const checkbox = screen.getByLabelText('Step On:');
    expect(checkbox.checked).toBe(true);
  });

  it('renders the correct number of notes', () => {
    renderStep();
    const notes = screen.getAllByRole('listitem');
    expect(notes.length).toBe(3);
  });

  test('trigger step "on" event', () => {
    renderStep()
    const checkbox = screen.getByLabelText('Step On:')
    fireEvent.click(checkbox)
    expect(updateStep).toHaveBeenCalledWith(0, 0, { on: false })
  })

  describe('when the sequence is invalid', () => {
    it('displays the correct step number', () => {
      renderStep({ sequenceId: 1 });
      expect(screen.queryByText('1')).toBeNull();
      expect(screen.queryByLabelText('Step On:')).toBeNull();
      expect(screen.queryByRole('listitem')).toBeNull();
    })
  })

  describe('when the step is invalid', () => {
    it('displays the correct step number', () => {
      renderStep({ stepId: 1 });
      expect(screen.queryByText('1')).toBeNull();
      expect(screen.queryByLabelText('Step On:')).toBeNull();
      expect(screen.queryByRole('listitem')).toBeNull();
    })
  })
});