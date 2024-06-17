import React from 'react'

const Step = ({stepNumber, stepData}) => {
  return (
    <li key={stepNumber} className="sequence-step">
      <p><strong>{stepNumber + 1}</strong></p>
      <p>{JSON.stringify(stepData)}</p>
    </li>
  )
}

export default Step