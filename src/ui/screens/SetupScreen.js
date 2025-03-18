import React, { useState } from 'react';
import Button from '../components/Button';

const SetupScreen = ({ questions = [], onComplete }) => {
  const [answers, setAnswers] = useState({});
  
  // Sample questions for development
  const sampleQuestions = [
    {
      id: "vehicleMake",
      label: "Vehicle Make",
      type: "text",
      required: true
    },
    {
      id: "vehicleModel",
      label: "Vehicle Model",
      type: "text",
      required: true
    },
    {
      id: "vehicleYear",
      label: "Year",
      type: "number",
      min: 1950,
      max: 2030,
      required: true
    }
  ];
  
  const displayQuestions = questions.length > 0 ? questions : sampleQuestions;

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const isCompleteDisabled = () => {
    return displayQuestions
      .filter(q => q.required)
      .some(q => !answers[q.id]);
  };

  return (
    <div style={{ 
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#1e1e1e',
        borderRadius: '10px',
        padding: '30px'
      }}>
        <h1 style={{ marginBottom: '20px' }}>Welcome to Van Controller</h1>
        <p style={{ marginBottom: '30px' }}>Let's set up your system.</p>
        
        <div style={{ marginBottom: '30px' }}>
          {displayQuestions.map((question) => (
            <div key={question.id} style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                {question.label}:
              </label>
              
              {question.type === 'text' && (
                <input 
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #444',
                    backgroundColor: '#333',
                    color: 'white'
                  }}
                />
              )}
              
              {question.type === 'number' && (
                <input 
                  type="number"
                  min={question.min}
                  max={question.max}
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value ? parseInt(e.target.value) : '')}
                  style={{ 
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #444',
                    backgroundColor: '#333',
                    color: 'white'
                  }}
                />
              )}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={isCompleteDisabled()}
          style={{ width: '100%' }}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default SetupScreen;
