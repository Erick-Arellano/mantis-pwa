import React, { useState, useRef, useEffect } from 'react';
import './KaraokeEngine.css';
import '../visual/VisualExploration.css';

export default function KaraokeReadingActivity({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Group sync data by slide based on time. 
    // If the JSON provides sync_data per slide, we just use that.
    // The current JSON structure puts sync_data inside each slide object.

    if (!data || !data.slides || data.slides.length === 0) {
        return <div className="karaoke-reading placeholder-box">No reading data available.</div>;
    }

    const { slides, instruction, audio_url } = data;
    const currentSlide = slides[activeIndex];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);

            // Auto-advance slides based on time
            // Find which slide should be active based on the current time and the first word of each slide
            let newActiveIndex = activeIndex;
            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                if (slide.sync_data && slide.sync_data.length > 0) {
                    const firstWordStart = slide.sync_data[0].start;
                    const lastWordEnd = slide.sync_data[slide.sync_data.length - 1].end;

                    // Add a small buffer (e.g. 0.5s) to the end time before switching
                    if (audio.currentTime >= firstWordStart && audio.currentTime <= (lastWordEnd + 0.5)) {
                        newActiveIndex = i;
                        break;
                    }
                }
            }

            if (newActiveIndex !== activeIndex) {
                setActiveIndex(newActiveIndex);
            }
        };

        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [activeIndex, slides]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        const newIndex = (activeIndex + 1) % slides.length;
        setActiveIndex(newIndex);

        // If we manually change slides, should we jump the audio?
        // Let's jump to the start of that slide's sync data if it exists.
        if (slides[newIndex].sync_data && slides[newIndex].sync_data.length > 0) {
            if (audioRef.current) {
                audioRef.current.currentTime = slides[newIndex].sync_data[0].start;
            }
        }
    };

    const handlePrev = () => {
        const newIndex = (activeIndex - 1 + slides.length) % slides.length;
        setActiveIndex(newIndex);

        if (slides[newIndex].sync_data && slides[newIndex].sync_data.length > 0) {
            if (audioRef.current) {
                audioRef.current.currentTime = slides[newIndex].sync_data[0].start;
            }
        }
    };


    const renderKaraokeText = (syncData) => {
        if (!syncData) return null;

        return syncData.map((word, idx) => {
            const isActive = currentTime >= word.start && currentTime <= word.end;
            const isPast = currentTime > word.end;

            let className = "karaoke-word ";
            if (isActive) className += "active";
            else if (isPast) className += "past";

            return (
                <span key={idx} className={className}>
                    {word.text}
                </span>
            );
        });
    };

    return (
        <div className="karaoke-engine karaoke-reading reading-activity bento-box">
            {audio_url && (
                <audio ref={audioRef} src={audio_url} preload="auto" />
            )}

            <p className="instruction">{instruction}</p>

            {/* Audio Controls */}
            <div className="controls-panel">
                <button onClick={togglePlay} className="primary-btn play-btn">
                    <span className="icon">{isPlaying ? '⏸' : '▶'}</span>
                    {isPlaying ? 'Pause Reading' : 'Listen & Read'}
                </button>
            </div>

            {/* Carousel Area */}
            <div className="carousel-container" style={{ minHeight: '400px', marginTop: '0.5rem' }}>
                <button className="nav-btn prev-btn" onClick={handlePrev}>❮</button>

                <div className="carousel-track">
                    {slides.map((item, idx) => {
                        let positionClass = '';
                        if (idx === activeIndex) {
                            positionClass = 'active';
                        } else if (idx === (activeIndex - 1 + slides.length) % slides.length) {
                            positionClass = 'prev';
                        } else if (idx === (activeIndex + 1) % slides.length) {
                            positionClass = 'next';
                        } else {
                            positionClass = 'hidden';
                        }

                        return (
                            <div key={item.id} className={`gallery-card ${positionClass}`}>
                                <div className="card-image-wrapper">
                                    {/* Handle missing images gracefully for dev */}
                                    <img
                                        src={item.image_url}
                                        alt="Family member"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#e2e8f0;border-radius:12px;color:#64748b;font-weight:bold;">Image Pending</div>';
                                        }}
                                    />
                                </div>
                                <div className="card-content" style={{ overflowY: 'auto', justifyContent: 'flex-start' }}>
                                    <p className="karaoke-text-container" style={{ fontSize: '1.15rem', lineHeight: '1.5', textAlign: 'center', marginTop: '0.5rem' }}>
                                        {item.sync_data ? renderKaraokeText(item.sync_data) : item.text}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="nav-btn next-btn" onClick={handleNext}>❯</button>
            </div>

            <style>{`
                .karaoke-word {
                    transition: color 0.1s ease, text-shadow 0.1s ease;
                    color: var(--text-main);
                }
                .karaoke-word.active {
                    color: var(--theme-book, #882B41);
                    font-weight: 700;
                    text-shadow: 0 0 5px rgba(136, 43, 65, 0.3);
                }
                .karaoke-word.past {
                    color: var(--text-muted);
                }

                /* Override gallery card flex for reading */
                .gallery-card {
                     max-width: 400px;
                }

                /* Ensure the track shrinks on mobile to leave room for nav buttons */
                .carousel-track {
                     width: calc(100% - 90px);
                     max-width: 320px;
                }
            `}</style>
        </div>
    );
}
