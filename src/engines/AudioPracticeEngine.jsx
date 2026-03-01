import React, { useState, useRef } from 'react';
import { Play, Pause, Repeat } from 'lucide-react';
import './AudioPracticeEngine.css';

export default function AudioPracticeEngine({ data, title }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    if (!data) return <div>No data available</div>;

    const { instruction, audio_url, words } = data;

    const togglePlay = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(audio_url);
            audioRef.current.addEventListener('ended', () => setIsPlaying(false));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => {
                console.error("Audio playback failed", e);
                // Reset state if file not found
                setIsPlaying(false);
            });
        }
    };

    return (
        <div className="audio-practice-engine">
            {title && <h2 className="activity-title">{title}</h2>}
            <p className="instruction">{instruction}</p>

            <div className="practice-container">
                {/* Play Button Area */}
                <div className="player-column">
                    <button
                        className={`audio-btn ${isPlaying ? 'playing' : ''}`}
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause audio" : "Play audio"}
                    >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="offset-play" />}
                    </button>
                </div>

                {/* Vocabulary Grid Area */}
                <div className="words-column bento-box">
                    <div className="words-grid">
                        {words && words.map((word, index) => (
                            <div key={index} className="word-item">
                                {word}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
