import React, { useState, useEffect } from 'react';
import { Diamond, CheckCircle, XCircle } from 'lucide-react';
import './GemQuizEngine.css';

export default function GemQuizEngine({ data, title }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [gems, setGems] = useState(data?.content?.lives || data?.lives || 3);
    const [timeLeft, setTimeLeft] = useState(data?.content?.timer || data?.timer || 10);
    const [quizState, setQuizState] = useState('playing'); // 'playing', 'success', 'game_over'
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
    const [score, setScore] = useState(0);

    if (!data || !data.questions) return <div className="placeholder-box">No grammar data found.</div>;

    const { instruction, questions, timer: initialTimer, lives: initialLives } = data;
    const currentQuestion = questions[currentQuestionIndex];

    // Timer logic
    useEffect(() => {
        if (quizState !== 'playing' || feedback !== null) return;

        if (timeLeft <= 0) {
            handleTimeOut();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, quizState, feedback]);

    const handleTimeOut = () => {
        setFeedback('incorrect');
        loseGemAndAdvance();
    };

    const handleAnswerSelect = (option) => {
        if (feedback !== null || quizState !== 'playing') return; // Prevent double clicks

        setSelectedAnswer(option);

        if (option === currentQuestion.correct_answer) {
            setFeedback('correct');
            setScore(prev => prev + 1);
            setTimeout(advanceNextQuestion, 1500);
        } else {
            setFeedback('incorrect');
            loseGemAndAdvance();
        }
    };

    const loseGemAndAdvance = () => {
        const newGems = gems - 1;
        setGems(newGems);

        setTimeout(() => {
            if (newGems <= 0) {
                setQuizState('game_over');
            } else {
                advanceNextQuestion();
            }
        }, 1500);
    };

    const advanceNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(initialTimer || 10);
            setFeedback(null);
            setSelectedAnswer(null);
        } else {
            // Reached the end with gems remaining
            setQuizState('success');
        }
    };

    const resetGame = () => {
        setCurrentQuestionIndex(0);
        setGems(initialLives || 3);
        setTimeLeft(initialTimer || 10);
        setQuizState('playing');
        setFeedback(null);
        setSelectedAnswer(null);
        setScore(0);
    };

    // Calculate width for timer bar based on percentage
    const timerPercentage = Math.max(0, (timeLeft / (initialTimer || 10)) * 100);
    let timerColor = 'var(--secondary-green-light)';
    if (timerPercentage < 50) timerColor = 'var(--secondary-yellow-light)';
    if (timerPercentage < 20) timerColor = 'var(--secondary-red-light)';

    const renderHUD = () => (
        <div className="quiz-hud">
            <div className="timer-container">
                <div className="timer-bar-bg">
                    <div
                        className="timer-bar-fill"
                        style={{ width: `${timerPercentage}%`, backgroundColor: timerColor }}
                    />
                </div>
                <span className="timer-text">{timeLeft}s</span>
            </div>
            <div className="gem-container">
                {[...Array(initialLives || 3)].map((_, i) => (
                    <Diamond
                        key={i}
                        size={32}
                        className={`gem-icon ${i < gems ? 'active' : 'lost'}`}
                        fill={i < gems ? 'var(--theme-unit)' : 'transparent'}
                        strokeWidth={2}
                    />
                ))}
            </div>
        </div>
    );

    if (quizState === 'game_over') {
        return (
            <div className="gem-quiz-container end-state">
                <div className="bento-box result-card">
                    <XCircle size={80} color="var(--secondary-red)" />
                    <h2>Out of Gems!</h2>
                    <p>You ran out of time or made too many mistakes. Let's try again.</p>
                    <button className="primary-btn retry" onClick={resetGame}>Try Again</button>
                </div>
            </div>
        );
    }

    if (quizState === 'success') {
        return (
            <div className="gem-quiz-container end-state">
                <div className="bento-box result-card">
                    <CheckCircle size={80} color="var(--secondary-green)" />
                    <h2>Great Job!</h2>
                    <p>You completed the grammar challenge.</p>
                    <h3 className="final-score">Score: {score} / {questions.length}</h3>
                    <div className="final-gems">
                        {[...Array(gems)].map((_, i) => (
                            <Diamond key={i} size={40} className="gem-icon active" fill="var(--theme-unit)" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Replace the blank _____ in the question text dynamically if needed, 
    // or just display it as is.
    const questionText = currentQuestion.text;

    return (
        <div className="gem-quiz-container">
            {renderHUD()}

            {title && <h2 className="activity-title text-center">{title}</h2>}
            <p className="instruction text-center">
                {currentQuestion.instruction || instruction}
            </p>

            <div className="question-card bento-box">
                <div className="question-text">
                    {questionText}
                </div>

                <div className="options-grid">
                    {currentQuestion.options.map((option, idx) => {
                        let btnClass = "option-btn";
                        if (selectedAnswer === option) {
                            if (feedback === 'correct') btnClass += ' correct';
                            if (feedback === 'incorrect') btnClass += ' incorrect';
                        } else if (feedback !== null && option === currentQuestion.correct_answer) {
                            // Show the correct answer if they got it wrong
                            btnClass += ' correct-reveal';
                        }

                        return (
                            <button
                                key={idx}
                                className={btnClass}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={feedback !== null}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
