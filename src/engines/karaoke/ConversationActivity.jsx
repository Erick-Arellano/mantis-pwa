import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, MicOff, Mic } from 'lucide-react';
import './KaraokeEngine.css';

export default function ConversationActivity({ data, title }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [mutedCharacters, setMutedCharacters] = useState(new Set());
    const audioRef = useRef(null);

    if (!data) return <div className="placeholder-box">No conversation data found.</div>;

    const { instruction, audio_url, characters, dialogue } = data;

    // Listen to time updates from the audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const time = audio.currentTime;
            setCurrentTime(time);

            // Volume Ducking Logic for Muted Characters
            const activeLine = dialogue.find(line => time >= line.startTime && time <= line.endTime);
            if (activeLine && mutedCharacters.has(activeLine.character)) {
                // Duck the volume drastically when a muted character is "speaking"
                // Don't use 0 so they can still hear a faint rhythm, or use 0.0 for total silence
                audio.volume = 0.05;
            } else {
                audio.volume = 1.0;
            }
        };
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('pause', () => setIsPlaying(false));
        audio.addEventListener('play', () => setIsPlaying(true));

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('pause', () => setIsPlaying(false));
            audio.removeEventListener('play', () => setIsPlaying(true));
        };
    }, [dialogue, mutedCharacters]); // Added dependencies to prevent stale closures on mutedCharacters

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => {
                console.error("Audio playback error:", e);
                setIsPlaying(false);
            });
        }
    };

    const toggleMuteCharacter = (charName) => {
        setMutedCharacters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(charName)) {
                newSet.delete(charName);
            } else {
                newSet.add(charName);
            }
            return newSet;
        });
    };

    // Determine which line is currently active
    const getActiveLineIndex = () => {
        return dialogue.findIndex(line => currentTime >= line.startTime && currentTime <= line.endTime);
    };

    const activeIndex = getActiveLineIndex();

    return (
        <div className="karaoke-engine-container">
            {title && <h2 className="activity-title">{title}</h2>}
            <p className="instruction">{instruction}</p>

            {/* Hidden audio element */}
            <audio ref={audioRef} src={audio_url} preload="auto" />

            {/* Top Controls: Play & Mute Toggles */}
            <div className="karaoke-controls">
                <button
                    className={`master-play-btn ${isPlaying ? 'playing' : ''}`}
                    onClick={togglePlay}
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="offset-play" />}
                </button>

                <div className="character-toggles">
                    {characters && characters.map(char => {
                        const isMuted = mutedCharacters.has(char.name);
                        return (
                            <button
                                key={char.name}
                                className={`char-toggle-btn ${isMuted ? 'muted' : ''}`}
                                onClick={() => toggleMuteCharacter(char.name)}
                                style={{ '--char-color': char.color }}
                                title={isMuted ? `Unmute ${char.name}` : `Mute ${char.name} to Practice`}
                            >
                                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                                <span>{char.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat/Dialogue Interface */}
            <div className="dialogue-box bento-box">
                {dialogue && dialogue.map((line, index) => {
                    const charDef = characters.find(c => c.name === line.character);
                    const isMuted = mutedCharacters.has(line.character);
                    const isActive = index === activeIndex;

                    // Logic to alternate bubbles left/right based on character order
                    // Assuming 2 characters, char 0 is left, char 1 is right
                    const isRightSide = characters.findIndex(c => c.name === line.character) > 0;

                    return (
                        <div
                            key={index}
                            className={`chat-bubble-container ${isRightSide ? 'right' : 'left'} ${isActive ? 'active' : ''}`}
                        >
                            <div className="chat-avatar" style={{ backgroundColor: charDef?.color || '#ccc' }}>
                                {line.character.charAt(0)}
                            </div>
                            <div className={`chat-bubble ${isMuted ? 'visually-muted' : ''}`}>
                                <div className="speaker-name">{line.character}</div>
                                <div className="speaker-text">
                                    {isMuted ? <span className="blurred-text">{line.text}</span> : line.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
