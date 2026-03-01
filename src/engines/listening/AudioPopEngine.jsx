import React, { useState, useEffect, useRef } from 'react';
import './AudioPopEngine.css';

export default function AudioPopEngine({ data, onComplete }) {
    if (!data || !data.phase1 || !data.phase2) {
        return <div className="audio-pop placeholder-box">Invalid Audio Pop Data</div>;
    }

    const { phase1, phase2 } = data;

    // --- Global State ---
    const [currentPhase, setCurrentPhase] = useState(1); // 1 or 2
    const [isPhaseSuccess, setIsPhaseSuccess] = useState(false);

    // --- Phase 1 State (Number Pop) ---
    const [p1CurrentTargetIndex, setP1CurrentTargetIndex] = useState(0);
    const [p1Score, setP1Score] = useState(0);
    const [p1ClickedErrors, setP1ClickedErrors] = useState({}); // { buttonValue: boolean } to shake
    const [p1IsPlaying, setP1IsPlaying] = useState(false);

    const audioRef = useRef(new Audio());

    const currentP1Target = phase1.targets[p1CurrentTargetIndex];

    // --- Phase 2 State (Form Fill) ---
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [p2IsPlaying, setP2IsPlaying] = useState(false);
    const p2AudioRef = useRef(new Audio(phase2.audio_url));

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            audioRef.current.pause();
            p2AudioRef.current.pause();
        };
    }, []);

    // ---------------------------------------------------------
    // PHASE 1 LOGIC
    // ---------------------------------------------------------

    // Auto-play the first target when entering phase 1 or moving to next target
    useEffect(() => {
        if (currentPhase === 1 && currentP1Target && !isPhaseSuccess) {
            playCurrentTarget();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [p1CurrentTargetIndex, currentPhase, isPhaseSuccess]);

    const playCurrentTarget = () => {
        if (!currentP1Target) return;
        audioRef.current.src = currentP1Target.audio_url;
        setP1IsPlaying(true);
        audioRef.current.play().catch(e => {
            console.error("Audio play failed:", e);
            setP1IsPlaying(false);
        });

        audioRef.current.onended = () => {
            setP1IsPlaying(false);
        };
    };

    const handleNumberTap = (value) => {
        if (isPhaseSuccess || p1Score >= phase1.targets.length) return;

        if (value === currentP1Target.value) {
            // Correct!
            const newScore = p1Score + 1;
            setP1Score(newScore);

            // Visual success feedback could go here

            if (newScore >= phase1.targets.length) {
                // Phase 1 Complete
                setIsPhaseSuccess(true);
                setTimeout(() => {
                    setCurrentPhase(2);
                    setIsPhaseSuccess(false);
                }, 2500);
            } else {
                // Move to next target
                setTimeout(() => {
                    setP1CurrentTargetIndex(prev => prev + 1);
                }, 500);
            }
        } else {
            // Incorrect
            setP1ClickedErrors(prev => ({ ...prev, [value]: true }));
            // Remove error state after animation
            setTimeout(() => {
                setP1ClickedErrors(prev => ({ ...prev, [value]: false }));
            }, 500);
        }
    };

    // ---------------------------------------------------------
    // PHASE 2 LOGIC
    // ---------------------------------------------------------

    const toggleP2Audio = () => {
        if (p2IsPlaying) {
            p2AudioRef.current.pause();
            setP2IsPlaying(false);
        } else {
            p2AudioRef.current.play();
            setP2IsPlaying(true);
            p2AudioRef.current.onended = () => setP2IsPlaying(false);
        }
    };

    const handleP2InputChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear error as they type
        if (formErrors[id]) {
            setFormErrors(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleP2Submit = () => {
        let allValid = true;
        const newErrors = {};

        phase2.form_fields.forEach(field => {
            const userAnswer = (formData[field.id] || "").trim().toLowerCase();
            const correctAnswer = field.answer.toLowerCase();

            if (userAnswer !== correctAnswer) {
                newErrors[field.id] = true;
                allValid = false;
            }
        });

        if (allValid) {
            setIsPhaseSuccess(true);
            if (onComplete) {
                setTimeout(onComplete, 2500);
            }
        } else {
            setFormErrors(newErrors);
        }
    };


    // ---------------------------------------------------------
    // RENDERERS
    // ---------------------------------------------------------

    if (currentPhase === 1) {
        return (
            <div className="audio-pop">
                <p className="instruction">{phase1.instruction}</p>

                <div className="ap-header">
                    <button
                        className={`ap-play-btn ${p1IsPlaying ? 'playing pulse-subtle' : ''}`}
                        onClick={playCurrentTarget}
                        aria-label="Play audio target"
                    >
                        {p1IsPlaying ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <rect x="6" y="4" width="4" height="16" />
                                    <rect x="14" y="4" width="4" height="16" />
                                </svg>
                                Listening...
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                                Play Audio
                            </>
                        )}
                    </button>
                    <div className="ap-score">
                        {p1Score} / {phase1.targets.length}
                    </div>
                </div>

                <div className="ap-grid">
                    {phase1.grid_options.map((num, i) => (
                        <button
                            key={i}
                            className={`ap-number-btn ${p1ClickedErrors[num] ? 'error shake' : ''}`}
                            onClick={() => handleNumberTap(num)}
                            disabled={isPhaseSuccess}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {isPhaseSuccess && (
                    <div className="ap-phase-overlay fade-in">
                        <h2>Great! Moving to writing...</h2>
                    </div>
                )}
            </div>
        );
    }

    if (currentPhase === 2) {
        return (
            <div className="audio-pop">
                <p className="instruction">{phase2.instruction}</p>

                <div className="ap-header">
                    <button
                        className={`ap-play-btn ${p2IsPlaying ? 'playing pulse-subtle' : ''}`}
                        onClick={toggleP2Audio}
                        aria-label="Toggle Interview Audio"
                    >
                        {p2IsPlaying ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <rect x="6" y="4" width="4" height="16" />
                                    <rect x="14" y="4" width="4" height="16" />
                                </svg>
                                Pause Interview
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                                Play Interview
                            </>
                        )}
                    </button>
                </div>

                <div className="ap-form-card">
                    <div className="ap-card-header">
                        <h3>Personal Profile</h3>
                    </div>
                    <div className="ap-card-body">
                        {phase2.form_fields.map(field => (
                            <div key={field.id} className="ap-form-group">
                                <label>{field.label}</label>
                                <input
                                    type="text"
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleP2InputChange(field.id, e.target.value)}
                                    className={`ap-input ${formErrors[field.id] ? 'input-error' : ''}`}
                                    placeholder="..."
                                    disabled={isPhaseSuccess}
                                />
                            </div>
                        ))}
                    </div>

                    {!isPhaseSuccess && (
                        <button className="ap-submit-btn" onClick={handleP2Submit}>
                            Check Answers
                        </button>
                    )}
                </div>

                {isPhaseSuccess && (
                    <div className="ap-phase-overlay fade-in">
                        <h2>Excellent Profile!</h2>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
