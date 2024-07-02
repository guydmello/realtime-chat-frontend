import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://realtime-chat-backend-fmoq.onrender.com'); // Replace with your Render backend URL

const themes = {
  // Your themes object here
};

const assignRoles = (players) => {
  const numMoles = Math.floor(Math.random() * 2) + 1; // Always between 1 and 2 moles
  const roles = Array(numMoles).fill("mole").concat(Array(players.length - numMoles).fill("detective"));
  return roles.sort(() => Math.random() - 0.5).reduce((acc, role, index) => {
    acc[players[index]] = role;
    return acc;
  }, {});
};

const createBoard = (themeWords) => {
  const shuffledWords = themeWords.sort(() => Math.random() - 0.5);
  return Array.from({ length: 4 }, (_, rowIndex) => shuffledWords.slice(rowIndex * 4, (rowIndex + 1) * 4));
};

const getRandomThemeAndWords = () => {
  const entries = Object.entries(themes);
  const [randomTheme, words] = entries[Math.floor(Math.random() * entries.length)];
  return [randomTheme, words];
};

const getRandomWord = (words) => {
  return words[Math.floor(Math.random() * words.length)];
};

function App() {
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState({});
  const [theme, setTheme] = useState("");
  const [themeWords, setThemeWords] = useState([]);
  const [board, setBoard] = useState([]);
  const [word, setWord] = useState("");
  const [scores, setScores] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [screen, setScreen] = useState("start");
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [lobbyCode, setLobbyCode] = useState("");
  const [inputLobbyCode, setInputLobbyCode] = useState("");

  useEffect(() => {
    socket.on('updatePlayers', (players) => {
      setPlayers(players);
    });

    socket.on('gameStarted', ({ roles, board, theme, word }) => {
      setRoles(roles);
      setBoard(board);
      setTheme(theme);
      setWord(word);
      setScreen("player-role");
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('gameStarted');
    };
  }, []);

  const handleCreateLobby = () => {
    socket.emit('createLobby');
    socket.on('lobbyCreated', (lobbyCode) => {
      setLobbyCode(lobbyCode);
      setScreen("lobby");
    });
  };

  const handleJoinLobby = () => {
    socket.emit('joinLobby', inputLobbyCode);
    setLobbyCode(inputLobbyCode);
    setScreen("lobby");
  };

  const handleStartGame = () => {
    socket.emit('startGame', lobbyCode);
  };

  const handleNextTurn = () => {
    if (!readyToProceed) {
      setReadyToProceed(true);
    } else {
      if (currentPlayerIndex + 1 >= players.length) {
        setScreen("board");
      } else {
        setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
        setReadyToProceed(false);
        setShowRole(false);
      }
    }
  };

  const handleRevealRole = () => {
    setShowRole(true);
  };

  const handleReveal = () => {
    setScreen("reveal");
  };

  const handleAddPoints = () => {
    setScreen("add-points");
  };

  const handleSkipPoints = () => {
    setScreen("player-role");
    resetGame();
  };

  const handleAddPoint = (player) => {
    setScores((prevScores) => ({
      ...prevScores,
      [player]: prevScores[player] + 1
    }));
  };

  const handleDeductPoint = (player) => {
    setScores((prevScores) => ({
      ...prevScores,
      [player]: Math.max(prevScores[player] - 1, 0)
    }));
  };

  const resetGame = () => {
    const [randomTheme, words] = getRandomThemeAndWords();
    setTheme(randomTheme);
    setThemeWords(words);
    setWord(getRandomWord(words));
    setBoard(createBoard(words));
    setRoles(assignRoles(players));
    setCurrentPlayerIndex(0);
    setScreen("player-role");
    setReadyToProceed(false);
    setShowRole(false);
  };

  return (
    <div className="App">
      {screen === "start" && (
        <div className="start-screen">
          <h1>Holey Moley</h1>
          <div className="lobby-buttons">
            <button onClick={handleCreateLobby}>Create Lobby</button>
            <input
              type="text"
              placeholder="Enter lobby code"
              value={inputLobbyCode}
              onChange={(e) => setInputLobbyCode(e.target.value)}
            />
            <button onClick={handleJoinLobby}>Join Lobby</button>
          </div>
        </div>
      )}
      {screen === "lobby" && (
        <div className="lobby-screen">
          <h1>Lobby Code: {lobbyCode}</h1>
          <h2>Players:</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
      {screen === "player-role" && (
        <div className="player-role-screen">
          <h1>{players[currentPlayerIndex]}, are you ready for your turn?</h1>
          {readyToProceed && (
            <h2>
              {showRole ? (
                roles[players[currentPlayerIndex]] === 'mole' ? 'You are the mole.' : `The word is '${word}'.`
              ) : (
                <button onClick={handleRevealRole}>Reveal Role</button>
              )}
            </h2>
          )}
          <button onClick={handleNextTurn}>Next</button>
        </div>
      )}
      {screen === "board" && (
        <div className="board-screen">
          <h1>Game Board for the theme '{theme}':</h1>
          <div className="board">
            {board.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((word, wordIndex) => (
                  <div className="board-cell" key={wordIndex}>
                    {word}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <button onClick={handleReveal}>Next</button>
        </div>
      )}
      {screen === "reveal" && (
        <div className="reveal-screen">
          <h1>The word was: {word}</h1>
          {Object.entries(roles).map(([player, role]) => (
            <div key={player}>
              {player} was a {role}
            </div>
          ))}
          <button onClick={handleAddPoints}>Next</button>
        </div>
      )}
      {screen === "add-points" && (
        <div className="score-screen">
          <h1>Scores</h1>
          {Object.entries(scores).map(([player, score]) => (
            <div className="score-item" key={player}>
              <span>{player}: {score}</span>
              <div>
                <button onClick={() => handleAddPoint(player)}>Add Point</button>
                <button onClick={() => handleDeductPoint(player)}>Deduct Point</button>
              </div>
            </div>
          ))}
          <button onClick={handleSkipPoints}>Skip</button>
          <button onClick={resetGame}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
