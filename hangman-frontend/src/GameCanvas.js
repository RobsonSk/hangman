// GameCanvas.js
import React from 'react';
import { TextStyle } from 'pixi.js';
import { Container, Sprite, Text } from '@pixi/react';

const GameCanvas = ({ maskedWord, remainingAttempts, message, guessedLetters }) => {
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

    return (
        <Container>
            <Sprite image={imageBody}
                x={100} // Center horizontally
                y={100}
                anchor={0} />
            <Text
                text="The Hangman Game"
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
                text={`Remaining Attempts: ${remainingAttempts}`}
                x={window.innerWidth / 2}
                y={300}
                style={smallTextStyle}
            />
            <Text
                text={message || ''}
                x={window.innerWidth / 2}
                y={350}
                style={smallTextStyle}
            />
            <Text
                text={`Guessed Letters: ${(guessedLetters && Array.isArray(guessedLetters)) ? guessedLetters.join(', ') : ''}`}
                x={window.innerWidth / 2}
                y={400}
                style={smallTextStyle} />
        </Container>
    );
};

export default GameCanvas;
