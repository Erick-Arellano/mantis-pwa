import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableLabel({ id, text, showValidation, isCorrect }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { text }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 1000 : 1,
        position: isDragging ? 'relative' : 'static',
    };

    let stateClass = '';
    if (showValidation) {
        stateClass = isCorrect ? 'correct' : 'incorrect';
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`draggable-label ${stateClass} ${isDragging ? 'dragging' : ''}`}
        >
            {text}
        </div>
    );
}
