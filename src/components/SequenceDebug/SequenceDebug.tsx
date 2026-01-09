import React, { useContext, useState } from 'react'
import { bytesToHex } from '../../utils/utils'
import { useVolcaStore } from '../../stores/useVolcaStore'
import { MidiContextType, SequenceInfo } from '../../types'
import VolcaFMContext from '../../contexts/VolcaFMContext'

const SequenceDebug = () => {
	const currentSequenceNumber = useVolcaStore((state) => state.currentSequenceNumber);
	const currentSequence = useVolcaStore(state => state.sequences.find((seq: SequenceInfo) => seq.programNumber === currentSequenceNumber))

	const {
		webMidiContext,
	} = useContext(VolcaFMContext)

	const {
		lastRxSysexMessage
	} = webMidiContext as MidiContextType

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
				<p className="force-wrap">{JSON.stringify(currentDump)}</p>
			</div>
			<button onClick={handleDumpSysex}>Dump Sysex</button>
			<button onClick={handleDumpJSON}>Dump JSON</button>
		</fieldset>
	)
}

export default SequenceDebug