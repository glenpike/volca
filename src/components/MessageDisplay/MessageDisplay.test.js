import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import MessageDisplay from './MessageDisplay.js'
import WebMidiContext from '../../contexts/WebMidiContext'

describe('MessageDisplay', () => {
	const provider = {
		lastSysexMessage: null,
	}

	beforeEach(() => {
		// console.log('beforeEach', provider)
		render(
			<WebMidiContext.Provider value={provider}>
				<MessageDisplay />
			</WebMidiContext.Provider>
		)
	})

	afterEach(() => {
		cleanup()
	})

	it('renders a textarea', () => {
		expect(screen.getByLabelText('Last Rx Sysex Message')).toBeTruthy()
	})

	it('renders with no data by default', () => {
		expect(screen.getByLabelText('Last Rx Sysex Message').value).toEqual('')
	})

	describe.skip('When midi is not initialised', () => {
		beforeAll(() => {
			provider.lastSysexMessage = { manufacturer: 0xaa, data: [1, 2, 3, 4, 5, 6] }
			console.log('beforeAll', provider)

		})
		afterAll(() => {
			provider.lastSysexMessage = null
		})

		it('renders with correct data when set', () => {
			const message = 'f0,aa,01,02,03,04,05,06,f7'
			expect(screen.getByLabelText('Last Rx Sysex Message').value).toEqual(message)
		})
	})
})
