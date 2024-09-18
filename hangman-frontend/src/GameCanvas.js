// GameCanvas.js
import React, { useEffect, useState } from 'react';
import { TextStyle } from 'pixi.js';
import { Container, Sprite, Text } from '@pixi/react';
import { useTranslation } from 'react-i18next';

import "/node_modules/flag-icons/css/flag-icons.min.css";

const GameCanvas = ({ maskedWord, remainingAttempts, message, guessedLetters }) => {
    const { t, i18n } = useTranslation(); // useTranslation hook for translations


    const textStyle = new TextStyle({
        align: 'center',
        fill: '#ffffff',
        fontSize: 50,
        letterSpacing: 20,
    });

    const smallTextStyle = new TextStyle({
        fill: '#ffffff',
        fontSize: 20,
    });

    const imagesBody = {
        0: './assets/body-full.png',
        1: './assets/body-5.png',
        2: './assets/body-4.png',
        3: './assets/body-3.png',
        4: './assets/body-2.png',
        5: './assets/body-1.png',
        6: './assets/body-empty.png',
    }

    const imageBody = imagesBody[remainingAttempts] || './assets/body-empty.png';

    const usFlag = './locales/en/flag.png';
    const esFlag = './locales/es/flag.png';
    const brFlag = './locales/br/flag.png';

    const languages = ['en', 'es', 'br'];

    const flags = [usFlag, esFlag, brFlag];

    const getCurrentLanguageIndex = () => {
        const currentLanguage = i18n.language || 'en'; // Default to 'en' if no language is set
        return languages.indexOf(currentLanguage);
    };

    const [currentLanguageIndex, setCurrentLanguageIndex] = useState(getCurrentLanguageIndex());

    useEffect(() => {
        setCurrentLanguageIndex(getCurrentLanguageIndex());
    }, [i18n.language]);

    const changeLanguage = () => {
        const nextLanguageIndex = (currentLanguageIndex + 1) % languages.length;
        const nextLanguage = languages[nextLanguageIndex];
        i18n.changeLanguage(nextLanguage); // Function to change language
        setCurrentLanguageIndex(nextLanguageIndex);
      };

    return (
        <Container>
            <Sprite image={imageBody}
                x={100} // Center horizontally
                y={100}
                anchor={0} />
            <Text
                text={t("game_title")}
                x={window.innerWidth / 2.8} // Center horizontally
                y={100} // Position vertically
                style={textStyle}
            />
            <Text
                text={maskedWord}
                x={window.innerWidth / 2}
                y={200}
                style={textStyle}
            />
            <Text
                text={t('remaining_attempts', { count: remainingAttempts })}
                x={window.innerWidth / 2}
                y={300}
                style={smallTextStyle}
            />
            <Text
                text={t(message) || ''}
                x={window.innerWidth / 2}
                y={350}
                style={smallTextStyle}
            />
            <Text
                text={t('guessed_letters', { letters: guessedLetters && Array.isArray(guessedLetters) ? guessedLetters.join(', ') : '' })}
                x={window.innerWidth / 2}
                y={400}
                style={smallTextStyle} />
            <Sprite image={flags[(currentLanguageIndex) % flags.length]} 
                x={window.innerWidth / 2}
                y={window.innerHeight - 100}
                interactive={true}
                anchor={0}
                pointerdown={() => {
                    changeLanguage()}} />
        </Container>
    );
};

export default GameCanvas;
