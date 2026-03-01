import React from 'react';
import ConceptMapActivity from './relationships/ConceptMapActivity';
export default function RelationshipsEngine({ data, type }) {
    return (
        <div className="relationships-engine">
            {type === 'ConceptMapEngine' && <ConceptMapActivity data={data} />}
            {type !== 'ConceptMapEngine' && (
                <div className="placeholder-box">Unknown Relationships Type: {type}</div>
            )}
        </div>
    );
}
