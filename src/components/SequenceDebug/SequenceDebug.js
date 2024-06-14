import React, { useContext, useEffect, useState } from 'react'
import VolcaFMContext from '../../contexts/VolcaFMContext.js'
import { bytesToHex } from '../../utils.js'

const SequenceDebug = () => {
	const {
		currentSequence,
		getSequence,
	} = useContext(VolcaFMContext)

	// useEffect(() => {
	// 	getSequence(1)
	// }, [])

  return (
		<fieldset className="group-control">
			<legend>Debug</legend>
			<div className="message-display">
				<textarea 
					className="message-display__textarea"
					id="message-display-output"
					rows="10"
					defaultValue={bytesToHex(currentSequence)}
				/>
				<label className="message-display__label" htmlFor="message-display-output">
					<strong>Current Sequence</strong>
				</label>
			</div>
			<div className="get-sequence">
				<button onClick={() => getSequence(1)}>Get Sequence</button>
			</div>
    </fieldset>
  )
}

export default SequenceDebug