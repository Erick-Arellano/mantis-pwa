import React, { useState } from 'react';
import './DataCapture.css';

export default function WritingChecklistActivity({ data }) {
    const [compositionText, setCompositionText] = useState('');
    const [checklistChecks, setChecklistChecks] = useState(
        new Array(data.checklist ? data.checklist.length : 0).fill(false)
    );

    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!data) return <div>No writing data available</div>;

    const handleCheckboxChange = (index) => {
        const updatedChecks = [...checklistChecks];
        updatedChecks[index] = !updatedChecks[index];
        setChecklistChecks(updatedChecks);
    };

    const allChecked = checklistChecks.every(Boolean);
    const textHasContent = compositionText.trim().length > 10;

    // Can only submit if they filled the text AND ticked all checklist items
    const canSubmit = allChecked && textHasContent && !isSubmitted;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (canSubmit) {
            setIsSubmitted(true);
            // In a real scenario, this would post to the "Digital Portfolio" backend or LocalStorage
        }
    };

    return (
        <div className="datacapture-activity writing-checklist">
            <h2>Writing Portfolio</h2>
            <p className="instruction">{data.instruction}</p>

            {/* Model Reference Area */}
            {data.model_text && (
                <div className="model-text-container">
                    <span className="model-badge">Example Profile</span>
                    <p className="model-text">{data.model_text}</p>
                </div>
            )}

            {/* Writing Area */}
            <div className="writing-area">
                <textarea
                    placeholder="Start writing your profile here..."
                    value={compositionText}
                    onChange={(e) => {
                        setCompositionText(e.target.value);
                        setIsSubmitted(false); // Reset submit state if they keep typing
                    }}
                    disabled={isSubmitted}
                    className="composition-textarea"
                ></textarea>
                <span className="word-count">
                    {compositionText.trim() === '' ? 0 : compositionText.trim().split(/\s+/).length} words
                </span>
            </div>

            {/* Checklist Validation Form */}
            <form onSubmit={handleSubmit} className="checklist-container">
                <h3>Self-Review Checklist</h3>
                <p className="checklist-subtitle">Tick all boxes before submitting your final work:</p>

                <div className="checklist-items">
                    {data.checklist.map((item, idx) => (
                        <label key={idx} className={`checklist-item ${checklistChecks[idx] ? 'checked' : ''}`}>
                            <input
                                type="checkbox"
                                checked={checklistChecks[idx]}
                                onChange={() => handleCheckboxChange(idx)}
                                disabled={isSubmitted}
                            />
                            <span className="custom-checkbox"></span>
                            <span className="checklist-text">{item}</span>
                        </label>
                    ))}
                </div>

                <div className="action-row">
                    <button
                        type="submit"
                        className="primary-button submit-portfolio-btn"
                        disabled={!canSubmit}
                    >
                        {isSubmitted ? 'Saved to Portfolio ✅' : 'Submit to Portfolio'}
                    </button>
                </div>
            </form>
        </div>
    );
}
