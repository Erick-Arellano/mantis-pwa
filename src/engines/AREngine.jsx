import React, { useEffect, useState } from 'react';
import './AREngine.css';

export default function AREngine({ data }) {
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'arReady') {
                console.log("AR is ready in iframe");
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const stopAR = () => {
        const iframe = document.getElementById('ar-scanner-frame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage('stopAR', '*');
        }
    };

    // Cleanup when component unmounts (user clicks Back to Index)
    useEffect(() => {
        return () => {
            stopAR();
        };
    }, []);

    return (
        <div className="ar-engine-container">
            {data && data.instruction && (
                <div className="ar-instruction-banner">
                    <p>{data.instruction}</p>
                </div>
            )}

            {!isStarted ? (
                <div className="ar-startup-screen">
                    <div className="ar-icon-large">📸</div>
                    <h3>Start AR Scanner</h3>
                    <p>Point your camera at the images in the book.</p>
                    <button className="primary-btn pulse-glow" onClick={() => setIsStarted(true)}>
                        Launch Camera
                    </button>
                </div>
            ) : (
                <div className="ar-active-view">
                    <iframe
                        id="ar-scanner-frame"
                        src="/ar-scanner.html"
                        className="ar-fullscreen-iframe"
                        allow="camera; autoplay; geolocation; xr-spatial-tracking"
                        title="AR Scanner"
                    />
                </div>
            )}
        </div>
    );
}
