import React, { useState } from 'react';
import './DragDrop.css';

export default function DragDropActivity({ data }) {
    // State to hold the currently selected word from the bank
    const [selectedWord, setSelectedWord] = useState(null);

    // State to track words currently placed into targets: { "t1": "mother", "t2": "uncle" }
    const [placedWords, setPlacedWords] = useState({});

    if (!data) return <div>No data provided</div>;

    // Derive which words are still available in the bank
    const availableWords = data.draggable_labels.filter(word =>
        !Object.values(placedWords).includes(word)
    );

    // Handle clicking a word in the word bank
    const handleWordClick = (word) => {
        if (selectedWord === word) {
            setSelectedWord(null); // Deselect if already selected
        } else {
            setSelectedWord(word);
        }
    };

    // Handle clicking a target slot
    const handleTargetClick = (targetId) => {
        // If we have a word selected, place it here
        if (selectedWord) {
            setPlacedWords(prev => ({
                ...prev,
                [targetId]: selectedWord
            }));
            setSelectedWord(null);
        }
        // If no word is selected, but target has a word, return it to the bank
        else if (placedWords[targetId]) {
            setPlacedWords(prev => {
                const newPlaced = { ...prev };
                delete newPlaced[targetId];
                return newPlaced;
            });
        }
    };

    // Check if all targets are filled correctly
    const checkAnswers = () => {
        let score = 0;
        data.targets.forEach(target => {
            if (placedWords[target.id] === target.correct_label) {
                score++;
            }
        });
        alert(`You got ${score} out of ${data.targets.length} correct!`);
    };

    return (
        <div className="drag-drop-activity">
            <h2>Drag & Drop / Select & Place</h2>
            <p className="instruction">{data.instruction}</p>

            {/* Word Bank */}
            <div className="word-bank">
                {availableWords.map(word => (
                    <button
                        key={word}
                        className={`word-pill ${selectedWord === word ? 'selected' : ''}`}
                        onClick={() => handleWordClick(word)}
                    >
                        {word}
                    </button>
                ))}
                {availableWords.length === 0 && <span className="empty-bank">No words left</span>}
            </div>

            {/* Interactive Area */}
            <div className="interactive-area">
                {/* Background Image Container & Hotspots */}
                <div className="image-container drag-drop-canvas">
                    <img src={data.background_image} alt="Activity Background" className="background-img" />

                    {data.targets.map((target, idx) => {
                        // Fallback positions if the JSON doesn't provide x/y yet
                        const defaultY = 10 + (idx * 15);
                        const defaultX = 50;

                        return (
                            <div
                                key={target.id}
                                className={`drop-slot overlay-slot ${placedWords[target.id] ? 'filled' : ''} ${selectedWord ? 'highlight' : ''}`}
                                style={{
                                    top: target.y ? `${target.y}%` : `${defaultY}%`,
                                    left: target.x ? `${target.x}%` : `${defaultX}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onClick={() => handleTargetClick(target.id)}
                            >
                                {placedWords[target.id] || '?'}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="action-row">
                <button className="primary-button" onClick={checkAnswers}>Check Answers</button>
            </div>
        </div>
    );
}
