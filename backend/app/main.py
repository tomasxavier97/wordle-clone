import json
import uuid
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.models import Game, Guess
from app.word_repository import get_random_word, is_valid_word
from app.game_logic import evaluate_guess

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wordle Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_GUESSES = 6
WORD_LENGTH = 5


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict) and "error" in exc.detail and "message" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "http_error", "message": str(exc.detail)}
    )


@app.get("/")
def root():
    return {"message": "Wordle Clone API running"}


@app.post("/game", status_code=201)
def create_game(db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    secret_word = get_random_word()

    game = Game(
        id=session_id,
        word=secret_word,
        status="active",
        guesses_used=0
    )

    db.add(game)
    db.commit()

    return {
        "session_id": session_id,
        "max_guesses": MAX_GUESSES,
        "word_length": WORD_LENGTH
    }


@app.post("/game/{session_id}/guess")
def submit_guess(session_id: str, payload: dict, db: Session = Depends(get_db)):
    guess_word = payload.get("word", "").lower().strip()

    game = db.query(Game).filter(Game.id == session_id).first()

    if not game:
        raise HTTPException(status_code=404, detail={
            "error": "not_found",
            "message": "Sessão não encontrada"
        })

    if game.status != "active":
        raise HTTPException(status_code=409, detail={
            "error": "game_over",
            "message": "Esta sessão já terminou"
        })

    if len(guess_word) != WORD_LENGTH:
        raise HTTPException(status_code=400, detail={
            "error": "invalid_length",
            "message": "A palavra deve ter 5 letras"
        })

    if not is_valid_word(guess_word):
        raise HTTPException(status_code=400, detail={
            "error": "invalid_word",
            "message": "Palavra não existe no dicionário"
        })

    result = evaluate_guess(game.word, guess_word)
    guesses_used = game.guesses_used + 1
    won = guess_word == game.word
    game_over = won or guesses_used >= MAX_GUESSES

    guess = Guess(
        game_id=game.id,
        word=guess_word,
        result=json.dumps(result),
        attempt_number=guesses_used
    )

    db.add(guess)

    game.guesses_used = guesses_used
    if won:
        game.status = "won"
    elif guesses_used >= MAX_GUESSES:
        game.status = "lost"

    db.commit()

    response = {
        "guess": guess_word,
        "result": result,
        "guesses_used": guesses_used,
        "guesses_remaining": MAX_GUESSES - guesses_used,
        "game_over": game.status != "active",
        "won": won
    }

    if response["game_over"]:
        response["word"] = game.word

    return response


@app.get("/game/{session_id}")
def get_game_state(session_id: str, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.id == session_id).first()

    if not game:
        raise HTTPException(status_code=404, detail={
            "error": "not_found",
            "message": "Sessão não encontrada"
        })

    guesses = (
        db.query(Guess)
        .filter(Guess.game_id == game.id)
        .order_by(Guess.attempt_number)
        .all()
    )

    parsed_guesses = [
        {
            "word": g.word,
            "result": json.loads(g.result)
        }
        for g in guesses
    ]

    return {
        "session_id": game.id,
        "guesses": parsed_guesses,
        "guesses_used": game.guesses_used,
        "guesses_remaining": MAX_GUESSES - game.guesses_used,
        "game_over": game.status != "active",
        "won": game.status == "won"
    }


@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    games = db.query(Game).all()

    total_games = len(games)
    total_wins = sum(1 for g in games if g.status == "won")
    win_rate = (total_wins / total_games) if total_games > 0 else 0.0

    guess_distribution = {str(i): 0 for i in range(1, 7)}
    for game in games:
        if game.status == "won" and 1 <= game.guesses_used <= 6:
            guess_distribution[str(game.guesses_used)] += 1

    return {
        "total_games": total_games,
        "total_wins": total_wins,
        "win_rate": round(win_rate, 2),
        "guess_distribution": guess_distribution,
        "current_streak": 0,
        "max_streak": 0
    }