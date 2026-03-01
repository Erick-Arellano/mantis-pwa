import React from 'react';
import Icon from './Icon';
import './UnitIndex.css';

export default function UnitIndex({ unitData, onSelectActivity }) {

    if (!unitData || !unitData.lessons) return <div>Loading...</div>;

    // Extract just the number from the ID (e.g. "U1" -> "1")
    const unitNumber = unitData.id.replace(/\D/g, '');

    return (
        <div className="unit-index-container">
            <header className="unit-index-header">
                <div className="unit-badge">
                    <span className="unit-text">Unit</span>
                    <span className="unit-number">{unitNumber}</span>
                </div>
                <h1>{unitData.title}</h1>
            </header>

            <div className="bento-grid lesson-grid">
                {unitData.lessons.map((lesson, lessonIndex) => {
                    const isOpener = lessonIndex === 0;

                    // Group activities by type
                    const groupedActivities = lesson.activities.reduce((acc, act) => {
                        const group = act.type || 'Activity';
                        if (!acc[group]) acc[group] = [];
                        acc[group].push(act);
                        return acc;
                    }, {});

                    return (
                        <section
                            key={lesson.id}
                            className={`bento-box lesson-card ${isOpener ? 'is-opener' : ''}`}
                        >
                            <h3 className="lesson-title">
                                {isOpener ? "Opener" : lesson.title.split(':')[0]}
                            </h3>

                            <div className="activity-groups-container">
                                {Object.entries(groupedActivities).map(([groupName, acts]) => (
                                    <div key={groupName} className={`activity-group-box ${isOpener ? 'is-opener-group' : ''}`}>
                                        {!isOpener && <h4 className="activity-group-title">{groupName}</h4>}

                                        <div className="activity-icons-grid">
                                            {acts.map((act) => {
                                                const originalActIndex = lesson.activities.findIndex(a => a.id === act.id);
                                                // Display only the primary icon to reduce clutter
                                                const primaryIcon = act.icons && act.icons.length > 0 ? act.icons[0] : "0";

                                                return (
                                                    <div
                                                        key={`${act.id}-0`}
                                                        className="activity-icon-wrapper"
                                                        onClick={() => onSelectActivity(lessonIndex, originalActIndex)}
                                                        title={act.title}
                                                    >
                                                        <button className="activity-icon-btn">
                                                            <Icon name={primaryIcon} size={56} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
