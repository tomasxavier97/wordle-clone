# Wordle Clone – Full Stack Technical Challenge

This project is a **Wordle-style game clone** built as part of a Full Stack technical challenge.

The application consists of:

- A **FastAPI backend**
- A **SQLite database**
- A **React + TypeScript frontend**
- A **REST API** that handles all game logic

The frontend communicates exclusively with the backend API.

---

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- Axios

---

## Project Structure

```text
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