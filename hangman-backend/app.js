const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 

app.use(express.json());

// const words = ["javascript", "hangman", "express", "nodejs", "react"];
const words = ['teste']
let currentWord = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];
let remainingAttempts = 6;

function getMaskedWord() {
    return currentWord
        .split('')
        .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
        .join('');
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post('/start', (req, res) => {
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    remainingAttempts = 6;
    res.json({
        message: 'New game started',
        maskedWord: getMaskedWord(),
        remainingAttempts,
    });
});

app.post('/guess', (req, res) => {
    const { letter } = req.body;

    if (!letter || letter.length !== 1) {
        return res.status(400).json({ error: 'Please provide a single letter.' });
    }

    if (guessedLetters.includes(letter)) {
        return res.status(400).json({ error: 'Letter already guessed.' });
    }

    guessedLetters.push(letter);

    if (currentWord.includes(letter)) {
        const maskedWord = getMaskedWord();
        if (maskedWord === currentWord) {
            return res.json({ message: 'You won!', maskedWord, remainingAttempts });
        }
        return res.json({ maskedWord, remainingAttempts });
    } else {
        remainingAttempts -= 1;
        if (remainingAttempts === 0) {
            maskedWord = currentWord; // Reveal the whole word if no attempts left
            return res.json({ message: 'Game over', maskedWord, remainingAttempts });
        }
        return res.json({ maskedWord: getMaskedWord(), remainingAttempts });
    }
});

app.post('/guess-word', (req, res) => {
    const { word } = req.body;
    if (word === currentWord) {
        maskedWord = currentWord; // Reveal the whole word
        res.json({ maskedWord, remainingAttempts, message: 'Congratulations! You guessed the word!' });
    } else {
        remainingAttempts--;
        if (remainingAttempts <= 0) {
            maskedWord = currentWord; // Reveal the whole word if no attempts left
            res.json({ maskedWord, remainingAttempts, message: 'Game over! The word was ' + currentWord });
        } else {
            res.json({ maskedWord, remainingAttempts, message: 'Incorrect guess!' });
        }
    }
});

// API to get the current game state
app.get('/state', (req, res) => {
    res.json({
        maskedWord: getMaskedWord(),
        remainingAttempts,
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


