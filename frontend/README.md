:::writing{variant=“standard” id=“38164”}

Wordle Clone – Full Stack Technical Challenge

This project is a Wordle-style game clone built as part of a Full Stack technical challenge.

The application consists of:
	•	A FastAPI backend
	•	A SQLite database
	•	A React + TypeScript frontend
	•	A REST API that handles all game logic

The frontend communicates exclusively with the backend API.

⸻

Tech Stack

Backend
	•	Python
	•	FastAPI
	•	SQLAlchemy
	•	SQLite
	•	Uvicorn

Frontend
	•	React
	•	TypeScript
	•	Vite
	•	Axios

wordle-clone
│
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── game_logic.py
│   │   └── word_repository.py
│   └── words.txt
│
├── frontend
│   ├── src
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
│
└── README.md


Running the Project

1. Clone the repository

git clone <repository-url>
cd wordle-clone

Backend Setup

Navigate to the backend folder:

cd backend

Create and activate a virtual environment:

Mac/Linux:

python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install fastapi uvicorn sqlalchemy

Run the backend server:

uvicorn app.main:app --reload

Backend runs at:

http://127.0.0.1:8000


API documentation:

http://127.0.0.1:8000/docs


Frontend Setup

Open a new terminal.

Navigate to frontend:

cd frontend

Install dependencies:

npm install

Start the development server:
npm run dev

Frontend runs at:
http://localhost:5173


Game Rules
	•	Guess a 5-letter word
	•	Maximum 6 attempts
	•	Each guess returns feedback:

🟩 correct position
🟨 correct letter but wrong position
⬜ letter not in word




Possible Improvements
	•	On-screen keyboard
	•	Word validation dictionary
	•	Animations
	•	Mobile responsive layout
	•	Automated tests
	•	Docker support


  Author

Technical challenge implementation by Tomas Xavier.
:::