import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

type LetterResult = {
  letter: string;
  status: "correct" | "present" | "absent";
};

type GuessResponse = {
  guess: string;
  result: LetterResult[];
  guesses_used: number;
  guesses_remaining: number;
  game_over: boolean;
  won: boolean;
  word?: string;
};

function App() {
  const [sessionId, setSessionId] = useState("");
  const [guesses, setGuesses] = useState<GuessResponse[]>([]);
  const [word, setWord] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [revealedWord, setRevealedWord] = useState("");

  const startGame = async () => {
    try {
      const res = await api.post("/game");
      setSessionId(res.data.session_id);
      setGuesses([]);
      setWord("");
      setGameOver(false);
      setMessage("");
      setRevealedWord("");
    } catch (error) {
      console.error("Erro ao criar jogo:", error);
      setMessage("Erro ao criar novo jogo.");
    }
  };

  const sendGuess = async () => {
    if (word.length !== 5) {
      setMessage("A palavra deve ter 5 letras.");
      return;
    }

    try {
      const res = await api.post(`/game/${sessionId}/guess`, {
        word: word.toLowerCase(),
      });

      setGuesses((prev) => [...prev, res.data]);
      setWord("");
      setMessage("");

      if (res.data.game_over) {
        setGameOver(true);
        setRevealedWord(res.data.word || "");
        setMessage(res.data.won ? "Parabéns, ganhaste!" : "Fim do jogo.");
      }
    } catch (error: any) {
      console.error("Erro ao enviar tentativa:", error);
      setMessage(error?.response?.data?.message || "Erro ao enviar tentativa.");
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="app">
      <h1>Wordle Clone</h1>

      <button className="new-game-btn" onClick={startGame}>
        Novo jogo
      </button>

      <div className="board">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const guess = guesses[rowIndex];

          return (
            <div className="row" key={rowIndex}>
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const cell = guess?.result?.[colIndex];

                return (
                  <div
                    key={colIndex}
                    className={`tile ${cell ? cell.status : ""}`}
                  >
                    {cell?.letter || ""}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {!gameOver && (
        <div className="controls">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value.slice(0, 5))}
            maxLength={5}
            placeholder="palavra"
          />
          <button onClick={sendGuess}>Enviar</button>
        </div>
      )}

      {message && <p className="message">{message}</p>}

      {gameOver && revealedWord && (
        <p className="message">
          Palavra correta: <strong>{revealedWord.toUpperCase()}</strong>
        </p>
      )}

      <p className="session">Sessão: {sessionId}</p>
    </div>
  );
}

export default App;