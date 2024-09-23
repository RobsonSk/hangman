const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const Model = require('vosk');
const fs = require('fs');
const wav = require('wav');
const stream = require('stream');
const vosk = require('vosk');
const dotenv = require('dotenv');
dotenv.config();
ffmpeg.setFfmpegPath(ffmpegPath);


app.use(cors()); 
app.use(express.json());

const upload = multer();
const model = new vosk.Model(process.env.MODEL_PATH);

// const words =  [
//     "abacaxi", "abelha", "avião", "azul", "bala", "banco", "banana", "bola",
//     "boneca", "borboleta", "branco", "cachorro", "cadeira", "cama", "caneta",
//     "carro", "casa", "chapéu", "chave", "copo", "cor", "coruja", "coelho",
//     "computador", "dinossauro", "dente", "desenho", "dragão", "elefante",
//     "escola", "estrela", "fada", "foguete", "formiga", "fruta", "gato",
//     "girafa", "grande", "janela", "jardim", "joaninha", "lápis", "leão",
//     "livro", "lobo", "macaco", "mala", "mamãe", "mar", "melancia", "menino",
//     "menina", "mesa", "mestre", "navio", "ninho", "nuvem", "ovo", "pato",
//     "peixe", "pessoa", "pião", "pirata", "pipa", "pintura", "porta", "quadro",
//     "rato", "rei", "relógio", "roda", "rosa", "sapo", "sol", "sombrero",
//     "tartaruga", "tigre", "tio", "urso", "vaca", "vassoura", "vento", "vermelho",
//     "vovô", "vovó", "xadrez", "zebra", "zoológico", "zumbi", "arroz", "coração",
//     "fada", "caracol", "pirulito", "golfinho", "mochila", "mel", "fogão", "estrela",
//     "doce", "biscoito", "flauta", "galinha", "girassol"
//   ];
const words = ['dragão']
let currentWord = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];
let remainingAttempts = 6;

function getMaskedWord() {
    return currentWord
        .split('')
        .map(letter => {
            // Normalize both the letter and guessed letters for comparison
            const normalizedLetter = normalizeString(letter.toLowerCase());

            // Check if the normalized version of the letter is in guessedLetters
            return guessedLetters.includes(normalizedLetter) ? letter : '_';
        })
        .join('');
}

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post('/start', (req, res) => {
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    remainingAttempts = 6;
    res.json({
        message: 'new_game_started',
        maskedWord: getMaskedWord(),
        remainingAttempts, 
        guessedLetters
    });
});

app.post('/guess', (req, res) => {
    const { letter } = req.body;

    if (!letter || letter.length !== 1) {
        return res.status(400).json({ error: "single_letter" });
    }

    const normalizedLetter = normalizeString(letter.toLowerCase());

    // Check if letter has already been guessed
    if (guessedLetters.includes(normalizedLetter)) {
        return res.status(400).json({ error: "letter_already_guessed" });
    }

    guessedLetters.push(normalizedLetter);
    console.log(normalizedLetter)
    const normalizedWord = normalizeString(currentWord.toLowerCase());

    // Check if the normalized word contains the normalized guessed letter
    if (normalizedWord.includes(normalizedLetter)) {
        const maskedWord = getMaskedWord();
        if (maskedWord === currentWord) {
            return res.json({ message: "won", maskedWord, remainingAttempts, guessedLetters });
        }
        console.log(guessedLetters, maskedWord);
        return res.json({ guessedLetters, maskedWord, remainingAttempts });
    } else {
        remainingAttempts -= 1;
        if (remainingAttempts === 0) {
            maskedWord = currentWord; // Reveal the whole word if no attempts left
            return res.json({ message: "game_over", maskedWord, remainingAttempts, guessedLetters });
        }
        return res.json({ maskedWord: getMaskedWord(), remainingAttempts, guessedLetters });
    }
}); 

app.post('/guess-word', (req, res) => {
    const { word } = req.body;
    const normalizedWordGuess = normalizeString(word.toLowerCase());

    if (normalizedWordGuess === normalizeString(currentWord.toLowerCase())) {
        maskedWord = currentWord; // Reveal the whole word
        console.log(normalizedWordGuess, normalizeString(currentWord.toLowerCase()))
        res.json({ maskedWord, remainingAttempts, message: "congratulations", currentWord });
    } else {
        remainingAttempts == 0;
        if (remainingAttempts >= 0) {
            maskedWord = currentWord; // Reveal the whole word if no attempts left
            res.json({ maskedWord, remainingAttempts, message: "game_over_word", currentWord });
        } else {
            res.json({ maskedWord: getMaskedWord(), remainingAttempts, guessedLetters, currentWord });
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
  
    const outputFilePath = `uploads\\${Date.now()}_converted.wav`;
  
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
            //fs.unlinkSync(outputFilePath); // Clean up the temporary WAV file
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


