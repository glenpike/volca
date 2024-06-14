import React, { useContext } from 'react'
import WebMidiContext from '../../contexts/WebMidiContext.js'
import { bytesToHex } from '../../utils.js'

import './MessageDisplay.css'

const MessageDisplay = () => {
	const {
		lastTxSysexMessage,
		lastRxSysexMessage,
	} = useContext(WebMidiContext)

	const { manufacturer = '', txData = [] } = lastTxSysexMessage || {}

	const txMessageStr = () => {
		if(0 == txData.length) {
			return ''
		}

		return `f0,${bytesToHex([manufacturer])},${bytesToHex(txData)},f7`
	}

	const { rxData = [] } = lastRxSysexMessage || {}

	const rxMessageStr = () => {
		if(0 == rxData.length) {
			return ''
		}

		return `${bytesToHex(rxData)}`
	}

	return (
		<fieldset className="group-control">
			<legend>Debug</legend>
			<div className="message-display">
				<textarea 
					className="message-display__textarea"
					id="message-display-output"
					rows="4"
					defaultValue={txMessageStr()}
				/>
				<label className="message-display__label" htmlFor="message-display-output">
					<strong>Last Tx Sysex Message</strong>
				</label>
			</div>
			<div className="message-display">
				<textarea 
					className="message-display__textarea"
					id="message-display-output"
					rows="4"
					defaultValue={rxMessageStr()}
				/>
				<label className="message-display__label" htmlFor="message-display-output">
					<strong>Last Rx Sysex Message</strong>
				</label>
			</div>
		</fieldset>
	)
}

export default MessageDisplay
