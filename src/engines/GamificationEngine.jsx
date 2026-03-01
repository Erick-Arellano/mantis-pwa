import React from 'react';
import DragDropActivity from './gamification/DragDropActivity';
import GemQuizActivity from './gamification/GemQuizActivity';

export default function GamificationEngine({ data, type }) {
    return (
        <div className="gamification-engine">
            {/* Route to the correct sub-engine based on the type */}
            {type === 'DragDropEngine' && <DragDropActivity data={data} />}
            {type === 'GemQuizEngine' && <GemQuizActivity data={data} />}
            {!['DragDropEngine', 'GemQuizEngine'].includes(type) && (
                <div className="placeholder-box">Unknown Gamification Type: {type}</div>
            )}
        </div>
    );
}
