import React, { useContext, useState } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext.js'
import { bytesToHex } from '../../utils/utils.js'

const SequenceDebug = () => {
	const {
		currentSequence,
	} = useContext(VolcaFMContext)

	const [currentDump, setCurrentDump] = useState('')
	const handleGetSequence = () => {
		
		setCurrentDump(bytesToHex(currentSequence.sysexData))
	}

	if(!currentSequence || !currentSequence?.steps?.length) {
    return (
      <p>Load a sequence</p>
    )
  }

  return (
		<fieldset className="group-control">
			<legend>Debug</legend>
			<div className="message-display">
				{/* <label className="message-display__label" htmlFor="message-display-output">
					<strong>Current Sequence</strong>
				</label>
				<textarea 
					className="message-display__textarea"
					id="message-display-output"
					rows="10"
					value={JSON.stringify(currentDump)}
				/> */}
				<p>{JSON.stringify(currentDump)}</p>
			</div>
			<button onClick={handleGetSequence}>Dump</button>
    </fieldset>
  )
}

export default SequenceDebug