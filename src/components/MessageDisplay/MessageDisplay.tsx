import React, { useContext } from 'react'
import WebMidiContext from '../../contexts/WebMidiContext'
import './MessageDisplay.css'
import { bytesToHex } from '../../utils/utils.js'

const MessageDisplay: React.FC = () => {
	const {
		lastTxSysexMessage,
		lastRxSysexMessage,
	} = useContext(WebMidiContext)

	const { manufacturer = '', data: txData = [] } = lastTxSysexMessage || {}

	const txMessageStr = () => {
		if (txData.length === 0) {
			return ''
		}

		return `f0,${bytesToHex([manufacturer])},${bytesToHex(txData)},f7`
	}

	const rxMessageStr = () => {
		if (!lastRxSysexMessage || lastRxSysexMessage.length === 0) {
			return ''
		}

		return `${bytesToHex(lastRxSysexMessage)}`
	}

	return (
		<fieldset className="group-control">
			<legend>Debug</legend>
			<div className="message-display">
				<textarea
					className="message-display__textarea"
					id="message-display-output"
					rows={4}
					defaultValue={txMessageStr()}
				/>
				<label className="message-display__label" htmlFor="message-display-output">
					<strong>Last Tx Sysex Message</strong>
				</label>
			</div>
			<div className="message-display">
				<textarea
					className="message-display__textarea"
					id="message-display-input"
					rows={4}
					defaultValue={rxMessageStr()}
				/>
				<label className="message-display__label" htmlFor="message-display-input">
					<strong>Last Rx Sysex Message</strong>
				</label>
			</div>
		</fieldset>
	)
}

export default MessageDisplay
