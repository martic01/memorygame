import React from 'react';
import { modeMusic } from '../constants/modeMusic';
import { colors } from '../constants/colors';

const GameBoard = ({
  playerName,
  kingBadge,
  gameStarted,
  gameActive,
  gameOver,
  gameWon,
  randomArray,
  activeColor,
  selectedMode,
  isMuted,
  toggleMute,
  inactivitySeconds,
  startGame,
  handleColorClick,
  getGlowStyle,
  selectMode
}) => {
  return (
    <div className={`glass-card game-board-card backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-4 sm:p-6 border-2 ${
      modeMusic[selectedMode]?.theme || 'border-white/10'
    }`}>
      {/* Top Bar - Desktop */}
      <div className="flex items-center w-full justify-between mb-4 pb-4 border-b border-white/10">
        <div className="logo-container px-2 py-2 bg-white/5 rounded-xl border border-white/20">
          <h1 className="game-title-small font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">🧠Memory🧠</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="player-badge px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">👤</span>
              <p className="player-name text-white font-semibold text-sm sm:text-base max-w-[120px] truncate">{playerName}</p>
              {kingBadge && <span className="text-yellow-400 text-sm">👑</span>}
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="px-3 py-2 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition text-lg"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Timer - Desktop */}
          {gameStarted && !gameOver && !gameWon && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <span className="text-yellow-400">⏱️</span>
              <span className="text-white font-bold">{inactivitySeconds}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
          {Object.entries(modeMusic).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => selectMode(key)}
              disabled={gameStarted && !gameOver && !gameWon}
              className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                selectedMode === key
                  ? `${mode.theme} bg-white/20 scale-105`
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } ${(gameStarted && !gameOver && !gameWon) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{mode.icon}</span>
                <span className="text-white text-sm font-medium hidden sm:inline">{mode.name}</span>
              </span>
            </button>
          ))}
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
              disabled={!gameActive || gameOver || gameWon || !gameStarted}
              style={getGlowStyle(color)}
              className={`color-button aspect-square w-full max-w-[140px] mx-auto rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${color.bg} ${color.hoverBg} ${activeColor === color.id ? 'border-white scale-105' : 'border-white/10'} ${(!gameActive || gameOver || gameWon || !gameStarted) ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
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
            <div className={`status-dot w-2 h-2 rounded-full ${!gameActive && gameStarted && !gameOver && !gameWon ? 'bg-yellow-400 animate-pulse' : gameActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <p className="status-text text-white/90 text-sm font-medium">
              {!gameStarted ? 'Click Start to begin' :
                !gameActive && !gameOver && !gameWon ? 'Watching sequence...' :
                  gameActive ? `click ${randomArray.length} color${randomArray.length > 1 ? 's' : ''} that blinked` :
                    gameWon ? 'Victory!' :
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
  );
};

export default GameBoard;