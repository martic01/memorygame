import React from 'react';

const LeftColumn = ({ playerName, kingBadge }) => {
  return (
    <>
      {/* Desktop Version */}
      <div className="left-column hidden lg:block h-[calc(100vh-120px)] sticky top-6">
        <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4 sticky top-0 bg-[#111928]/90 backdrop-blur-sm pt-2 pb-2 -mt-2 z-10">
            <div className="icon-container w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">❓</div>
            <h2 className="text-white font-semibold text-lg">How to Play</h2>
          </div>
          
          {/* Basic Rules */}
          <div className="mb-4">
            <h3 className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">Basic Rules</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="step-text text-purple-400 text-[10px] font-bold">1</span>
                </div>
                <p className="text-white/70 text-xs">Watch the sequence</p>
              </div>
              <div className="flex gap-2">
                <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="step-text text-purple-400 text-[10px] font-bold">2</span>
                </div>
                <p className="text-white/70 text-xs">Repeat in same order</p>
              </div>
              <div className="flex gap-2">
                <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="step-text text-purple-400 text-[10px] font-bold">3</span>
                </div>
                <p className="text-white/70 text-xs">Each round adds one color</p>
              </div>
              <div className="flex gap-2">
                <div className="step-number w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="step-text text-purple-400 text-[10px] font-bold">4</span>
                </div>
                <p className="text-white/70 text-xs">Wrong click = game over</p>
              </div>
            </div>
          </div>

          {/* Game Modes - Compact */}
          <div className="mb-4">
            <h3 className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">Game Modes</h3>
            <div className="space-y-2">
              {/* Quick Game */}
              <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-400/30">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-base">⚡</span>
                  <span className="text-white font-semibold text-xs">Quick Game</span>
                </div>
                <p className="text-white/60 text-[10px] leading-relaxed">
                  Endless looping music. Play until mistake.
                </p>
              </div>

              {/* Easy Mode */}
              <div className="bg-green-500/10 rounded-lg p-2 border border-green-400/30">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-base">😎</span>
                  <span className="text-white font-semibold text-xs">Easy Mode</span>
                </div>
                <p className="text-white/60 text-[10px] leading-relaxed">
                  5 songs • Win by completing sequence before song ends
                </p>
              </div>

              {/* Hard Mode */}
              <div className="bg-orange-500/10 rounded-lg p-2 border border-orange-400/30">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-base">😇</span>
                  <span className="text-white font-semibold text-xs">Hard Mode</span>
                </div>
                <p className="text-white/60 text-[10px] leading-relaxed">
                  2 intense songs • Beat sequence before music stops
                </p>
              </div>

              {/* King Mode */}
              <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-400/30">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-base">👑</span>
                  <span className="text-white font-semibold text-xs">King Mode</span>
                </div>
                <p className="text-white/60 text-[10px] leading-relaxed">
                  2 epic songs • Win to earn 👑 King Badge
                </p>
                {kingBadge && (
                  <div className="mt-1 text-yellow-400 text-[10px] flex items-center gap-1">
                    <span>👑</span>
                    <span>You are a King!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* How to Win - Compact */}
          <div className="mb-4">
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
              <p className="text-white/60 text-[10px] mt-1">
                Quick Game: No win condition - endless!
              </p>
            </div>
          </div>

          {/* Timer System - Compact */}
          <div className="mb-4">
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
                    <span className="text-orange-400">1</span>
                    <span>Warning modal appears</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-orange-400">2</span>
                    <span>Game quits, no score saved</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Player Info - Sticky at bottom */}
          <div className="sticky bottom-0 bg-[#111928]/90 backdrop-blur-sm pt-3 pb-1 -mb-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="player-avatar w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-sm">{playerName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/50 text-[10px]">Current Player</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <p className="text-white font-semibold text-xs truncate max-w-[100px]">{playerName}</p>
                  {kingBadge && (
                    <>
                      <span className="text-yellow-400 text-xs">👑</span>
                      <span className="text-yellow-400 text-[8px]">King</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="text-white/30 text-[8px] text-center mt-2">
              💡 Watch the timer!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftColumn;