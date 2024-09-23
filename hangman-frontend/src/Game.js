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
    const [gameStarted, setGameStarted] = useState(false);

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
            setGameStarted(true);
            const response = await axios.post('http://localhost:3000/start');
            const { maskedWord, remainingAttempts, message, guessedLetters } = response.data;

            setMaskedWord(maskedWord);
            setRemainingAttempts(remainingAttempts);
            setMessage(t(message) || '');
            setGuessedLetters(guessedLetters || []);
            setLetter('');
            setWordGuess('');
        } catch (error) {
            console.error('error_start', error);
        }
    };

    const guessLetter = async () => {
        if (letter.length !== 1) {
            setMessage(t("single_letter"));
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

            if (message === 'won' || message === 'game_over') {
                setGameStarted(false);  // Disable input fields
            }
    
        } catch (error) {
            setMessage(t(error.response.data.error) || 'Error making a guess.');
        }
    };

    const guessWord = async () => {
        try {
            const response = await axios.post('http://localhost:3000/guess-word', { word: wordGuess });
            setMaskedWord(response.data.maskedWord);
            setRemainingAttempts(response.data.remainingAttempts);
            setMessage(t(response.data.message, { currentWord: response.data.currentWord })); 
            console.log(response.data.message)
            setWordGuess('');
            if (response.data.message === 'won' || response.data.message === 'game_over' || response.data.message === 'game_over_word') {
                setGameStarted(false);  // Disable input fields
            }
        } catch (error) {
            setMessage(t(error.response.data.error) || 'Error guessing the word.');
        }
    };

    const handleTranscription = (transcription) => {
        // Remove unwanted phrases like "letter" or extraneous words
        const cleanedTranscription = transcription.toLowerCase().replace(/letter\s+/g, '').trim();
    
        // If it's a single character, treat it as a letter guess
        if (cleanedTranscription.length === 1) {
            setLetter(cleanedTranscription);
            guessLetter();
        } 
        // If it's more than one character, treat it as a word guess
        else if (cleanedTranscription.length > 1) {
            setWordGuess(cleanedTranscription);
            guessWord();
        } 
        // If no valid transcription was received
        else {
            console.error("Invalid transcription:", transcription);
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
                gameStarted={gameStarted}
            />
           
        </div>
    );
};

export default Game;
