import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Note from './Note'
import VolcaNote from '../../utils/Volca/Sequence/Note'

describe('Note Component', () => {
  let on = true
  let trigger = true

  beforeEach(() => {  
    const note = new VolcaNote({ id: 1, stepId: 1, on, note: [60, 0], velocity: 100, gateTimeData: { gateTime: 50, trigger } })
    const defaultProps = {
      note,
      motionData: { x: 0, y: 0 }
    }
    render(<Note {...defaultProps} />)
  })

  test('renders Note component', () => {
    expect(screen.getByLabelText('Trigger Note')).toBeInTheDocument()
    expect(screen.getByLabelText('Note')).toBeInTheDocument()
    expect(screen.getByLabelText('Octave')).toBeInTheDocument()
    expect(screen.getByLabelText('Velocity')).toBeInTheDocument()
    expect(screen.getByLabelText('Gate Time')).toBeInTheDocument()
    expect(screen.getByText(/Motion Data:/)).toBeInTheDocument()
  })

  test('checkbox is checked', () => {
    expect(screen.getByLabelText('Trigger Note')).toBeChecked()
  })

  test('select is enabled', () => {
    expect(screen.getByLabelText('Note')).toBeEnabled()
  })

  test('octave input is enabled', () => {
    expect(screen.getByLabelText('Octave')).toBeEnabled()
  })

  test('velocity input is enabled', () => {
    expect(screen.getByLabelText('Velocity')).toBeEnabled()
  })

  test('gate time input is enabled when on is true and trigger is true', () => {
    expect(screen.getByLabelText('Gate Time')).toBeEnabled()
  })

  describe('when trigger is false', () => {
    trigger = false

    test('checkbox is not checked', () => {
      expect(screen.getByLabelText('Trigger Note')).not.toBeChecked()
    })
  })


  describe('when on is false', () => {
    on = false
  
    test('select is disabled', () => {
      expect(screen.getByLabelText('Note')).toBeDisabled()
    })

    test('octave input is disabled', () => {
      expect(screen.getByLabelText('Octave')).toBeDisabled()
    })

    test('velocity input is disabled', () => {
      expect(screen.getByLabelText('Velocity')).toBeDisabled()
    })

    test('gate time input is disabled', () => {
      expect(screen.getByLabelText('Gate Time')).toBeDisabled()
    })
  })

  test.skip('checkbox onChange event', () => {
    render(<Note {...defaultProps} />)
    const checkbox = screen.getByLabelText('Trigger Note')
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})