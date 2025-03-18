import React, { useState } from 'react';
import Button from '../components/Button';

const SetupScreen = ({ questions = [], onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  
  // Group questions into logical steps (max 3 questions per step)
  const steps = [];
  for (let i = 0; i < questions.length; i += 3) {
    steps.push(questions.slice(i, i + 3));
  }

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    const currentQuestions = steps[currentStep] || [];
    return !currentQuestions
      .filter(q => q.required)
      .some(q => !answers[q.id]);
  };

  const isLastStep = currentStep === steps.length - 1;
  const currentQuestions = steps[currentStep] || [];

  return (
    <div className="container setup-screen">
      <div className="setup-content">
        <h1>Welcome to Van Controller</h1>
        <p>Let's set up your system. Step {currentStep + 1} of {steps.length}</p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="setup-form">
          {currentQuestions.map((question) => (
            <div key={question.id} className="form-group">
              <label>{question.label}: </label>
              
              {question.type === 'text' && (
                <input 
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
              )}
              
              {question.type === 'number' && (
                <input 
                  type="number"
                  min={question.min}
                  max={question.max}
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
                />
              )}
              
              {question.type === 'select' && (
                <select 
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {question.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {question.type === 'boolean' && (
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio"
                      name={question.id}
                      value="true"
                      checked={answers[question.id] === true}
                      onChange={() => handleInputChange(question.id, true)}
                    /> Yes
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio"
                      name={question.id}
                      value="false"
                      checked={answers[question.id] === false}
                      onChange={() => handleInputChange(question.id, false)}
                    /> No
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="button-group">
          {currentStep > 0 && (
            <Button 
              primary={false}
              onClick={prevStep}
            >
              Previous
            </Button>
          )}
          
          {!isLastStep ? (
            <Button 
              onClick={nextStep}
              disabled={!isStepComplete()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!isStepComplete()}
            >
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;