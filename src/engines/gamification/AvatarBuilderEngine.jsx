import React, { useState, useEffect } from 'react';
import './AvatarBuilderEngine.css';

export default function AvatarBuilderEngine({ data, onComplete }) {
    if (!data || !data.questions || data.questions.length === 0) {
        return <div className="avatar-builder placeholder-box">No avatar data available.</div>;
    }

    const { instruction, available_features, questions } = data;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedFeatures, setSelectedFeatures] = useState({
        hair: null,
        eyes: null,
        facial_hair: null,
        accessories: null
    });

    // Default to the first category available in the JSON
    const categories = Object.keys(available_features);
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [isSuccess, setIsSuccess] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    // Check if current selection matches the required features for the question
    useEffect(() => {
        if (!currentQuestion || isSuccess) return;

        let isMatch = true;
        const required = currentQuestion.required_features;

        for (const [category, requiredFeatureId] of Object.entries(required)) {
            if (selectedFeatures[category] !== requiredFeatureId) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            handleSuccess();
        }
    }, [selectedFeatures, currentQuestion, isSuccess]);

    const handleSuccess = () => {
        // Add a delay so the user can see their completed avatar before it transitions
        setTimeout(() => {
            setIsSuccess(true);
        }, 1200);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsSuccess(false);
            // Optionally reset features or keep them as a starting point
            setSelectedFeatures({
                hair: null,
                eyes: null,
                facial_hair: null,
                accessories: null
            });
        } else {
            // Reached the end of the activity, loop back to the beginning
            setCurrentQuestionIndex(0);
            setIsSuccess(false);
            setSelectedFeatures({
                hair: null,
                eyes: null,
                facial_hair: null,
                accessories: null
            });
            if (onComplete) onComplete();
        }
    };

    const handleSelectFeature = (category, featureId) => {
        if (isSuccess) return; // Prevent changes after success

        setSelectedFeatures(prev => {
            // If clicking the currently selected feature, deselect it (allow bald/clean shaven)
            if (prev[category] === featureId) {
                return { ...prev, [category]: null };
            }
            return { ...prev, [category]: featureId };
        });
    };

    // Helper to get the full URL for a selected feature ID
    const getFeatureUrl = (category, featureId) => {
        if (!featureId) return null;
        const featureObj = available_features[category].find(f => f.id === featureId);
        return featureObj ? featureObj.url : null;
    };

    return (
        <div className="avatar-builder">
            <p className="instruction">{instruction}</p>

            <div className="question-banner">
                <h3>{currentQuestion.text}</h3>
                <div className="progress-dots">
                    {questions.map((_, idx) => (
                        <span key={idx} className={`dot ${idx === currentQuestionIndex ? 'active' : ''} ${idx < currentQuestionIndex ? 'completed' : ''}`}></span>
                    ))}
                </div>
            </div>

            <div className="builder-layout">
                {/* Canvas Area (Result) */}
                <div className="avatar-canvas-container">
                    {isSuccess ? (
                        <div className="success-reveal">
                            <img src={currentQuestion.success_image_url} alt="Success" className="reveal-image fade-in" />
                            <div className="success-message bounce-in">
                                <h4>{currentQuestion.success_message}</h4>
                                <button className="primary-btn next-q-btn" onClick={handleNextQuestion}>
                                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Activity'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="avatar-canvas">
                            {/* Base Face (Hardcoded or pulled from data wrapper if needed) */}
                            {/* For now, we assume a base face is always present in the background of the canvas block */}
                            <img src="/assets/images/u1_avatar/base_face.png" alt="Base Face" className="avatar-layer base-layer"
                                onError={(e) => { e.target.style.opacity = 0.5; /* Temporary missing asset state */ }} />

                            {/* Selected Layers */}
                            {selectedFeatures.eyes && <img src={getFeatureUrl('eyes', selectedFeatures.eyes)} className="avatar-layer feature-layer" alt="Eyes" />}
                            {selectedFeatures.facial_hair && <img src={getFeatureUrl('facial_hair', selectedFeatures.facial_hair)} className="avatar-layer feature-layer" alt="Facial Hair" />}
                            {selectedFeatures.hair && <img src={getFeatureUrl('hair', selectedFeatures.hair)} className="avatar-layer feature-layer" alt="Hair" />}
                            {selectedFeatures.accessories && <img src={getFeatureUrl('accessories', selectedFeatures.accessories)} className="avatar-layer feature-layer" alt="Accessories" />}
                        </div>
                    )}
                </div>

                {/* Controls Area */}
                <div className={`builder-controls ${isSuccess ? 'disabled' : ''}`}>
                    {/* Category Tabs */}
                    <div className="category-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                                disabled={isSuccess}
                            >
                                {cat.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Options Grid */}
                    <div className="options-grid">
                        {available_features[activeCategory].map(feature => (
                            <button
                                key={feature.id}
                                className={`option-btn ${selectedFeatures[activeCategory] === feature.id ? 'selected' : ''}`}
                                onClick={() => handleSelectFeature(activeCategory, feature.id)}
                                disabled={isSuccess}
                                title={feature.name}
                            >
                                {/* Thumbnail: Use the actual feature URL, or rely on naming convention for a small thumb */}
                                <div className="option-thumb" style={{ backgroundImage: `url(${feature.url})` }}>
                                    {!feature.url && <span>{feature.name}</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
