import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Note from './Note';

describe('Note Component', () => {
  const defaultProps = {
    on: true,
    number: 60,
    velocity: 100,
    gateTime: 50,
    trigger: true,
    motionData: { x: 0, y: 0 }
  };

  test('renders Note component', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByLabelText('Trigger Note')).toBeInTheDocument();
    expect(screen.getByLabelText('Note')).toBeInTheDocument();
    expect(screen.getByLabelText('Octave')).toBeInTheDocument();
    expect(screen.getByLabelText('Velocity')).toBeInTheDocument();
    expect(screen.getByLabelText('Gate Time')).toBeInTheDocument();
    expect(screen.getByText(/Motion Data:/)).toBeInTheDocument();
  });

  test('checkbox is checked when trigger is true', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByLabelText('Trigger Note')).toBeChecked();
  });

  test('checkbox is not checked when trigger is false', () => {
    render(<Note {...defaultProps} trigger={false} />);
    expect(screen.getByLabelText('Trigger Note')).not.toBeChecked();
  });

  test('select is disabled when on is false', () => {
    render(<Note {...defaultProps} on={false} />);
    expect(screen.getByLabelText('Note')).toBeDisabled();
  });

  test('select is enabled when on is true and trigger is true', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByLabelText('Note')).toBeEnabled();
  });

  test('octave input is disabled when on is false', () => {
    render(<Note {...defaultProps} on={false} />);
    expect(screen.getByLabelText('Octave')).toBeDisabled();
  });

  test('octave input is enabled when on is true and trigger is true', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByLabelText('Octave')).toBeEnabled();
  });

  test('velocity input is disabled when on is false', () => {
    render(<Note {...defaultProps} on={false} />);
    expect(screen.getByLabelText('Velocity')).toBeDisabled();
  });

  test('velocity input is enabled when on is true and trigger is true', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByLabelText('Velocity')).toBeEnabled();
  });

  test('gate time input is disabled when on is false', () => {
    render(<Note {...defaultProps} on={false} />);
    expect(screen.getByLabelText('Gate Time')).toBeDisabled();
  });

  test('gate time input is enabled when on is true and trigger is true', () => {
    render(<Note {...defaultProps} />);
    expect(screen.getByLabelText('Gate Time')).toBeEnabled();
  });

  test.skip('checkbox onChange event', () => {
    render(<Note {...defaultProps} />);
    const checkbox = screen.getByLabelText('Trigger Note');
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});