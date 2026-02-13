import { useState, useEffect, useCallback, useRef } from 'react';

// Color configuration
const colors = [
  { id: '1', name: 'red', bg: 'bg-red-500/90', hoverBg: 'hover:bg-red-400', shadow: 'red-shadow' },
  { id: '2', name: 'blue', bg: 'bg-blue-500/90', hoverBg: 'hover:bg-blue-400', shadow: 'blue-shadow' },
  { id: '3', name: 'green', bg: 'bg-green-500/90', hoverBg: 'hover:bg-green-400', shadow: 'green-shadow' },
  { id: '4', name: 'black', bg: 'bg-gray-800/95', hoverBg: 'hover:bg-gray-700', shadow: 'black-shadow' }
];

const SimonGame = () => {
  const [playerName, setPlayerName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [randomArray, setRandomArray] = useState([]);
  const [userSelectionArray, setUserSelectionArray] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Mobile overlay states
  const [showLeftOverlay, setShowLeftOverlay] = useState(false);
  const [showRightOverlay, setShowRightOverlay] = useState(false);
  
  const nameInputRef = useRef(null);
  const timeoutRef = useRef(null);
  const timeoutsRef = useRef([]);
  const hasResumedRef = useRef(false);

  // Load all saved state from localStorage on initial mount
  useEffect(() => {
    // Load players
    const savedPlayers = localStorage.getItem('simonPlayers');
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    
    // Load game state
    const savedGameState = localStorage.getItem('simonGameState');
    if (savedGameState) {
      try {
        const gameState = JSON.parse(savedGameState);
        setPlayerName(gameState.playerName || '');
        setIsNameSubmitted(gameState.isNameSubmitted || false);
        setGameActive(gameState.gameActive || false);
        setGameOver(gameState.gameOver || false);
        setRandomArray(gameState.randomArray || []);
        setUserSelectionArray(gameState.userSelectionArray || []);
        setGameStarted(gameState.gameStarted || false);
        
        // Mark that we've loaded from localStorage
        if (gameState.gameStarted && !gameState.gameOver && gameState.randomArray.length > 0) {
          hasResumedRef.current = true;
        }
      } catch (e) {
        console.error('Failed to load game state', e);
      }
    }
    setIsInitialLoad(false);
  }, []);

  // Resume game after initial load if there was an active game
  useEffect(() => {
    if (!isInitialLoad && hasResumedRef.current && gameStarted && !gameOver && randomArray.length > 0) {
      console.log('Resuming game after refresh');
      hasResumedRef.current = false;
      
      // Clear any existing timeouts
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      
      // Set game to inactive during sequence playback
      setGameActive(false);
      
      // Play the current sequence
      let index = 0;
      
      const playNext = () => {
        if (index < randomArray.length) {
          const colorId = randomArray[index].toString();
          setActiveColor(colorId);
          
          // Turn off after 500ms
          setTimeout(() => {
            setActiveColor(null);
          }, 500);
          
          index++;
          const timeout = setTimeout(playNext, 600);
          timeoutsRef.current.push(timeout);
        } else {
          // Sequence finished, activate game for user input
          const timeout = setTimeout(() => {
            setGameActive(true);
          }, 400);
          timeoutsRef.current.push(timeout);
        }
      };
      
      // Start playing after a short delay
      const startTimeout = setTimeout(playNext, 200);
      timeoutsRef.current.push(startTimeout);
    }
  }, [isInitialLoad, gameStarted, gameOver, randomArray]);

  // Save game state to localStorage whenever relevant state changes
  useEffect(() => {
    // Don't save during initial load
    if (isInitialLoad) return;
    
    const gameState = {
      playerName,
      isNameSubmitted,
      gameActive,
      gameOver,
      randomArray,
      userSelectionArray,
      gameStarted
    };
    localStorage.setItem('simonGameState', JSON.stringify(gameState));
  }, [playerName, isNameSubmitted, gameActive, gameOver, randomArray, userSelectionArray, gameStarted, isInitialLoad]);

  // Save players to localStorage
  useEffect(() => {
    if (players.length > 0) localStorage.setItem('simonPlayers', JSON.stringify(players));
  }, [players]);

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Function to remove shadow after 500ms
  const removeShadow = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveColor(null);
    }, 500);
  }, []);

  // Function to beep a color
  const beep = useCallback((colorId) => {
    setActiveColor(colorId);
    removeShadow();
  }, [removeShadow]);

  // Function to blink a random box
  const boxBlink = useCallback(() => {
    // Generate random number 1-4
    const randomSelect = Math.floor(Math.random() * 4) + 1;
    
    // Add to random array
    setRandomArray(prev => [...prev, randomSelect]);
    
    // Disable pointer during blink
    setGameActive(false);
    
    // Beep the selected color
    beep(randomSelect.toString());
    
    // Re-enable pointer after blink
    const timeout = setTimeout(() => {
      setGameActive(true);
    }, 600);
    
    timeoutsRef.current.push(timeout);
    
  }, [beep]);

  // Start game
  const startGame = useCallback(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    // Reset arrays
    setUserSelectionArray([]);
    setRandomArray([]);
    
    // Set game states
    setGameActive(false);
    setGameOver(false);
    setGameStarted(true);
    
    // Blink first box after delay
    const timeout = setTimeout(() => {
      boxBlink();
    }, 100);
    
    timeoutsRef.current.push(timeout);
    
  }, [boxBlink]);

  // Handle color click
  const handleColorClick = useCallback((colorId) => {
    // Prevent clicks if game is not active, game is over, or game hasn't started
    if (!gameActive || gameOver || !gameStarted) return;
    
    // Beep the clicked color
    beep(colorId);
    
    // Add to user selection array
    const newUserSelection = [...userSelectionArray, parseInt(colorId)];
    setUserSelectionArray(newUserSelection);
    
    console.log('User:', newUserSelection, 'Random:', randomArray);
    
    // Check if user sequence length matches random array length
    if (newUserSelection.length === randomArray.length) {
      // Check if sequences match
      if (newUserSelection.toString() === randomArray.toString()) {
        // Correct - blink next box after delay
        const timeout = setTimeout(() => {
          boxBlink();
        }, 1000);
        
        timeoutsRef.current.push(timeout);
        
        // Reset user selection array
        setUserSelectionArray([]);
      } else {
        // Wrong - game over
        setGameOver(true);
        setGameActive(false);
        
        // Save score (only if they had at least 1 correct)
        if (randomArray.length - 1 > 0) {
          const newPlayer = {
            id: Date.now(),
            name: playerName,
            score: randomArray.length - 1,
            date: new Date().toLocaleDateString()
          };
          
          setPlayers(prev => {
            const updated = [...prev, newPlayer].sort((a, b) => b.score - a.score).slice(0, 10);
            return updated;
          });
        }
      }
    }
  }, [gameActive, gameOver, gameStarted, userSelectionArray, randomArray, playerName, beep, boxBlink]);

  // Reset game and go back to name entry
  const newPlayer = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Reset all game states
    setPlayerName('');
    setIsNameSubmitted(false);
    setGameActive(false);
    setGameOver(false);
    setGameStarted(false);
    setRandomArray([]);
    setUserSelectionArray([]);
    setActiveColor(null);
    
    // Clear game state from localStorage
    localStorage.removeItem('simonGameState');
  }, []);

  // Just reset the game (play again with same player)
  const playAgain = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Reset game states but keep player name
    setGameActive(false);
    setGameOver(false);
    setGameStarted(false);
    setRandomArray([]);
    setUserSelectionArray([]);
    setActiveColor(null);
  }, []);

  const getGlowStyle = useCallback((color) => {
    if (activeColor === color.id) {
      const shadowMap = {
        '1': '0 0 30px 15px rgba(239,68,68,0.95)',
        '2': '0 0 30px 15px rgba(59,130,246,0.95)',
        '3': '0 0 30px 15px rgba(34,197,94,0.95)',
        '4': '0 0 30px 15px rgba(255,255,255,0.85)'
      };
      return {
        boxShadow: shadowMap[color.id],
        transform: 'scale(1.02)',
        transition: 'all 0.1s ease-out',
        zIndex: 10
      };
    }
    return {};
  }, [activeColor]);

  const getRankStyle = (index) => {
    if (index === 0) return 'rank-first';
    if (index === 1) return 'rank-second';
    if (index === 2) return 'rank-third';
    return 'rank-default';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const closeOverlays = () => {
    setShowLeftOverlay(false);
    setShowRightOverlay(false);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsNameSubmitted(true);
    }
  };

  // Show name screen if name not submitted
  if (!isNameSubmitted) {
    return (
      <div className="name-screen min-h-screen w-full bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-4">
        <div className="name-container w-full max-w-md">
          <div className="name-card backdrop-blur-2xl bg-white/5 rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="game-title text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">Memory Game</h1>
              <p className="text-white/50 text-sm">how long can you recall</p>
            </div>
            
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium block">Enter your name to begin</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name..."
                  className="name-input w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="start-button w-full p-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition">Start Playing</button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-white/30 text-xs">Test your memory • Follow the sequence • Beat your high score</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container min-h-screen w-full bg-gradient-to-br from-slate-900 to-purple-900 p-2 sm:p-4 relative overflow-x-hidden">
      
      {/* Game Over Modal */}
      {gameOver && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" id="game-over">
          <div className="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={playAgain}></div>
          <div className="modal-content relative bg-white/10 backdrop-blur-2xl rounded-2xl p-6 max-w-sm w-full border border-white/30 animate-slideIn">
            <div className="text-center">
              <div className="modal-icon w-16 h-16 mx-auto mb-3 bg-red-500/30 rounded-full flex items-center justify-center border-2 border-red-400/50 text-red-300 text-2xl">✕</div>
              <h2 className="modal-title text-2xl font-bold text-white mb-1">Game Over</h2>
              <p className="modal-score text-3xl font-bold text-white mb-2">{randomArray.length - 1}</p>
              <p className="modal-score-label text-white/70 text-sm mb-4">colors remembered</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={playAgain} 
                  className="modal-button w-full px-5 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition"
                >
                  Play Again
                </button>
                
                <button 
                  onClick={newPlayer} 
                  className="modal-button w-full px-5 py-2 bg-gradient-to-r from-green-500/30 to-teal-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition"
                >
                  New Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Overlays */}
      <div className={`mobile-overlay fixed top-0 w-[85%] max-w-sm h-screen z-50 transition-transform duration-300 p-4 ${showLeftOverlay ? 'active translate-x-0' : '-translate-x-full'} left-0`}>
        <div className="overlay-header flex justify-end mb-4">
          <button onClick={closeOverlays} className="close-overlay p-2 bg-white/10 rounded-full border border-white/10 text-white">✕</button>
        </div>
        <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="icon-container w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">❓</div>
            <h2 className="text-white font-semibold text-lg">How to Play</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">1</span></div><p className="text-white/70 text-sm">Watch the sequence of colors</p></div>
            <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">2</span></div><p className="text-white/70 text-sm">Repeat by clicking the colors</p></div>
            <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">3</span></div><p className="text-white/70 text-sm">Each correct round adds one color</p></div>
            <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">4</span></div><p className="text-white/70 text-sm">Wrong click = game over!</p></div>
          </div>
          <div className="player-info-container mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="player-avatar w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/30"><span className="text-white font-bold text-lg">{playerName.charAt(0).toUpperCase()}</span></div>
              <div><p className="text-white/50 text-xs">Current Player</p><p className="text-white font-semibold">{playerName}</p></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`mobile-overlay fixed top-0 w-[85%] max-w-sm h-screen z-50 transition-transform duration-300 p-4 ${showRightOverlay ? 'active translate-x-0' : 'translate-x-full'} right-0`}>
        <div className="overlay-header flex justify-end mb-4">
          <button onClick={closeOverlays} className="close-overlay p-2 bg-white/10 rounded-full border border-white/10 text-white">✕</button>
        </div>
        <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="icon-container w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">🏆</div>
              <h2 className="text-white font-semibold text-lg">Leaderboard</h2>
            </div>
            <button onClick={() => {
              setPlayers([]);
              localStorage.removeItem('simonPlayers');
            }} className="reset-button p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition" title="Reset everything">↻</button>
          </div>
          
          <div className="leaderboard-list flex-1 overflow-y-auto pr-1">
            {players.length > 0 ? (
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={player.id} className={`rank-item flex items-center gap-3 p-3 rounded-lg border ${getRankStyle(index)}`}>
                    <div className="rank-icon w-8 h-8 rounded-full bg-black/20 flex items-center justify-center font-bold text-white">{getRankIcon(index)}</div>
                    <div className="player-info flex-1 min-w-0">
                      <p className="player-name-rank text-white font-medium truncate">{player.name}</p>
                      <p className="player-date text-white/40 text-xs">{player.date}</p>
                    </div>
                    <div className="player-score font-bold text-white bg-white/10 px-2 py-1 rounded min-w-[40px] text-center">{player.score}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-leaderboard text-center py-8">
                <p className="text-white/50">No scores yet</p>
                <p className="text-white/30 text-xs mt-1">Play a game to appear here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {(showLeftOverlay || showRightOverlay) && <div className="overlay-backdrop fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={closeOverlays}></div>}
      
      {/* Main layout */}
      <div className="main-layout w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 lg:gap-6 p-4">
        
        {/* Left Column - Desktop */}
        <div className="left-column hidden lg:block">
          <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-container w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">❓</div>
              <h2 className="text-white font-semibold text-lg">How to Play</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">1</span></div><p className="text-white/70 text-sm">Watch the sequence</p></div>
              <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">2</span></div><p className="text-white/70 text-sm">Repeat in order</p></div>
              <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">3</span></div><p className="text-white/70 text-sm">Each round adds one color</p></div>
              <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">4</span></div><p className="text-white/70 text-sm">Wrong click = game over</p></div>
            </div>
            <div className="player-info-container mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="player-avatar w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/30"><span className="text-white font-bold text-lg">{playerName.charAt(0).toUpperCase()}</span></div>
                <div><p className="text-white/50 text-xs">Current Player</p><p className="text-white font-semibold">{playerName}</p></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle Column - Game Board */}
        <div className="middle-column w-full">
          <div className="glass-card game-board-card backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-4 sm:p-6 border border-white/10">
            
            <div className="game-header flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="logo-container px-4 py-2 bg-white/5 rounded-xl border border-white/20"><h1 className="game-title-small text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">🧠Memory🧠</h1></div>
              
              {/* Mobile Toggle Buttons */}
              <div className="mobile-toggle-group flex lg:hidden gap-2">
                <button onClick={() => setShowLeftOverlay(true)} className="mobile-toggle-button flex items-center gap-1 px-3 py-2 bg-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/15 transition">❓ Guide</button>
                <button onClick={() => setShowRightOverlay(true)} className="mobile-toggle-button flex items-center gap-1 px-3 py-2 bg-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/15 transition">🏆 Scores</button>
              </div>
              
              <div className="player-badge px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">👤</span>
                  <p className="player-name text-white font-semibold text-sm sm:text-base max-w-[120px] truncate">{playerName}</p>
                </div>
              </div>
              
              <div className="score-container px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                <p className="score-label text-xs text-white/60">SCORE</p>
                <p className="score-value text-xl sm:text-2xl font-bold text-white">{randomArray.length > 0 ? randomArray.length - 1 : 0}</p>
              </div>
            </div>

            {/* Game board */}
            <div className="board-container p-4 bg-white/5 rounded-xl">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-[500px] mx-auto">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    id={color.id}
                    onClick={() => handleColorClick(color.id)}
                    disabled={!gameActive || gameOver || !gameStarted}
                    style={getGlowStyle(color)}
                    className={`color-button aspect-square w-full max-w-[140px] mx-auto rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${color.bg} ${color.hoverBg} ${activeColor === color.id ? 'border-white scale-105' : 'border-white/10'} ${(!gameActive || gameOver || !gameStarted) ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                  >
                    <div className="glass-reflection absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-20"></div>
                    <div className="inner-shadow absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent"></div>
                    <div className="corner-accent top-left absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/30 rounded-tl-lg"></div>
                    <div className="corner-accent bottom-right absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Control section */}
            <div className="control-section flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10">
              <div className="status-container flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <div className={`status-dot w-2 h-2 rounded-full ${!gameActive && gameStarted && !gameOver ? 'bg-yellow-400 animate-pulse' : gameActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <p className="status-text text-white/90 text-sm font-medium">
                    {!gameStarted ? 'Click Start to begin' : 
                     !gameActive && !gameOver ? 'Watching sequence...' : 
                     gameActive ? `click ${randomArray.length} color${randomArray.length > 1 ? 's' : ''} that blinked` : 
                     gameOver ? 'Game Over' : 'Ready'}
                  </p>
                  <p className="level-text text-white/50 text-xs ml-auto">Lv.{randomArray.length}</p>
                </div>
              </div>

              <button
                onClick={startGame}
                className="start-game-button w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <span>▶</span> {randomArray.length > 0 ? 'New Game' : 'Start'}
              </button>
            </div>
            
            <div className="score-info mt-3 pt-3 text-center border-t border-white/5">
              <p className="score-info-text text-white/40 text-xs">
                Score = Colors remembered • {randomArray.length > 0 ? randomArray.length - 1 : 0} {randomArray.length - 1 === 1 ? 'color' : 'colors'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Desktop */}
        <div className="right-column hidden lg:block">
          <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="icon-container w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">🏆</div>
                <h2 className="text-white font-semibold text-lg">Leaderboard</h2>
              </div>
              <button onClick={() => {
                setPlayers([]);
                localStorage.removeItem('simonPlayers');
              }} className="reset-button p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition" title="Reset everything">↻</button>
            </div>
            
            <div className="leaderboard-list flex-1 overflow-y-auto pr-1 max-h-[400px]">
              {players.length > 0 ? (
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div key={player.id} className={`rank-item flex items-center gap-3 p-3 rounded-lg border ${getRankStyle(index)}`}>
                      <div className="rank-icon w-8 h-8 rounded-full bg-black/20 flex items-center justify-center font-bold text-white">{getRankIcon(index)}</div>
                      <div className="player-info flex-1 min-w-0">
                        <p className="player-name-rank text-white font-medium truncate">{player.name}</p>
                        <p className="player-date text-white/40 text-xs">{player.date}</p>
                      </div>
                      <div className="player-score font-bold text-white bg-white/10 px-2 py-1 rounded min-w-[40px] text-center">{player.score}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-leaderboard text-center py-8">
                  <p className="text-white/50">No scores yet</p>
                  <p className="text-white/30 text-xs mt-1">Play a game to appear here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimonGame;