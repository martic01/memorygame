import React from 'react';

const MobileFloatingButtons = ({ 
  showLeftOverlay, 
  showRightOverlay, 
  setShowLeftOverlay, 
  setShowRightOverlay, 
  toggleMute, 
  isMuted,
  closeOverlays,
  kingBadge,
  players,
  getRankStyle,
  getRankIcon
}) => {
  return (
    <>
      <div className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        <button
          onClick={() => setShowLeftOverlay(true)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg hover:bg-white/20 transition"
          title="How to Play"
        >
          ❓
        </button>
        <button
          onClick={() => setShowRightOverlay(true)}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg hover:bg-white/20 transition"
          title="Leaderboard"
        >
          🏆
        </button>
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg hover:bg-white/20 transition"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Mobile Overlay - How to Play */}
      <div className={`mobile-overlay fixed top-0 w-[85%] max-w-sm h-screen z-50 transition-transform duration-300 p-4 ${showLeftOverlay ? 'active translate-x-0' : '-translate-x-full'} left-0`}>
        <div className="overlay-header flex justify-end mb-4">
          <button onClick={closeOverlays} className="close-overlay p-2 bg-white/10 rounded-full border border-white/10 text-white">✕</button>
        </div>
        <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4 sticky top-0 bg-[#111928]/90 backdrop-blur-sm pt-2 pb-2 -mt-2 z-10">
            <div className="icon-container w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">❓</div>
            <h2 className="text-white font-semibold text-lg">How to Play</h2>
          </div>
          
          <div className="space-y-4 pb-4">
            {/* Basic Rules */}
            <div>
              <h3 className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">Basic Rules</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="step-text text-purple-400 text-[10px] font-bold">1</span>
                  </div>
                  <p className="text-white/70 text-xs">Watch the sequence of colors</p>
                </div>
                <div className="flex gap-2">
                  <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="step-text text-purple-400 text-[10px] font-bold">2</span>
                  </div>
                  <p className="text-white/70 text-xs">Click previously blinked colors + new one</p>
                </div>
                <div className="flex gap-2">
                  <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="step-text text-purple-400 text-[10px] font-bold">3</span>
                  </div>
                  <p className="text-white/70 text-xs">Each correct round adds one color</p>
                </div>
                <div className="flex gap-2">
                  <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="step-text text-purple-400 text-[10px] font-bold">4</span>
                  </div>
                  <p className="text-white/70 text-xs">Wrong click = game over!</p>
                </div>
              </div>
            </div>

            {/* Game Modes */}
            <div>
              <h3 className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">Game Modes</h3>
              <div className="space-y-2">
                {/* Quick Game */}
                <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-400/30">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base">⚡</span>
                    <span className="text-white font-semibold text-xs">Quick Game</span>
                  </div>
                  <p className="text-white/60 text-[10px]">Endless looping • Play until mistake</p>
                </div>

                {/* Easy Mode */}
                <div className="bg-green-500/10 rounded-lg p-2 border border-green-400/30">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base">😎</span>
                    <span className="text-white font-semibold text-xs">Easy Mode</span>
                  </div>
                  <p className="text-white/60 text-[10px]">5 songs • Win before song ends</p>
                </div>

                {/* Hard Mode */}
                <div className="bg-orange-500/10 rounded-lg p-2 border border-orange-400/30">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base">😇</span>
                    <span className="text-white font-semibold text-xs">Hard Mode</span>
                  </div>
                  <p className="text-white/60 text-[10px]">2 intense songs • Beat the music</p>
                </div>

                {/* King Mode */}
                <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-400/30">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base">👑</span>
                    <span className="text-white font-semibold text-xs">King Mode</span>
                  </div>
                  <p className="text-white/60 text-[10px]">2 epic songs • Win to earn 👑 badge</p>
                </div>
              </div>
            </div>

            {/* How to Win */}
            <div>
              <h3 className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">How to Win</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2 border border-purple-400/30">
                <p className="text-white/70 text-[10px] mb-1">Easy/Hard/King modes:</p>
                <ul className="space-y-1 text-white/60 text-[10px]">
                  <li className="flex items-start gap-1">
                    <span className="text-green-400">✓</span>
                    <span>Complete all sequences</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-green-400">✓</span>
                    <span>Song plays to the end</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-green-400">✓</span>
                    <span>No mistakes</span>
                  </li>
                </ul>
                <p className="text-white/60 text-[10px] mt-1">Quick Game: No win condition</p>
              </div>
            </div>

            {/* Timer System */}
            <div>
              <h3 className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">⏱️ Timer</h3>
              <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-400/30">
                <ul className="space-y-1 text-white/60 text-[10px] mb-2">
                  <li className="flex items-start gap-1">
                    <span className="text-yellow-400">⏱️</span>
                    <span>20s timer, resets on click</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-yellow-400">⏱️</span>
                    <span>Timeout = 1 warning</span>
                  </li>
                </ul>
                <div className="p-1.5 bg-orange-500/20 rounded-lg border border-orange-400/30">
                  <p className="text-orange-300 text-[10px] font-semibold mb-1">⚠️ Warning:</p>
                  <ul className="space-y-1 text-white/60 text-[10px]">
                    <li className="flex items-start gap-1">
                      <span className="text-orange-400">1st</span>
                      <span>Warning modal appears</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-orange-400">2nd</span>
                      <span>Game quits, no score</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* King Badge (conditional) */}
            {kingBadge && (
              <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-400/30 text-center">
                <span className="text-yellow-400 text-sm">👑</span>
                <span className="text-yellow-400 text-xs ml-1">You are a King!</span>
              </div>
            )}

            {/* Tip */}
            <p className="text-white/30 text-[8px] text-center py-2">
              💡 Tip: Watch the timer!
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay - Leaderboard */}
      <div className={`mobile-overlay fixed top-0 w-[85%] max-w-sm h-screen z-50 transition-transform duration-300 p-4 ${showRightOverlay ? 'active translate-x-0' : 'translate-x-full'} right-0`}>
        <div className="overlay-header flex justify-end mb-4">
          <button onClick={closeOverlays} className="close-overlay p-2 bg-white/10 rounded-full border border-white/10 text-white">✕</button>
        </div>
        <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#111928]/90 backdrop-blur-sm pt-2 pb-2 -mt-2 z-10">
            <div className="flex items-center gap-2">
              <div className="icon-container w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">🏆</div>
              <h2 className="text-white font-semibold text-lg">Leaderboard</h2>
            </div>
          </div>
          
          {/* Leaderboard Content */}
          <div className="leaderboard-list flex-1 overflow-y-auto pr-1">
            {players && players.length > 0 ? (
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={player.id} className={`rank-item flex items-center gap-3 p-3 rounded-lg border ${getRankStyle ? getRankStyle(index) : ''}`}>
                    <div className="rank-icon w-8 h-8 rounded-full bg-black/20 flex items-center justify-center font-bold text-white">
                      {getRankIcon ? getRankIcon(index) : index + 1}
                    </div>
                    <div className="player-info flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="player-name-rank text-white font-medium truncate text-sm">{player.name}</p>
                        {player.kingBadge && <span className="text-yellow-400 text-xs">👑</span>}
                        <span className="text-white/40 text-[10px] ml-1">({player.mode})</span>
                      </div>
                      <p className="player-date text-white/40 text-[10px]">{player.date}</p>
                    </div>
                    <div className="player-score font-bold text-white bg-white/10 px-2 py-1 rounded min-w-[35px] text-center text-sm">
                      {player.score}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-leaderboard text-center py-8">
                <p className="text-white/50 text-sm">No scores yet</p>
                <p className="text-white/30 text-xs mt-1">Play a game to appear here!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {(showLeftOverlay || showRightOverlay) && (
        <div className="overlay-backdrop fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={closeOverlays}></div>
      )}
    </>
  );
};

export default MobileFloatingButtons;