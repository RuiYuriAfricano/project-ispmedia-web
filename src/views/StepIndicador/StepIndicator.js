import React from 'react';
import './StepIndicator.css';

const StepIndicator = ({ currentStep, vetor }) => {
  return (
    <div className="step-indicator">
      {vetor.map((stepNumber) => (
        <div
          key={stepNumber.id}
          className={`step ${currentStep >= stepNumber.id ? 'active' : ''} ${currentStep > stepNumber.id ? 'completed' : ''}`}
        >
          <div className="step-icon">{stepNumber.id}</div>
          <div className="step-name">{stepNumber.txt}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
