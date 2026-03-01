import React from 'react';
import InteractiveGalleryActivity from './visual/InteractiveGalleryActivity';
export default function VisualExplorationEngine({ data, type }) {
  return (
    <div className="visual-engine">
      {type === 'InteractiveGalleryEngine' && <InteractiveGalleryActivity data={data} />}
      {type !== 'InteractiveGalleryEngine' && (
        <div className="placeholder-box">Unknown Visual Type: {type}</div>
      )}
    </div>
  );
}
