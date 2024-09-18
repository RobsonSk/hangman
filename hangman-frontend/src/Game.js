import React, { useState, useEffect } from 'react';
import { Stage } from '@pixi/react';
import '@pixi/events';
import axios from 'axios';
import GameCanvas from './GameCanvas';
import MenuToggle from './MenuToggle';
import { useTranslation } from 'react-i18next';

const Game = () => {
    const [maskedWord, setMaskedWord] = useState('');
    const [remainingAttempts, setRemainingAttempts] = useState(6);
    const [letter, setLetter] = useState('');
    const [wordGuess, setWordGuess] = useState('');
    const [message, setMessage] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const { t, i18n } = useTranslation(); // useTranslation hook for translations

    useEffect(() => {
        setMessage('');

        // Listen for language changes and update the message translation
        const handleLanguageChange = () => {
            setMessage((prevMessage) => (prevMessage ? t(prevMessage) : ''));
        };

        i18n.on('languageChanged', handleLanguageChange);

        // Cleanup listener on component unmount
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, t]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setMessage('') // Function to change language
      };
      
    const startNewGame = async () => {
        try {
            const response = await axios.post('http://localhost:3000/start');
            const { maskedWord, remainingAttempts, message, guessedLetters } = response.data;

            setMaskedWord(maskedWord);
            setRemainingAttempts(remainingAttempts);
            setMessage(t(message) || '');
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

            setMaskedWord(maskedWord);
            setRemainingAttempts(remainingAttempts);
            setMessage(message || '');
            setGuessedLetters([...guessedLetters]);
            setLetter('');
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
            backgroundColor: 0x000000,
        },
    };

    return (
        <div className="game-container">

            <Stage {...stageProps}>
                <GameCanvas
                    maskedWord={maskedWord}
                    remainingAttempts={remainingAttempts}
                    message={message}
                    guessedLetters={guessedLetters}
                />
            </Stage>

            <MenuToggle
                letter={letter}
                wordGuess={wordGuess}
                setLetter={setLetter}
                setWordGuess={setWordGuess}
                guessLetter={guessLetter}
                guessWord={guessWord}
                startNewGame={startNewGame}
                handleTranscription={handleTranscription}
            />
           
        </div>
    );
};

export default Game;
