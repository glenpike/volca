import { render, screen, fireEvent } from '@testing-library/react'
import Note from './Note'
import { mockUseVolcaStore } from '../../../test/mockUseVolcaStore'


const renderNote = ({ on = true, trigger = true }) => {
  const note = { id: 0, note: [60, 0], velocity: 100, gateTime: "50", trigger }
  const step = {
    id: 0,
    on,
    notes: [note],
    motionData: {},
    motionFuncTranspose: false
  }

  const sequence = {
    programNumber: 0,
    steps: [step],
  }

  const storeState = {
    currentSequenceNumber: 0,
    sequences: [sequence],
  }
  jest.clearAllMocks();
  mockUseVolcaStore(storeState);

  const defaultProps = { noteId: 0, sequenceId: 0, stepId: 0, on, motionData: step.motionData }

  render(<Note {...defaultProps} />)
}

let noteState = { on: true, trigger: true }

describe('Note Component', () => {
  test('renders Note component', () => {
    renderNote(noteState)
    expect(screen.getByLabelText('Trigger Note')).toBeInTheDocument()
    expect(screen.getByLabelText('Note')).toBeInTheDocument()
    expect(screen.getByLabelText('Octave')).toBeInTheDocument()
    expect(screen.getByLabelText('Velocity')).toBeInTheDocument()
    expect(screen.getByLabelText('Gate Time')).toBeInTheDocument()
    expect(screen.getByText(/Motion Data:/)).toBeInTheDocument()
  })

  describe('when on is true', () => {
    describe('when trigger is true', () => {
      test('checkbox is checked', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Trigger Note')).toBeChecked()
      })

      test('select is enabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Note')).toBeEnabled()
      })

      test('octave input is enabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Octave')).toBeEnabled()
      })

      test('velocity input is enabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Velocity')).toBeEnabled()
      })

      test('gate time input is enabled when on is true and trigger is true', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Gate Time')).toBeEnabled()
      })
    })

    describe('when trigger is false', () => {
      let noteState = { on: true, trigger: false }
      test('checkbox is not checked', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Trigger Note')).not.toBeChecked()
      })

      test('select is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Note')).toBeDisabled()
      })

      test('octave input is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Octave')).toBeDisabled()
      })

      test('velocity input is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Velocity')).toBeDisabled()
      })

      test('gate time input is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Gate Time')).toBeDisabled()
      })
    })
  })

  describe('when on is false', () => {
    describe('when trigger is false', () => {
      let noteState = { on: false, trigger: false }
      test('checkbox is checked', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Trigger Note')).not.toBeChecked()
      })
    })

    describe('when trigger is true', () => {
      let noteState = { on: false, trigger: true }
      test('checkbox is checked', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Trigger Note')).toBeChecked()
      })

      test('select is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Note')).toBeDisabled()
      })

      test('octave input is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Octave')).toBeDisabled()
      })

      test('velocity input is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Velocity')).toBeDisabled()
      })

      test('gate time input is disabled', () => {
        renderNote(noteState)
        expect(screen.getByLabelText('Gate Time')).toBeDisabled()
      })
    })
  })

  test.skip('checkbox onChange event', () => {
    renderNote(noteState)
    const checkbox = screen.getByLabelText('Trigger Note')
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})