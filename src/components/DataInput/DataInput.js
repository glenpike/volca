import React, { useContext, useState } from 'react'
import WebMidiContext from '../../contexts/WebMidiContext.js'
import { bytesToHex, hexToBytes } from '../../utils.js'

// import './DataInput.css'


const DataInput = () => {
	const {
		sendSysexMessage,
	} = useContext(WebMidiContext)

  const [sendContent, setSendContent] = useState(bytesToHex([0x00, 0x01, 0x2F, 0x1C, 0x10]));

	const handleButtonClick = () => {
		const hex = sendContent.replace(/ /g, '').split(',')

    sendSysexMessage(hexToBytes(hex))
	}
  
	return (
		<fieldset className="group-control">
			<legend>Send Data</legend>
			<div className="message-display">
				<textarea 
					className="message-display__textarea"
					id="message-display-output"
					rows="4"
					defaultValue={sendContent}
          onChange={e => setSendContent(e.target.value)}
				/>
				<label className="message-display__label" htmlFor="message-display-output">
					<strong>Msg to send</strong>
				</label>
			</div>
      <button
        onClick={handleButtonClick}
      >Send</button>
		</fieldset>
	)
}

export default DataInput
