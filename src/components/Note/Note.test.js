import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Note from './Note'

const renderNote = ({ on = true, trigger = true }) => {
  const note = { note: [60, 0], velocity: 100, gateTime: "50", trigger }
  const defaultProps = {
    on,
    note,
    motionData: { x: 0, y: 0 }
  }

  render(<Note {...defaultProps} />)
}

describe('Note Component', () => {
  test('renders Note component', () => {
    renderNote({ on: true, trigger: true })
    expect(screen.getByLabelText('Trigger Note')).toBeInTheDocument()
    expect(screen.getByLabelText('Note')).toBeInTheDocument()
    expect(screen.getByLabelText('Octave')).toBeInTheDocument()
    expect(screen.getByLabelText('Velocity')).toBeInTheDocument()
    expect(screen.getByLabelText('Gate Time')).toBeInTheDocument()
    expect(screen.getByText(/Motion Data:/)).toBeInTheDocument()
  })

  describe('when on is true', () => {
    test('checkbox is checked', () => {
      renderNote({ on: true, trigger: true })
      expect(screen.getByLabelText('Trigger Note')).toBeChecked()
    })

    test('checkbox is enabled', () => {
      renderNote({ on: true, trigger: true })
      expect(screen.getByLabelText('Trigger Note')).toBeEnabled()
    })

    describe('when trigger is true', () => {
      beforeEach(() => {
        renderNote({ on: true, trigger: true })
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
    })

    describe('when trigger is false', () => {
      beforeEach(() => {
        renderNote({ on: true, trigger: false })
      })
  
      test('checkbox is not checked', () => {
        expect(screen.getByLabelText('Trigger Note')).not.toBeChecked()
      })
  
      test('checkbox is not disabled', () => {
        expect(screen.getByLabelText('Trigger Note')).not.toBeDisabled()
      })
  
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
  })

  describe('when on is false', () => {
    describe('when trigger is false', () => {
      beforeEach(() => {
        renderNote({ on: false, trigger: false })
      })

      test('checkbox is checked', () => {
        expect(screen.getByLabelText('Trigger Note')).not.toBeChecked()
      })
    })

    describe('when trigger is true', () => {
      beforeEach(() => {
        renderNote({ on: false, trigger: true })
      })

      test('checkbox is checked', () => {
        expect(screen.getByLabelText('Trigger Note')).toBeChecked()
      })
  
      test('checkbox is disabled', () => {
        expect(screen.getByLabelText('Trigger Note')).toBeDisabled()
      })

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
  })

  test.skip('checkbox onChange event', () => {
    render(<Note {...defaultProps} />)
    const checkbox = screen.getByLabelText('Trigger Note')
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})