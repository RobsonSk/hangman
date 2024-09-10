// GameCanvas.js
import React from 'react';
import { TextStyle } from 'pixi.js';
import { Container, Text } from '@pixi/react';

const GameCanvas = ({ maskedWord, remainingAttempts, message }) => {
    const textStyle = new TextStyle({
        align: 'center',
        fill: '#ffffff',
        fontSize: 50,
        letterSpacing: 20,
        dropShadow: true,
        dropShadowColor: '#E72264',
        dropShadowDistance: 6,
    });

    const smallTextStyle = new TextStyle({
        fill: '#ffffff',
        fontSize: 20,
    });

    return (
        <Container>
            <Text
                text="Hangman Game"
                anchor={0.5}
                x={400} // Center horizontally
                y={100} // Position vertically
                // filters={[new BlurFilter()]}
                style={textStyle}
            />
            <Text
                text={maskedWord}
                x={400}
                y={200}
                anchor={0.5}
                style={textStyle}
            />
            <Text
                text={`Remaining Attempts: ${remainingAttempts}`}
                x={400}
                y={300}
                anchor={0.5}
                style={smallTextStyle}
            />
            <Text
                text={message || ''}
                x={400}
                y={350}
                anchor={0.5}
                style={smallTextStyle}
            />
        </Container>
    );
};

export default GameCanvas;
