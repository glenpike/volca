import React, { useContext, useState } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext'
import { bytesToHex } from '../../utils/utils'
import WebMidiContext from '../../contexts/WebMidiContext'

const SequenceDebug = () => {
	const {
		currentSequence,
	} = useContext(VolcaFMContext)

	const {
		lastRxSysexMessage
	} = useContext(WebMidiContext)

	const [currentDump, setCurrentDump] = useState('')
	const handleDumpSysex = () => {

		setCurrentDump(bytesToHex(lastRxSysexMessage))
	}

	const handleDumpJSON = () => {
		setCurrentDump(JSON.stringify(currentSequence))
	}

	if (!currentSequence || !currentSequence?.steps?.length) {
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
			<button onClick={handleDumpSysex}>Dump Sysex</button>
			<button onClick={handleDumpJSON}>Dump JSON</button>
		</fieldset>
	)
}

export default SequenceDebug