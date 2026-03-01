import React, { useState, useRef } from 'react';
import './Karaoke.css';

export default function AudioPracticeActivity({ data }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingUrl, setRecordingUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        setRecordingUrl(null);
        audioChunksRef.current = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setRecordingUrl(url);
                // Stop all tracks to release the mic
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access the microphone. Please check browser permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    if (!data) return <div>No audio practice data available</div>;

    return (
        <div className="karaoke-activity audio-practice">
            <h2>Audio Practice: {data.title}</h2>
            <p className="instruction">{data.instruction}</p>

            <div className="phrases-container">
                {data.phrases && data.phrases.map((phrase, idx) => (
                    <div key={idx} className="phrase-card">
                        <span className="phrase-text">"{phrase}"</span>
                    </div>
                ))}
            </div>

            <div className="practice-controls">
                <div className="reference-audio">
                    <h4>Listen to Reference:</h4>
                    {data.reference_audio ? (
                        <audio src={data.reference_audio} controls controlsList="nodownload" />
                    ) : (
                        <p>No reference audio provided.</p>
                    )}
                </div>

                <div className="recording-section">
                    <h4>Your Turn (Record your voice):</h4>

                    <div className="record-actions">
                        {!isRecording ? (
                            <button className="primary-button record-btn" onClick={startRecording}>
                                🎤 Start Recording
                            </button>
                        ) : (
                            <button className="primary-button stop-btn" onClick={stopRecording}>
                                ⏹️ Stop Recording
                            </button>
                        )}
                        {isRecording && <span className="recording-indicator">Recording...</span>}
                    </div>

                    {recordingUrl && (
                        <div className="playback-section">
                            <h5>Your Recording:</h5>
                            <audio src={recordingUrl} controls />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
