import React from 'react';
import SmartFormActivity from './datacapture/SmartFormActivity';
import WritingChecklistActivity from './datacapture/WritingChecklistActivity';
export default function DataCaptureEngine({ data, type }) {
    return (
        <div className="datacapture-engine">
            {type === 'SmartFormEngine' && <SmartFormActivity data={data} />}
            {type === 'WritingChecklistEngine' && <WritingChecklistActivity data={data} />}
            {!['SmartFormEngine', 'WritingChecklistEngine'].includes(type) && (
                <div className="placeholder-box">Unknown DataCapture Type: {type}</div>
            )}
        </div>
    );
}
