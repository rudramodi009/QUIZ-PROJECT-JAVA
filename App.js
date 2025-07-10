import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');

  
  const getRandomQuestions = (questionsArray, count = 10) => {
    const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
// Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/question/allQuestion');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        
        
        const randomQuestions = getRandomQuestions(data, 10);
        setQuestions(randomQuestions);
        setError(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  
  useEffect(() => {
    if (showAnswer || loading || gameOver) return;

    if (timer === 0) {
      handleSubmit(true); // Auto submit
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showAnswer, loading, gameOver]);

  useEffect(() => {
    setTimer(30); 
  }, [currentQuestionIndex]);


  const getOptionLetter = (optionIndex) => {
    return String.fromCharCode(65 + optionIndex); // A, B, C, D
  };

  const handleOptionChange = (optionLetter) => {
    setSelectedOption(optionLetter);
  };

  const handleSubmit = (auto = false) => {
    setShowAnswer(true);

  
    const isCorrect = selectedOption === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (!isCorrect) {
       
        setGameOver(true);
        setGameOverReason('wrong');
      } else if (currentQuestionIndex + 1 >= questions.length) {
      
        setGameOver(true);
        setGameOverReason('completed');
      } else {
        
        setShowAnswer(false);
        setSelectedOption('');
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 3000); 
  };

  const restartQuiz = async () => {
    setLoading(true);
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setShowAnswer(false);
    setTimer(30);
    setScore(0);
    setGameOver(false);
    setGameOverReason('');
    
   
    try {
      const response = await fetch('http://localhost:8080/question/allQuestion');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      const randomQuestions = getRandomQuestions(data, 10);
      setQuestions(randomQuestions);
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="kbc-background">
        <div className="kbc-container">
          <div className="kbc-loading">
            <div className="kbc-logo">
              <h1 className="kbc-title">QUIZ</h1>
              <p className="kbc-subtitle">Kaun Banega Crorepati</p>
            </div>
            <div className="kbc-spinner"></div>
            <p className="kbc-loading-text">Loading Questions...</p>
          </div>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="kbc-background">
        <div className="kbc-container">
          <div className="kbc-error">
            <h2 className="kbc-error-title">Technical Difficulty!</h2>
            <p className="kbc-error-message">{error}</p>
            <button 
              className="kbc-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  
  if (questions.length === 0) {
    return (
      <div className="kbc-background">
        <div className="kbc-container">
          <div className="kbc-error">
            <h2 className="kbc-error-title">No Questions Available</h2>
            <p className="kbc-error-message">No questions were found. Please check your API.</p>
          </div>
        </div>
      </div>
    );
  }

  
  if (gameOver) {
    return (
      <div className="kbc-background">
        <div className="kbc-container">
          <div className="kbc-game-over">
            <div className="kbc-logo mb-4">
              <h1 className="kbc-title">KBC QUIZ</h1>
            </div>
            {gameOverReason === 'completed' ? (
              <>
                <div className="kbc-trophy">🏆</div>
                <h2 className="kbc-congratulations">Congratulations!</h2>
                <p className="kbc-completion-message">You've completed the quiz successfully!</p>
              
              </>
            ) : (
              <>
                <div className="kbc-wrong-answer">❌</div>
                <h2 className="kbc-game-over-title">Game Over!</h2>
                <p className="kbc-game-over-message">Don't worry, you played well!</p>
               
              </>
            )}
            <div className="kbc-final-score">
              Questions Answered: {score}/{gameOverReason === 'completed' ? questions.length : currentQuestionIndex + 1}
            </div>
            <button 
              className="kbc-button mt-4"
              onClick={restartQuiz}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kbc-background">
      <div className="kbc-container">
        
        <div className="kbc-header">
          <div className="kbc-logo">
            <h1 className="kbc-title">KBC QUIZ</h1>
          </div>
          <div className="kbc-stats">
            <div className="kbc-timer">
              <span className="kbc-timer-label">Time:</span>
              <span className={`kbc-timer-value ${timer <= 10 ? 'kbc-timer-danger' : ''}`}>
                {timer}
              </span>
            </div>
            
          </div>
        </div>

        {/* Question Section */}
        <div className="kbc-question-section">
          <div className="kbc-question-header">
            <h3 className="kbc-question-number">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h3>
            <div className="kbc-progress-bar">
              <div 
                className="kbc-progress-fill"
                style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
              ></div>
            </div>
          </div>

          <div className="kbc-question-text">
            {currentQuestion.title}
          </div>
        </div>

        {/* Options Table */}
        <div className="kbc-options-section">
          <div className="table-responsive">
            <table className="kbc-options-table">
              <thead>
                <tr>
                  <th width="10%">Select</th>
                  <th width="10%">Option</th>
                  <th width="80%">Answer</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((i) => {
                  const option = currentQuestion[`option${i}`];
                  if (!option) return null;
                  
                  const optionLetter = getOptionLetter(i - 1);
                  const isSelected = selectedOption === optionLetter;
                  const isCorrect = showAnswer && optionLetter === currentQuestion.answer;
                  const isWrong = showAnswer && isSelected && optionLetter !== currentQuestion.answer;
                  
                  return (
                    <tr 
                      key={i}
                      className={`kbc-option-row ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                      onClick={() => !showAnswer && handleOptionChange(optionLetter)}
                    >
                      <td className="kbc-radio-cell">
                        <input
                          className="kbc-radio"
                          type="radio"
                          name="option"
                          value={optionLetter}
                          checked={selectedOption === optionLetter}
                          onChange={() => handleOptionChange(optionLetter)}
                          disabled={showAnswer}
                        />
                      </td>
                      <td className="kbc-option-letter">
                        <span className="kbc-option-badge">{optionLetter}</span>
                      </td>
                      <td className="kbc-option-text">
                        {option}
                        {isCorrect && <span className="kbc-correct-icon">✓</span>}
                        {isWrong && <span className="kbc-wrong-icon">✗</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div className="kbc-submit-section">
          <button
            className="kbc-button kbc-submit-button"
            onClick={() => handleSubmit(false)}
            disabled={!selectedOption || showAnswer}
          >
            Final Answer
          </button>
        </div>

        {/* Answer Display */}
        {showAnswer && (
          <div className={`kbc-answer-display ${selectedOption === currentQuestion.answer ? 'correct' : 'wrong'}`}>
            <div className="kbc-answer-content">
              <div className="kbc-answer-icon">
                {selectedOption === currentQuestion.answer ? '🎉' : '😞'}
              </div>
              <div className="kbc-answer-text">
                <h4>{selectedOption === currentQuestion.answer ? 'Correct Answer!' : 'Wrong Answer!'}</h4>
                <p>The correct answer is: <strong>Option {currentQuestion.answer}</strong></p>
                {selectedOption !== currentQuestion.answer && (
                  <p className="kbc-game-end-warning">Game will end after this question</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Prize Money Ladder */}
       
      </div>

      
    </div>
  );
}
export default App;