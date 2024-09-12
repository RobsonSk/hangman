# Hangman
A Hangman game built with React on the frontend and Node.js on the backend, featuring Pixi.js for graphics rendering and Vosk for speech recognition.

## Frontend

The frontend was created using create-react-app and uses the following technologies:

* Pixi.js: For rendering and managing game graphics.
* React Hooks: To handle game state such as word guessing, remaining attempts, and guessed letters.
* Axios: For communication between the frontend and backend.

## Backend

The backend is a Node.js server using Express.js. It handles:

* Game logic: Including word selection, guess validation, and state tracking.
* Speech Recognition: Using the Vosk library to process spoken guesses.

## Prerequisites
Make sure you have the following installed:

* Node.js: Ensure you have at least Node.js 12.x or higher.
* npm: Comes with Node.js.

## Installation
1. Clone the repository:

```bash
git clone https://github.com/yourusername/hangman.git
cd hangman
```

2. Install dependencies for both frontend and backend:

```bash
cd hangman-backend
npm install
cd ../hangman-frontend
npm install
```
## Vosk Setup
To enable speech recognition, you need to download the Vosk language model and set it up for the backend:

1. Download the Vosk English language model or another language model of your choice.

```bash
wget https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
```
2. Extract the model:

```bash
unzip vosk-model-small-en-us-0.15.zip
```

3. Move the extracted model to the hangman-backend folder. The final directory structure should look like this:

```go
hangman-backend/
├── model
│   ├── README
│   ├── am
│   ├── conf
│   └── ...
├── node_modules
├── package.json
└── ...
```

4. Set up the `.env` file:
   - In the `hangman-backend` folder, create a `.env` file (if it doesn't exist).
   - Add the path to the downloaded model in the `.env` file like so:
```bash
MODEL_PATH=/path/to/vosk/model
```

Ensure the MODEL_PATH points to the correct location of the extracted Vosk model in the backend folder.


## Running the Project
To start both the frontend and backend simultaneously, navigate to the root folder and use the following command:

```bash
npm start
```

This command uses the concurrently package to run both servers at the same time.

## Accessing the Game

* Frontend: Open a web browser and navigate to http://localhost:3001 to play the game.
* Backend: The backend server will be running on http://localhost:3000 to handle game logic and API requests.

### Changing the Port (Optional)
You'll need to create a .env file in the hangman-frontend directory as follows:

```bash
PORT=3001
```

# Technologies Used
* Frontend:
    * React
    * Pixi.js
    * Axios

* Backend:
    * Node.js
    * Express.js
    * Vosk (for speech recognition)

# Future Enhancements
Improve game animations.
Add support for more spoken languages.

# License
This project is licensed under the MIT License.
