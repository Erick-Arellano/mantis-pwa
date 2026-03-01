import React, { useState, useEffect } from 'react';
import './SmartMatchEngine.css';

export default function SmartMatchEngine({ data, onComplete }) {
    if (!data || !data.items || data.items.length === 0) {
        return <div className="smart-match placeholder-box">No vocabulary data available.</div>;
    }

    const { instruction, items } = data;

    // Shuffle the words for the bank only once on mount
    const [wordBank, setWordBank] = useState([]);

    // Track which words have been placed in which slots (itemId -> wordObj)
    const [matches, setMatches] = useState({});

    // Tap-to-match state
    const [selectedWord, setSelectedWord] = useState(null);
    const [errorSlotId, setErrorSlotId] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Initialize word bank with shuffled items
        const words = items.map(item => ({ id: item.id, word: item.word }));
        // Simple shuffle
        const shuffled = words.sort(() => Math.random() - 0.5);
        setWordBank(shuffled);
    }, [items]);

    useEffect(() => {
        // Check win condition whenever matches change
        if (Object.keys(matches).length === items.length) {
            setTimeout(() => setIsSuccess(true), 500);
            if (onComplete) {
                setTimeout(onComplete, 2000);
            }
        }
    }, [matches, items.length, onComplete]);

    const handleWordTap = (wordObj) => {
        if (isSuccess) return;
        // Toggle selection
        if (selectedWord && selectedWord.id === wordObj.id) {
            setSelectedWord(null);
        } else {
            setSelectedWord(wordObj);
            setErrorSlotId(null); // Clear any previous errors
        }
    };

    const handleSlotTap = (item) => {
        if (isSuccess || !selectedWord) return;

        // Check if the selected word is correct for this slot
        if (selectedWord.id === item.id) {
            // Correct match!
            setMatches(prev => ({ ...prev, [item.id]: selectedWord }));

            // Remove word from bank
            setWordBank(prev => prev.filter(w => w.id !== selectedWord.id));

            // Clear selection
            setSelectedWord(null);
        } else {
            // Incorrect match
            setErrorSlotId(item.id);
            // Vibrate screen/slot briefly, then clear error state
            setTimeout(() => setErrorSlotId(null), 600);
            // Deselect the word to force them to pick again
            setSelectedWord(null);
        }
    };

    // Words currently in the bank are those without a match
    const availableWords = wordBank;

    return (
        <div className="smart-match">
            <p className="instruction">{instruction}</p>

            {/* Word Bank Container */}
            <div className="word-bank-container" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
                <h4 className="bank-title">Word Bank</h4>
                <div className={`word-bank ${isSuccess ? 'completed' : ''}`}>
                    {availableWords.map(wordObj => (
                        <button
                            key={wordObj.id}
                            className={`word-pill ${selectedWord && selectedWord.id === wordObj.id ? 'selected pulse' : ''}`}
                            onClick={() => handleWordTap(wordObj)}
                            disabled={isSuccess}
                        >
                            {wordObj.word}
                        </button>
                    ))}
                    {availableWords.length === 0 && !isSuccess && (
                        <p className="empty-bank-msg">All words placed!</p>
                    )}
                    {isSuccess && (
                        <div className="success-banner fade-in">
                            <h3>Great Job!</h3>
                        </div>
                    )}
                </div>
            </div>

            <div className={`match-grid ${isSuccess ? 'success-mode' : ''}`}>
                {items.map(item => {
                    const isMatched = !!matches[item.id];
                    const matchedWord = matches[item.id];
                    const isError = errorSlotId === item.id;

                    return (
                        <div key={item.id} className="match-item">
                            {/* Image Presenter */}
                            <div className="match-image-container">
                                <img
                                    src={item.image_url}
                                    alt="Vocabulary context"
                                    className="match-image"
                                    onError={(e) => { e.target.style.opacity = 0.5; }}
                                />
                                {isMatched && (
                                    <div className="success-check bounce-in">✓</div>
                                )}
                            </div>

                            {/* Drop Slot */}
                            <div
                                className={`match-slot ${isMatched ? 'filled' : ''} ${isError ? 'error shake' : ''} ${selectedWord && !isMatched ? 'ready-to-receive' : ''}`}
                                onClick={() => !isMatched && handleSlotTap(item)}
                            >
                                {isMatched ? (
                                    <span className="matched-word">{matchedWord.word}</span>
                                ) : (
                                    <span className="slot-hint">Tap word, then tap here</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
