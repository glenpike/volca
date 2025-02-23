import Note from "./Note"

describe("Note", () => {
  test("Has the correct id", () => {
    const id = 16
    const note = new Note({ id })
    expect(note.id).toEqual(id)
  })

  test("Has the correct stepNoteId", () => {
    const stepId = 1
    const id = 16
    const note = new Note({ id, stepId })
    expect(note.stepNoteId).toEqual(`${stepId}_${id}`)
  })

  test("Has the correct on", () => {
    const on = true
    const note = new Note({ on })
    expect(note.on).toEqual(on)
  })

  test("Has the correct number", () => {
    const noteData = [60, 0]
    const note = new Note({ note: noteData })
    expect(note.number).toEqual(60)
  })

  test("Has the correct velocity", () => {
    const velocity = 100
    const note = new Note({ velocity })
    expect(note.velocity).toEqual(velocity)
  })

  test("Has the correct gateTime", () => {
    const gateTimeData = { gateTime: 50 }
    const note = new Note({ gateTimeData })
    expect(note.gateTime).toEqual(50)
  })

  test("Has the correct trigger", () => {
    const gateTimeData = { trigger: true }
    const note = new Note({ gateTimeData })
    expect(note.trigger).toEqual(true)
  })
})