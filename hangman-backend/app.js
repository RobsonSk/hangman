const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const { Model, KaldiRecognizer } = require('vosk');
const fs = require('fs');
const wav = require('wav');
const stream = require('stream');
const vosk = require('vosk');


app.use(cors()); 
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
}));
app.use(express.json());

const model = new vosk.Model("/home/robson.santos@DTACENTER.MR/hangman/hangman-backend/vosk-model-small-pt-0.3");

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

app.post('/speech-to-text', (req, res) => {
    if (!req.files || !req.files.audio) {
        return res.status(400).send('No audio file uploaded.');
    }

    const audioBuffer = req.files.audio.data;

    if (audioBuffer.length === 0) {
        return res.status(400).send('Received empty audio buffer.');
    }

    const reader = new wav.Reader();

    reader.on('format', (format) => {
        const rec = new vosk.Recognizer({ model: model, sampleRate: format.sampleRate });
        reader.on('data', (chunk) => {
            rec.acceptWaveform(chunk);
        });

        reader.on('end', () => {
            const result = rec.finalResult();
            rec.free();  // Free up memory
            res.json({ transcription: result.text });
            console.log(result);
        });
    });

    const bufferStream = new stream.PassThrough(); // Use PassThrough to create a readable stream from buffer
    bufferStream.end(audioBuffer); // End the stream with the audio buffer
    bufferStream.pipe(reader);
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


