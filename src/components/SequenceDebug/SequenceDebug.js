import React, { useContext } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext.js'

const SequenceDebug = () => {
	const {
		currentSequence,
	} = useContext(VolcaFMContext)


  return (
		<fieldset className="group-control">
			<legend>Debug</legend>
			<div className="message-display">
			<label className="message-display__label" htmlFor="message-display-output">
					<strong>Current Sequence</strong>
				</label>
				<textarea 
					className="message-display__textarea"
					id="message-display-output"
					rows="10"
					value={JSON.stringify(currentSequence)}
				/>
			</div>
    </fieldset>
  )
}

export default SequenceDebug