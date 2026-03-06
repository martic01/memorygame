import React, { useRef } from 'react';

const NameScreen = ({ playerName, setPlayerName, handleNameSubmit }) => {
  const nameInputRef = useRef(null);

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
            <button type="submit" className="start-button w-full p-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition">
              Start Playing
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/30 text-xs">Test your memory • Follow the sequence • Beat your high score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameScreen;