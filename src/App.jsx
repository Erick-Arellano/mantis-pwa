import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Icon from './components/Icon';
import UnitIndex from './components/UnitIndex';
import unitData from './data/unit1.json';

import VisualExplorationEngine from './engines/VisualExplorationEngine';
import KaraokeEngine from './engines/KaraokeEngine';
import GamificationEngine from './engines/GamificationEngine';
import RelationshipsEngine from './engines/RelationshipsEngine';
import DataCaptureEngine from './engines/DataCaptureEngine';
import AREngine from './engines/AREngine';
import DragDropEngine from './engines/DragDropEngine';
import AudioPracticeEngine from './engines/AudioPracticeEngine';
import GemQuizEngine from './engines/grammar/GemQuizEngine';
import KaraokeReadingActivity from './engines/karaoke/KaraokeReadingActivity';
import AvatarBuilderEngine from './engines/gamification/AvatarBuilderEngine';
import SmartMatchEngine from './engines/vocabulary/SmartMatchEngine';
import AudioPopEngine from './engines/listening/AudioPopEngine';
import './App.css';

const ENGINE_MAP = {
  VisualExploration: VisualExplorationEngine,
  Karaoke: KaraokeEngine,
  KaraokeEngine: KaraokeEngine,
  Gamification: GamificationEngine,
  Relationships: RelationshipsEngine,
  DataCapture: DataCaptureEngine,
  AREngine: AREngine,
  DragDropEngine: DragDropEngine,
  AudioPracticeEngine: AudioPracticeEngine,
  GemQuizEngine: GemQuizEngine,
  KaraokeReadingEngine: KaraokeReadingActivity,
  AvatarBuilderEngine: AvatarBuilderEngine,
  SmartMatchEngine: SmartMatchEngine,
  AudioPopEngine: AudioPopEngine,
  SpotlightEngine: VisualExplorationEngine,
  SmartFormEngine: DataCaptureEngine,
  WritingChecklistEngine: DataCaptureEngine,
  InteractiveGalleryEngine: VisualExplorationEngine,
  ConceptMapEngine: RelationshipsEngine
};

function App() {
  const [viewState, setViewState] = useState('index'); // 'index' or 'activity'
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeActivityIdx, setActiveActivityIdx] = useState(0);

  const handleSelectActivity = (lessonIdx, activityIdx) => {
    setActiveLessonIdx(lessonIdx);
    setActiveActivityIdx(activityIdx);
    setViewState('activity');
  };

  if (viewState === 'index') {
    return (
      <ThemeProvider>
        <UnitIndex unitData={unitData} onSelectActivity={handleSelectActivity} />
      </ThemeProvider>
    );
  }

  const lesson = unitData.lessons[activeLessonIdx];
  const activity = lesson.activities[activeActivityIdx];
  const EngineComponent = ENGINE_MAP[activity.engine];

  return (
    <ThemeProvider>
      <Layout
        currentLessonTitle={lesson.title}
        onBackHome={() => setViewState('index')}
      >

        <div className="activity-navigation">
          <label>Activity:</label>
          <div className="activity-tabs">
            {lesson.activities.map((act, idx) => (
              <button
                key={act.id}
                className={idx === activeActivityIdx ? 'active' : ''}
                onClick={() => setActiveActivityIdx(idx)}
                title={act.title}
              >
                <Icon name={act.icons && act.icons.length > 0 ? act.icons[0].toString() : "0"} size={48} className="tab-icon" />
              </button>
            ))}
          </div>
        </div>

        <div className="engine-wrapper bento-box">
          {EngineComponent ? (
            <EngineComponent title={activity.title} data={activity.content || activity.data} type={activity.engine} />
          ) : (
            <div>Engine not found: {activity.engine}</div>
          )}
        </div>

        <div className="lesson-navigation">
          <button
            disabled={activeLessonIdx === 0}
            onClick={() => {
              setActiveLessonIdx(Math.max(0, activeLessonIdx - 1));
              setActiveActivityIdx(0);
            }}
          >
            Previous Lesson
          </button>
          <button
            disabled={activeLessonIdx === unitData.lessons.length - 1}
            onClick={() => {
              setActiveLessonIdx(Math.min(unitData.lessons.length - 1, activeLessonIdx + 1));
              setActiveActivityIdx(0);
            }}
          >
            Next Lesson
          </button>
        </div>

      </Layout>
    </ThemeProvider>
  );
}

export default App;
