import React, { useState, useEffect } from 'react';
import './GemQuiz.css';

export default function GemQuizActivity({ data }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(data.timer);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Derive current question securely
    const currentQuestion = data.questions ? data.questions[currentQuestionIndex] : null;

    // Handle countdown timer
    useEffect(() => {
        if (isFinished || !currentQuestion) return;

        if (timeLeft <= 0) {
            handleNextQuestion(); // ran out of time
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, isFinished, currentQuestionIndex]);

    // Handle taking an answer
    const handleAnswerSelect = (option) => {
        const isCorrect = option === currentQuestion.correct_answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        handleNextQuestion();
    };

    const handleNextQuestion = () => {
        // You could flash a small green/red indicator here based on lastWasCorrect
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < data.questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setTimeLeft(data.timer); // Reset the timer for the next question
        } else {
            setIsFinished(true);
        }
    };

    if (!data || !data.questions) return <div>No quiz data available</div>;

    if (isFinished) {
        return (
            <div className="gem-quiz-activity finished">
                <h2>Quiz Complete!</h2>
                <div className="score-board">
                    You got <span className="score">{score}</span> out of {data.questions.length} correct.
                </div>
                <button
                    className="primary-button"
                    onClick={() => {
                        setCurrentQuestionIndex(0);
                        setScore(0);
                        setTimeLeft(data.timer);
                        setIsFinished(false);
                    }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="gem-quiz-activity">
            <h2>Gem Quiz: Fast Pace!</h2>
            <p className="instruction">{data.instruction}</p>

            {/* Progress & Timer Banner */}
            <div className="quiz-header">
                <div className="progress">
                    Question {currentQuestionIndex + 1} of {data.questions.length}
                </div>
                <div className={`timer ${timeLeft <= 3 ? 'danger' : ''}`}>
                    ⏰ {timeLeft}s
                </div>
            </div>

            {/* Question Card */}
            <div className="question-card">
                <h3>{currentQuestion.text.replace('_____', '______')}</h3>
            </div>

            {/* Options Grid */}
            <div className="options-grid">
                {currentQuestion.options.map((option, idx) => (
                    <button
                        key={idx}
                        className="option-button"
                        onClick={() => handleAnswerSelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
