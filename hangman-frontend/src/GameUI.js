// GameUI.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './output.css';

const GameUI = ({ letter, wordGuess, setLetter, setWordGuess, guessLetter, guessWord, startNewGame, gameStarted }) => {
    const { t, i18n } = useTranslation()
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // Function to change language
    };

    return (
        <div className='game-ui'>
            <div class="flex gap-2 flex-wrap justify-center p-4 md:p-12 max-w-3xl">
                <input class="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900 text-white"
                    type="text"
                    value={letter}
                    onChange={(e) => setLetter(e.target.value.toLowerCase())}
                    placeholder={t("guess_letter")}
                    disabled={!gameStarted}
                />
                <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={guessLetter} disabled={!gameStarted}>{t("guess_letter")}</button>
            </div>

            <div class="flex gap-2 flex-wrap justify-center p-4 md:p-12 max-w-3xl">
                <input class="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900 text-white"
                    type="text"
                    value={wordGuess}
                    onChange={(e) => setWordGuess(e.target.value.toLowerCase())}
                    placeholder={t("guess_word")}
                    disabled={!gameStarted}
                />
                <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={guessWord} disabled={!gameStarted}>{t("guess_word")}</button>
            </div>
            <div class="flex gap-2 flex-wrap justify-center p-4 md:p-12 max-w-3xl">
                <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={startNewGame}>{t("new_game")}</button>
                <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => changeLanguage('en')}>{t("english")}</button>
                <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => changeLanguage('es')}>{t("spanish")}</button>
                <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => changeLanguage('br')}>{t("pt-br")}</button>
            </div>
        </div>
    );
};

export default GameUI;
