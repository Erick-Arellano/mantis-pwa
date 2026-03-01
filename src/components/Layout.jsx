import React from 'react';

export default function Layout({ children, currentLessonTitle, onBackHome }) {
    return (
        <div className="layout">
            <header className="app-header">
                {onBackHome ? (
                    <button onClick={onBackHome} className="back-btn" title="Back to Index">
                        {'◀'}
                    </button>
                ) : null}
                <h1>Strategies PWA</h1>
                {currentLessonTitle && <div className="lesson-badge">{currentLessonTitle}</div>}
            </header>
            <main className="app-content">
                {children}
            </main>
            <footer className="app-footer">
                <nav>
                    <button>Menu</button>
                    <button>Glossary</button>
                    <button>Profile</button>
                </nav>
            </footer>
        </div>
    );
}
