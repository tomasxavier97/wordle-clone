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
  const [guessWord, setGuessWord] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [phase, setPhase] = useState<"setup" | "playing" | "finished">("setup");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [revealedWord, setRevealedWord] = useState("");
  const [won, setWon] = useState(false);

  const startGame = async () => {
    try {
      const res = await api.post("/game");

      setSessionId(res.data.session_id);
      setGuesses([]);
      setGuessWord("");
      setSecretWord("");
      setPhase("setup");
      setGameOver(false);
      setMessage("");
      setRevealedWord("");
      setWon(false);
    } catch (error) {
      console.error("Erro ao criar sessao:", error);
      setMessage("Erro ao criar nova sessao.");
    }
  };

  const setWordForSession = async () => {
    if (!sessionId) return;

    if (secretWord.length !== 5) {
      setMessage("A palavra deve ter 5 letras.");
      return;
    }

    try {
      await api.post(`/game/${sessionId}/set-word`, {
        word: secretWord.toLowerCase(),
      });

      setSecretWord("");
      setPhase("playing");
      setMessage("Palavra definida. Jogador B pode começar.");
    } catch (error: any) {
      console.error("Erro ao definir palavra:", error);
      setMessage(error?.response?.data?.message || "Erro ao definir a palavra.");
    }
  };

  const sendGuess = async () => {
    if (!sessionId) return;

    if (guessWord.length !== 5) {
      setMessage("A palavra deve ter 5 letras.");
      return;
    }

    try {
      const res = await api.post<GuessResponse>(`/game/${sessionId}/guess`, {
        word: guessWord.toLowerCase(),
      });

      setGuesses((prev) => [...prev, res.data]);
      setGuessWord("");
      setMessage("");

      if (res.data.game_over) {
        setGameOver(true);
        setWon(res.data.won);
        setRevealedWord(res.data.word || "");
        setPhase("finished");
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

  const renderBoard = () => {
    return Array.from({ length: 6 }).map((_, rowIndex) => {
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
    });
  };

  return (
    <div className="app">
      <h1>Wordle Clone</h1>

      <button className="new-game-btn" onClick={startGame}>
        Novo jogo
      </button>

      <div className="board">{renderBoard()}</div>

      {phase === "setup" && (
        <div className="controls">
          <input
            type="password"
            value={secretWord}
            onChange={(e) => setSecretWord(e.target.value.slice(0, 5))}
            maxLength={5}
            placeholder="Jogador A define a palavra"
          />
          <button onClick={setWordForSession}>Definir palavra</button>
        </div>
      )}

      {phase === "playing" && !gameOver && (
        <div className="controls">
          <input
            type="text"
            value={guessWord}
            onChange={(e) => setGuessWord(e.target.value.slice(0, 5))}
            maxLength={5}
            placeholder="Jogador B tenta adivinhar"
          />
          <button onClick={sendGuess}>Enviar</button>
        </div>
      )}

      {message && <p className="message">{message}</p>}

      {phase === "finished" && revealedWord && (
        <div className="result-box">
          <p className="message">
            {won ? "Parabéns, ganhaste!" : "Fim do jogo."}
          </p>
          <p className="message">
            Palavra correta: <strong>{revealedWord.toUpperCase()}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;