import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import HelpModal from './HelpModal';  // Import the HelpModal component


const socket = io('https://realtime-chat-backend-fmoq.onrender.com'); // Replace with your Render backend URL
// const socket = io('http://localhost:5000'); // Use localhost when running locally


const themes = {
  fruits: ["apple", "banana", "cherry", "date", "fig", "grape", "orange", "pear", "melon", "berry", "kiwi", "peach"],
  cars: ["sedan", "coupe", "convertible", "hatchback", "SUV", "truck", "van", "minivan", "jeep", "wagon", "roadster", "limousine"],
  animals: ["lion", "tiger", "bear", "elephant", "giraffe", "zebra", "kangaroo", "panda", "wolf", "fox", "rabbit", "deer"],
  countries: ["Canada", "Brazil", "France", "Germany", "Australia", "Japan", "India", "China", "Russia", "Italy", "Mexico", "Spain"],
  sports: ["soccer", "basketball", "baseball", "tennis", "cricket", "hockey", "golf", "boxing", "rugby", "swimming", "cycling", "skiing"],
  movies: ["Inception", "Titanic", "Avatar", "Gladiator", "Joker", "Interstellar", "Frozen", "Coco", "Up", "Braveheart", "Rocky", "Matrix"],
  colors: ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white", "gray", "cyan"],
  cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville"],
  music: ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Country", "Blues", "Reggae", "Metal", "Folk", "Disco", "Opera"],
  vegetables: ["carrot", "broccoli", "cauliflower", "spinach", "potato", "tomato", "onion", "lettuce", "pepper", "cucumber", "zucchini", "garlic"],
  planets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Eris", "Haumea", "Makemake"],
  instruments: ["guitar", "piano", "violin", "drum", "flute", "trumpet", "saxophone", "cello", "clarinet", "trombone", "harp", "tuba"],
  elements: ["hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon", "sodium", "magnesium"],
  flowers: ["rose", "tulip", "daisy", "sunflower", "orchid", "lily", "daffodil", "jasmine", "violet", "lavender", "peony", "chrysanthemum"],
  desserts: ["cake", "ice cream", "brownie", "pudding", "pie", "cookie", "donut", "muffin", "tart", "cheesecake", "eclair", "cupcake"],
  tools: ["hammer", "wrench", "screwdriver", "pliers", "drill", "saw", "chisel", "file", "level", "tape measure", "clamp"],
  furniture: ["chair", "table", "sofa", "bed", "dresser", "cabinet", "desk", "shelf", "stool", "bench", "wardrobe", "armchair"],
  beverages: ["coffee", "tea", "milk", "juice", "soda", "water", "wine", "beer", "smoothie", "lemonade", "cocktail", "champagne"],
  occupations: ["doctor", "teacher", "engineer", "nurse", "artist", "chef", "pilot", "lawyer", "plumber", "firefighter", "police", "scientist"],
  weather: ["rain", "snow", "sunny", "cloudy", "storm", "windy", "foggy", "hail", "thunder", "lightning", "tornado", "blizzard"],
  shapes: ["circle", "square", "triangle", "rectangle", "hexagon", "octagon", "oval", "star", "diamond", "pentagon", "heart", "crescent"],
  birds: ["sparrow", "eagle", "parrot", "pigeon", "owl", "flamingo", "peacock", "crow", "swan", "hawk", "penguin", "robin"],
  insects: ["butterfly", "ant", "bee", "beetle", "dragonfly", "mosquito", "spider", "ladybug", "grasshopper", "fly", "wasp", "caterpillar"],
  jewelry: ["necklace", "ring", "bracelet", "earring", "watch", "pendant", "brooch", "bangle", "anklet", "choker", "cufflink", "tiara"],
  trees: ["oak", "pine", "maple", "willow", "birch", "cedar", "spruce", "cherry", "apple", "walnut", "palm", "baobab"],
  historicalFigures: ["Einstein", "Cleopatra", "Gandhi", "Lincoln", "Napoleon", "Da Vinci", "Aristotle", "Shakespeare", "Newton", "Curie", "Columbus", "Mozart"],
  continents: ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"],
  gemstones: ["diamond", "ruby", "sapphire", "emerald", "amethyst", "opal", "topaz", "turquoise", "garnet", "jade", "pearl", "aquamarine"],
  superheroes: ["Superman", "Batman", "Spiderman", "Ironman", "Wonder Woman", "Hulk", "Thor", "Captain America", "Flash", "Green Lantern", "Aquaman", "Black Panther"],
  mythicalCreatures: ["dragon", "unicorn", "phoenix", "griffin", "centaur", "mermaid", "vampire", "werewolf", "cyclops", "minotaur", "troll", "fairy"],
  hobbies: ["reading", "painting", "hiking", "knitting", "gardening", "fishing", "cooking", "cycling", "photography", "writing", "dancing", "drawing"],
  fairyTales: ["Cinderella", "Snow White", "Sleeping Beauty", "Little Red Riding Hood", "Hansel and Gretel", "Jack and the Beanstalk", "Beauty and the Beast", "Rapunzel", "The Little Mermaid", "Aladdin", "Pinocchio", "Peter Pan"],
  professions: ["doctor", "teacher", "engineer", "nurse", "artist", "chef", "pilot", "lawyer", "plumber", "firefighter", "police", "scientist"],
  kitchenAppliances: ["oven", "microwave", "blender", "toaster", "refrigerator", "dishwasher", "mixer", "grill", "freezer", "coffee maker", "stove", "kettle"],
  boardGames: ["Monopoly", "Chess", "Checkers", "Scrabble", "Clue", "Risk", "Catan", "Candy Land", "Sorry", "Life", "Battleship", "Jenga"],
  modesOfTransport: ["bicycle", "car", "bus", "train", "airplane", "boat", "scooter", "motorcycle", "tram", "subway", "helicopter", "ferry"],
  mythicalGods: ["Zeus", "Hera", "Odin", "Thor", "Poseidon", "Athena", "Ares", "Apollo", "Hades", "Loki", "Hermes", "Dionysus"],
  danceStyles: ["ballet", "jazz", "tap", "hip hop", "salsa", "tango", "waltz", "breakdance", "flamenco", "swing", "contemporary", "folk"],
  spaceObjects: ["star", "planet", "comet", "asteroid", "meteor", "nebula", "galaxy", "black hole", "moon", "quasar", "supernova", "pulsar"],
  seaCreatures: ["shark", "dolphin", "whale", "octopus", "jellyfish", "starfish", "seahorse", "crab", "lobster", "shrimp", "seal", "sea turtle"],
  materials: ["wood", "metal", "plastic", "glass", "ceramic", "cloth", "paper", "rubber", "leather", "stone", "concrete", "fabric"],
  famousLandmarks: ["Eiffel Tower", "Great Wall", "Statue of Liberty", "Colosseum", "Taj Mahal", "Machu Picchu", "Pyramids", "Big Ben", "Sydney Opera House", "Mount Rushmore", "Christ the Redeemer", "Stonehenge"]
};

