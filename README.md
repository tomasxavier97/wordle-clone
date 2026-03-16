# Wordle Clone

A full-stack Wordle clone implemented with:

- **Backend:** FastAPI (Python)
- **Frontend:** React + TypeScript + Vite
- **Database:** SQLite

This project implements two versions of the game:

- **v1 – Single Player Mode**
- **v2 – Two Player Mode (API Spec Update)**

---

# Project Structure

wordle-clone
│
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── game_logic.py
│   │   ├── word_repository.py
│   │   └── database.py
│   │
│   ├── words.txt
│   └── wordle.db
│
├── frontend
│   ├── src
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│
└── README.md

---

# Version 1 – Single Player Mode

Original implementation where:

- the server automatically selects a secret word
- the player tries to guess it

Game flow:


POST /game
POST /game/{session_id}/guess
GET  /game/{session_id}

---

# Version 2 – Two Player Mode

Updated implementation based on the new API specification.

Now the game has **two players**:

- **Player A** chooses the secret word
- **Player B** tries to guess it

Game flow:

	1.	POST /game
	2.	POST /game/{session_id}/set-word
	3.	POST /game/{session_id}/guess
	4.	GET  /game/{session_id}

    Game states:

    setup
    active
    on
    lost


    ---

# API Endpoints

## Create Game

Creates a new game session.

POST /game

Response

```json
{
  "session_id": "uuid",
  "max_guesses": 6,
  "word_length": 5
}

Set Secret Word

Player A sets the word to be guessed.

POST /game/{session_id}/set-word

Request

{
  "word": "praia"
}

Response

{
  "session_id": "uuid",
  "status": "ready"
}

Submit Guess

Player B submits a guess.

POST /game/{session_id}/guess

Request

{
  "word": "crane"
}

Response

{
  "guess": "crane",
  "result": [
    {"letter": "c", "status": "absent"},
    {"letter": "r", "status": "present"},
    {"letter": "a", "status": "correct"},
    {"letter": "n", "status": "absent"},
    {"letter": "e", "status": "absent"}
  ],
  "guesses_used": 1,
  "guesses_remaining": 5,
  "game_over": false,
  "won": false
}


Get Game State

Returns the current state of the game.

GET /game/{session_id}

Running the Project

Backend

Navigate to the backend folder:

cd backend

Create a virtual environment:

python3 -m venv venv

Activate the environment:

source venv/bin/activate

Install dependencies:

pip install fastapi uvicorn sqlalchemy

Run the API server:

uvicorn app.main:app --reload

Swagger documentation will be available at:

http://127.0.0.1:8000/docs


Frontend

Navigate to the frontend folder:

cd frontend

Install dependencies:
npm install

Run the development server:
npm run dev


The app will run at:
http://localhost:5173

How to Play (Two Player Mode)
	1.	Click New Game
	2.	Player A enters the secret word
	3.	Player B starts guessing
	4.	The game ends when:
	•	the word is guessed
	•	the maximum guesses are reached

Technologies Used

Backend:
	•	FastAPI
	•	SQLAlchemy
	•	SQLite

Frontend:
	•	React
	•	TypeScript
	•	Vite
	•	Axios

⸻

Features
	•	Word validation using dictionary
	•	Guess evaluation (correct / present / absent)
	•	Session-based gameplay
	•	Two-player mode
	•	RESTful API
	•	Swagger documentation

⸻

Author

Tomás Xavier