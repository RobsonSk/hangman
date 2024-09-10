// GameUI.js
import React from 'react';

const GameUI = ({ letter, wordGuess, setLetter, setWordGuess, guessLetter, guessWord, startNewGame }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '400px' }}>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    placeholder="Guess a letter"
                />
                <button onClick={guessLetter}>Guess Letter</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={wordGuess}
                    onChange={(e) => setWordGuess(e.target.value)}
                    placeholder="Guess the word"
                />
                <button onClick={guessWord}>Guess Word</button>
            </div>

            <button onClick={startNewGame}>Start New Game</button>
        </div>
    );
};

export default GameUI;
