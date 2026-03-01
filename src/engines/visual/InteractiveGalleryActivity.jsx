import React, { useState } from 'react';
import './VisualExploration.css';

export default function InteractiveGalleryActivity({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!data || !data.gallery) return <div>No visual data available</div>;

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % data.gallery.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + data.gallery.length) % data.gallery.length);
    };

    return (
        <div className="visual-activity interactive-gallery">
            <h2 className="activity-title">{data.title}</h2>
            <p className="instruction">{data.instruction}</p>

            {/* 3D Carousel Container */}
            <div className="carousel-container">
                <button className="nav-btn prev-btn" onClick={handlePrev}>❮</button>

                <div className="carousel-track">
                    {data.gallery.map((item, idx) => {
                        let positionClass = '';
                        if (idx === activeIndex) {
                            positionClass = 'active';
                        } else if (idx === (activeIndex - 1 + data.gallery.length) % data.gallery.length) {
                            positionClass = 'prev';
                        } else if (idx === (activeIndex + 1) % data.gallery.length) {
                            positionClass = 'next';
                        } else {
                            positionClass = 'hidden';
                        }

                        return (
                            <div key={item.id} className={`gallery-card ${positionClass}`}>
                                <div className="card-image-wrapper">
                                    <img src={item.image_url} alt={item.title} />
                                </div>
                                <div className="card-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="nav-btn next-btn" onClick={handleNext}>❯</button>
            </div>

            {/* Questions Banner */}
            {data.questions && data.questions.length > 0 && (
                <div className="questions-banner">
                    <h4>Think about it:</h4>
                    <ul>
                        {data.questions.map((q, idx) => (
                            <li key={idx}>{q}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
