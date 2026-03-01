import React, { useState } from 'react';
import './DataCapture.css';

export default function SmartFormActivity({ data }) {
    const [formValues, setFormValues] = useState({});
    const [validationResults, setValidationResults] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!data) return <div>No form data available</div>;

    const handleInputChange = (e, label) => {
        setFormValues({ ...formValues, [label]: e.target.value });
        // Clear validation state for this field when typing
        if (validationResults[label]) {
            setValidationResults({ ...validationResults, [label]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const results = {};

        data.form_fields.forEach(field => {
            const userInput = formValues[field.label] ? formValues[field.label].trim().toLowerCase() : '';
            const correctAns = field.correct_answer.toString().toLowerCase();

            const isCorrect = userInput === correctAns;
            results[field.label] = isCorrect;
        });

        setValidationResults(results);
        setIsSubmitted(true);

        // Optional: Could trigger a global point sound or event here
    };

    const allCorrect = isSubmitted && Object.values(validationResults).every(v => v === true);

    return (
        <div className="datacapture-activity smart-form">
            <h2>Smart Form: {data.title || 'Complete the Chart'}</h2>
            <p className="instruction">{data.instruction}</p>

            {/* Audio Player if present */}
            {data.audio_url && (
                <div className="audio-player-container">
                    {/* Using HTML5 audio for now, easily swappable later */}
                    <audio controls controlsList="nodownload noplaybackrate">
                        <source src={data.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}

            {/* Form Area */}
            <form onSubmit={handleSubmit} className="form-container">
                {data.form_fields.map((field, idx) => {
                    const isCorrect = validationResults[field.label] === true;
                    const isError = validationResults[field.label] === false;

                    return (
                        <div key={idx} className="form-group">
                            <label htmlFor={`field-${idx}`}>{field.label}</label>
                            <div className="input-wrapper">
                                <input
                                    id={`field-${idx}`}
                                    type={field.type}
                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                    value={formValues[field.label] || ''}
                                    onChange={(e) => handleInputChange(e, field.label)}
                                    className={`
                    ${isCorrect ? 'input-success' : ''} 
                    ${isError ? 'input-error' : ''}
                  `}
                                    disabled={allCorrect} // Disable if everything is right
                                />

                                {/* Validation Icons */}
                                {isCorrect && <span className="feedback-icon success">✅</span>}
                                {isError && <span className="feedback-icon error">❌</span>}
                            </div>
                        </div>
                    );
                })}

                <div className="action-row">
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={allCorrect || Object.keys(formValues).length === 0}
                    >
                        {allCorrect ? 'Perfect!' : 'Check Answers'}
                    </button>
                </div>
            </form>
        </div>
    );
}
