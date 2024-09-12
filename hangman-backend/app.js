const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const { Model, KaldiRecognizer } = require('vosk');
const fs = require('fs');
const wav = require('wav');
const stream = require('stream');
const vosk = require('vosk');


app.use(cors()); 
app.use(express.json());

const upload = multer();
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
        guessedLetters
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
    console.log(guessedLetters)

    if (currentWord.includes(letter)) {
        const maskedWord = getMaskedWord();
        if (maskedWord === currentWord) {
            return res.json({ message: 'You won!', maskedWord, remainingAttempts, guessedLetters });
        }
        return res.json({ guessedLetters, maskedWord, remainingAttempts });

    } else {
        remainingAttempts -= 1;
        if (remainingAttempts === 0) {
            maskedWord = currentWord; // Reveal the whole word if no attempts left
            return res.json({ message: 'Game over', maskedWord, remainingAttempts, guessedLetters });
        }
        return res.json({ maskedWord: getMaskedWord(), remainingAttempts, guessedLetters });
    }
});

app.post('/guess-word', (req, res) => {
    const { word } = req.body;
    if (word === currentWord) {
        maskedWord = currentWord; // Reveal the whole word
        res.json({ maskedWord, remainingAttempts, message: 'Congratulations! You guessed the word!' });
    } else {
        remainingAttempts--;
        if (remainingAttempts == 0) {
            maskedWord = currentWord; // Reveal the whole word if no attempts left
            res.json({ maskedWord, remainingAttempts, message: 'Game over! The word was ' + currentWord });
        } else {
            remainingAttempts = 0;
            maskedWord = currentWord; // Reveal the whole word if no attempts left
            res.json({ maskedWord, remainingAttempts, message: 'Game over! The word was ' + currentWord });

        }
    }
});

app.post('/speech-to-text', upload.single('audio'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No audio file uploaded.');
    }
  
    const audioBuffer = req.file.buffer;
  
    // Convert audio to WAV using ffmpeg
    const bufferStream = new stream.PassThrough();
    bufferStream.end(audioBuffer);
  
    const outputFilePath = `uploads/${Date.now()}_converted.wav`;
  
    ffmpeg(bufferStream)
      .toFormat('wav')
      .save(outputFilePath)
      .on('end', () => {
        const reader = new wav.Reader();
  
        reader.on('format', (format) => {
          const rec = new vosk.Recognizer({ model: model, sampleRate: format.sampleRate });
          
          reader.on('data', (chunk) => {
            rec.acceptWaveform(chunk);
          });
  
          reader.on('end', () => {
            const result = rec.finalResult();
            rec.free();
            fs.unlinkSync(outputFilePath); // Clean up the temporary WAV file
            res.json({ transcription: result.text });
            console.log(`Transcription: ${result.text}`);
          });
        });
  
        const fileStream = fs.createReadStream(outputFilePath);
        fileStream.pipe(reader);
      })
      .on('error', (err) => {
        console.error('Error processing audio with ffmpeg:', err);
        res.status(500).send('Error processing audio');
      });
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


