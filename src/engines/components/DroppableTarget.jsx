import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function DroppableTarget({ id, x, y, children, showValidation, isCorrect }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
    };

    let stateClass = '';
    if (showValidation && children) {
        stateClass = isCorrect ? 'target-correct' : 'target-incorrect';
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`droppable-target ${isOver ? 'is-over' : ''} ${stateClass} ${children ? 'has-item' : ''}`}
        >
            {children || <span className="target-placeholder">Drop Here</span>}
        </div>
    );
}
