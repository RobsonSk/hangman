import { React, useState } from "react";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import GameUI from './GameUI';
import AudioRecorder from './AudioRecorder';

const MenuToggle = ({
    letter,
    wordGuess,
    setLetter,
    setWordGuess,
    guessLetter,
    guessWord,
    startNewGame,
    handleTranscription
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                //className="absolute top-4 right-4 z-50 p-2 bg-blue-500 rounded-lg"
                type="button" class="absolute top-4 right-4 z-50 p-2 bg-blue-500 rounded-lg text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
                
                {isMenuOpen ? <RxDoubleArrowRight/> : <RxDoubleArrowLeft />}
            </button>
            <div
                className={`fixed top-0 right-0 h-full w-1/3 bg-gray-800 p-4 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 ease-in-out`}
            >
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
        </>
    );
};

export default MenuToggle;
