class Note {
  constructor({ id, stepId, on = false, note = [], velocity = 0, gateTimeData = { gateTime: '0', trigger: false } } = {}) {
    this._id = id
    this._stepId = stepId
    this._on = on
    this._note = note
    this._velocity = velocity
    this._gateTimeData = gateTimeData
  }

  toObject= () => {
    return {
      id: this._id,
      stepId: this._stepId,
      on: this._on,
      note: this._note,
      velocity: this._velocity,
      gateTimeData: this._gateTimeData
    }
  }  

  get stepNoteId () {
    return `${this.stepId}_${this._id}`
  }

  get id() {
    return this._id
  }

  get stepId() {
    return this._stepId
  }

  get on() {
    return this._on
  }

  get number() {
    return this._note[0]
  }

  get note() {
    return this._note
  }

  get velocity() {  
    return this._velocity
  }

  get gateTime() {
    return this._gateTimeData.gateTime
  }

  get gateTimeData() {
    return this._gateTimeData
  }


  get trigger() {
    return this._gateTimeData.trigger
  }
}

export default Note