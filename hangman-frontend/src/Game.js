import React, { useState, useEffect } from 'react';
import { Stage } from '@pixi/react';
import axios from 'axios';
import GameUI from './GameUI';
import GameCanvas from './GameCanvas';
import AudioRecorder from './AudioRecorder';

const Game = () => {
    const [maskedWord, setMaskedWord] = useState('');
    const [remainingAttempts, setRemainingAttempts] = useState(6);
    const [letter, setLetter] = useState('');
    const [wordGuess, setWordGuess] = useState('');
    const [message, setMessage] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    
    // Start a new game when the component loads
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = async () => {
        try {
            const response = await axios.post('http://localhost:3000/start');
            const { maskedWord, remainingAttempts, message, guessedLetters } = response.data;

            // Update state with response data
            setMaskedWord(maskedWord);
            setRemainingAttempts(remainingAttempts);
            setMessage(message || '');
            setGuessedLetters(guessedLetters || []);
            setLetter('');
            setWordGuess('');
        } catch (error) {
            console.error('Error starting a new game:', error);
        }
    };

    const guessLetter = async () => {
        if (letter.length !== 1) {
            setMessage('Please enter a single letter.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/guess', { letter });
            const { maskedWord, remainingAttempts, message, guessedLetters = [] } = response.data;

            // Update state with response data
            setMaskedWord(maskedWord);
            setRemainingAttempts(remainingAttempts);
            setMessage(message || '');
            setGuessedLetters([...guessedLetters]);
            setLetter('');
            console.log("Guessed letters in GameCanvas:", guessedLetters);
        } catch (error) {
            setMessage(error.response.data.error || 'Error making a guess.');
        }
    };

    const guessWord = async () => {
        try {
            const response = await axios.post('http://localhost:3000/guess-word', { word: wordGuess });
            setMaskedWord(response.data.maskedWord);
            setRemainingAttempts(response.data.remainingAttempts);
            setMessage(response.data.message);
            setWordGuess('');
        } catch (error) {
            setMessage(error.response.data.error || 'Error guessing the word.');
        }
    };

    const handleTranscription = (transcription) => {
        // Check if transcription is a single letter or full word
        if (transcription.length === 1) {
            setLetter(transcription);
            guessLetter();
        } else {
            setWordGuess(transcription);
            guessWord();
        }
    };

    const width = window.innerWidth;
    const height = window.innerHeight;
    const stageProps = {
        height,
        width,
        options: {
            antialias: true,
        },
    };

    return (
        <div>
            <Stage {...stageProps}>
                <GameCanvas
                    maskedWord={maskedWord}
                    remainingAttempts={remainingAttempts}
                    message={message}
                    guessedLetters={guessedLetters}
                />
            </Stage>
            <GameUI
                letter={letter}
                wordGuess={wordGuess}
                setLetter={setLetter}
                setWordGuess={setWordGuess}
                guessLetter={guessLetter}
                guessWord={guessWord}
                startNewGame={startNewGame}
            />
            <AudioRecorder onTranscription={handleTranscription} />
        </div>
    );
};

export default Game;