const assignRoles = (players) => {
  const roles = ["mole"]; // Always have 1 mole
  const detectiveCount = players.length - 1;
  roles.push(...Array(detectiveCount).fill("detective"));
  
  return roles.sort(() => Math.random() - 0.5).reduce((acc, role, index) => {
    acc[players[index].id] = role;
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
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState({});
  const [theme, setTheme] = useState("");
  const [themeWords, setThemeWords] = useState([]);
  const [board, setBoard] = useState([]);
  const [word, setWord] = useState("");
  const [scores, setScores] = useState({});
  const [screen, setScreen] = useState("start");
  const [showRole, setShowRole] = useState(false);
  const [lobbyCode, setLobbyCode] = useState("");
  const [inputLobbyCode, setInputLobbyCode] = useState("");
  const [myRole, setMyRole] = useState("");
  const [myWord, setMyWord] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);  // State for managing the HelpModal

  useEffect(() => {
    socket.on('updatePlayers', ({ players, hostId }) => {
      setPlayers(players);
      setIsHost(hostId);
      const initialScores = players.reduce((acc, player) => {
        acc[player.name] = 0;
        return acc;
      }, {});
      setScores(initialScores);
    });

    socket.on('gameStarted', ({ role, board, theme, word }) => {
      setMyRole(role);
      setMyWord(word);
      setBoard(board);
      setTheme(theme);
      setScreen("player-role");
    });

    socket.on('gameBoard', ({ board, theme }) => {
      setBoard(board);
      setTheme(theme);
    });

    socket.on('updateScores', (newScores) => {
      setScores(newScores);
    });

    socket.on('proceedToBoard', () => {
      setScreen("board");
    });

    socket.on('proceedToReveal', () => {
      setScreen("reveal");
    });

    socket.on('proceedToAddPoints', () => {
      setScreen("add-points");
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('gameStarted');
      socket.off('gameBoard');
      socket.off('updateScores');
      socket.off('proceedToBoard');
      socket.off('proceedToReveal');
      socket.off('proceedToAddPoints');
    };
  }, []);

  const handleCreateLobby = () => {
    socket.emit('createLobby', username);
    socket.on('lobbyCreated', ({ lobbyCode, hostId }) => {
      setLobbyCode(lobbyCode);
      setIsHost(hostId); // Now all players will know the host ID
      setScreen("lobby");
    });
  };

  const handleJoinLobby = () => {
    socket.emit('joinLobby', inputLobbyCode, username);
    setLobbyCode(inputLobbyCode);
    setScreen("lobby");
  };

  const handleStartGame = () => {
    if (isHost === socket.id) {
      socket.emit('startGame', lobbyCode);
    } else {
      alert("Only the host can start the game.");
    }
  };

  const handleRevealRole = () => {
    setShowRole(true);
  };

  const handleProceed = () => {
    if (isHost === socket.id) {
      socket.emit('proceedToBoard', lobbyCode);
    } else {
      alert("Only the host can proceed.");
    }
  };

  const handleShowReveal = () => {
    if (isHost === socket.id) {
      socket.emit('proceedToReveal', lobbyCode);
    } else {
      alert("Only the host can proceed to the reveal.");
    }
  };

  const handleAddPoints = () => {
    if (isHost === socket.id) {
      socket.emit('proceedToAddPoints', lobbyCode);
    } else {
      alert("Only the host can add points.");
    }
  };

  const handleAddPoint = (playerName) => {
    const newScores = {
      ...scores,
      [playerName]: scores[playerName] + 1
    };
    setScores(newScores);
    socket.emit('updateScores', { lobbyCode, scores: newScores });
  };

  const handleDeductPoint = (playerName) => {
    const newScores = {
      ...scores,
      [playerName]: Math.max(scores[playerName] - 1, 0)
    };
    setScores(newScores);
    socket.emit('updateScores', { lobbyCode, scores: newScores });
  };

  const handleNewGame = () => {
    if (isHost === socket.id) {
      socket.emit('newGame', lobbyCode);
    } else {
      alert("Only the host can start a new game.");
    }
  };

  const resetGame = () => {
    const [randomTheme, words] = getRandomThemeAndWords();
    setTheme(randomTheme);
    setThemeWords(words);
    setWord(getRandomWord(words));
    setBoard(createBoard(words));
    setRoles(assignRoles(players));
    setScreen("player-role");
    setShowRole(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyCode)
      .then(() => alert("Lobby code copied to clipboard!"))
      .catch(() => alert("Failed to copy lobby code"));
  };

  const handleHelpClick = () => {
    setIsHelpOpen(true); // Open the Help modal
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false); // Close the Help modal
  };

  return (
    <div className="App">
      <button className="help-button" onClick={handleHelpClick}>Help</button> {/* Help Button */}
      
      <HelpModal isOpen={isHelpOpen} onClose={handleCloseHelp} /> {/* Render HelpModal if open */}

      {screen === "start" && (
        <div className="start-screen">
          <img src={`${process.env.PUBLIC_URL}/moleynbg.png`} alt="The Moley Game" className="header-image" />
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <h1>Lobby</h1>
          <div className="lobby-code">
            <span>Lobby Code: {lobbyCode}</span>
            <button onClick={handleCopyCode}>Copy</button>
          </div>
          <h2>Players:</h2>
          <div className="player-list">
            {players.map((player, index) => (
              <div
                key={index}
                className="player-item"
                style={{
                  backgroundColor: player.id === isHost ? "#FFD700" : player.id === socket.id ? "#1E90FF" : "#444",
                  color: player.id === isHost || player.id === socket.id ? "#000" : "#fff",
                  borderColor: player.id === isHost ? "#FFA500" : "transparent"
                }}
              >
                <span>
                  {player.name} {player.id === isHost && "(Host)"}
                  {player.id === socket.id && " (You)"}
                </span>
              </div>
            ))}
          </div>
          {isHost === socket.id && <button onClick={handleStartGame}>Start Game</button>}
        </div>
      )}
      {screen === "player-role" && (
        <div className="player-role-screen">
          <h1>{username}, are you ready for your turn?</h1>
          {showRole ? (
            <h2 className="role-reveal">{myRole === 'mole' ? 'You are the mole.' : `The word is '${myWord}'.`}</h2>
          ) : (
            <button onClick={handleRevealRole}>Reveal Role</button>
          )}
          {isHost === socket.id && <button onClick={handleProceed}>Proceed</button>}
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
          {isHost === socket.id && <button onClick={handleShowReveal}>Next</button>}
        </div>
      )}
      {screen === "reveal" && (
        <div className="reveal-screen">
          <h1>The word was: {myWord}</h1>
          <div className="reveal-list">
            {Object.entries(roles).map(([id, role]) => {
              const player = players.find(player => player.id === id);
              return (
                <div key={id} className="player-item" style={{
                  backgroundColor: role === 'mole' ? "#FFD700" : "#1E90FF",
                  color: "#000",
                  borderColor: role === 'mole' ? "#FFA500" : "transparent",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  textAlign: "left",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)"
                }}>
                  <span>
                    {player.name} was a {role}
                  </span>
                </div>
              );
            })}
          </div>
          {isHost === socket.id && <button onClick={handleAddPoints}>Proceed to Points</button>}
        </div>
      )}
      {screen === "add-points" && (
        <div className="score-screen">
          <h1>Scores</h1>
          {Object.entries(scores).map(([name, score]) => (
            <div className="score-item" key={name}>
              <span>{name}: {score}</span>
              {isHost === socket.id && (
                <div>
                  <button onClick={() => handleAddPoint(name)}>Add Point</button>
                  <button onClick={() => handleDeductPoint(name)}>Deduct Point</button>
                </div>
              )}
            </div>
          ))}
          {isHost === socket.id && <button onClick={handleNewGame}>New Game</button>}
        </div>
      )}
    </div>
  );
}

export default App;