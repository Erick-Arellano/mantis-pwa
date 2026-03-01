import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import DraggableLabel from './components/DraggableLabel';
import DroppableTarget from './components/DroppableTarget';
import './DragDropEngine.css';

export default function DragDropEngine({ data, title }) {
    const [placedItems, setPlacedItems] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Provide robust sensors for both desktop and mobile touch
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
    );

    if (!data) return <div>No data available</div>;

    const { background_image, draggable_labels, targets, instruction } = data;

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const draggedWord = active.id;

        if (over) {
            const targetId = over.id;

            setPlacedItems(prev => {
                const newPlaced = { ...prev };

                // Remove word if it was already placed elsewhere
                for (const key in newPlaced) {
                    if (newPlaced[key] === draggedWord) {
                        delete newPlaced[key];
                    }
                }

                newPlaced[targetId] = draggedWord;
                return newPlaced;
            });
        } else {
            // Un-place if dropped outside
            setPlacedItems(prev => {
                const newPlaced = { ...prev };
                for (const key in newPlaced) {
                    if (newPlaced[key] === draggedWord) {
                        delete newPlaced[key];
                    }
                }
                return newPlaced;
            });
        }
    };

    const getAvailableWords = () => {
        const placedWords = Object.values(placedItems);
        return draggable_labels.filter(word => !placedWords.includes(word));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setPlacedItems({});
        setIsSubmitted(false);
    };

    const availableWords = getAvailableWords();

    return (
        <div className="drag-drop-engine bento-box">
            {title && <h2 className="activity-title">{title}</h2>}
            <p className="instruction">{instruction}</p>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="dnd-workspace">
                    <div className="image-area-container">
                        <div className="image-wrapper">
                            {/* Uses the image as standard structure to enforce aspect ratio */}
                            <img src={background_image} alt="Family Tree" className="family-tree-bg" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('missing-img') }} />

                            {targets.map(target => {
                                const placedWord = placedItems[target.id];
                                const isCorrect = placedWord === target.correct_label;

                                return (
                                    <DroppableTarget
                                        key={target.id}
                                        id={target.id}
                                        x={target.x}
                                        y={target.y}
                                        showValidation={isSubmitted}
                                        isCorrect={isCorrect}
                                    >
                                        {placedWord && (
                                            <DraggableLabel
                                                id={placedWord}
                                                text={placedWord}
                                                showValidation={isSubmitted}
                                                isCorrect={isCorrect}
                                            />
                                        )}
                                    </DroppableTarget>
                                );
                            })}
                        </div>
                    </div>

                    <div className="word-bank-container">
                        <h3 className="bank-title">Word Bank</h3>
                        <div className="word-bank">
                            {availableWords.map(word => (
                                <DraggableLabel key={word} id={word} text={word} />
                            ))}
                            {availableWords.length === 0 && (
                                <p className="bank-empty">All words placed!</p>
                            )}
                        </div>
                    </div>
                </div>
            </DndContext>

            <div className="action-footer">
                {!isSubmitted ? (
                    <button className="primary-btn submit-btn" onClick={handleSubmit}>
                        Check Answers
                    </button>
                ) : (
                    <button className="secondary-btn retry-btn" onClick={handleReset}>
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}
