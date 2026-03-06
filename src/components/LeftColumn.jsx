import React from 'react';

const LeftColumn = ({ playerName, kingBadge }) => {
  return (
    <div className="left-column hidden lg:block">
      <div className="glass-card h-full backdrop-blur-2xl bg-[#111928]/75 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="icon-container w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">❓</div>
          <h2 className="text-white font-semibold text-lg">How to Play</h2>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="step-text text-purple-400 text-xs font-bold">1</span>
            </div>
            <p className="text-white/70 text-sm">Watch the sequence</p>
          </div>
          <div className="flex gap-3">
            <div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="step-text text-purple-400 text-xs font-bold">2</span>
            </div>
            <p className="text-white/70 text-sm">For every round you must click on the previously blinked colors and the recent one</p>
          </div>
          <div className="flex gap-3">
            <div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="step-text text-purple-400 text-xs font-bold">3</span>
            </div>
            <p className="text-white/70 text-sm">Each correct round adds one color</p>
          </div>
          <div className="flex gap-3">
            <div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="step-text text-purple-400 text-xs font-bold">4</span>
            </div>
            <p className="text-white/70 text-sm">Wrong click = game over</p>
          </div>
        </div>
        <div className="player-info-container mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="player-avatar w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-lg">{playerName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-white/50 text-xs">Current Player</p>
              <div className="flex items-center gap-1">
                <p className="text-white font-semibold">{playerName}</p>
                {kingBadge && <span className="text-yellow-400 text-sm">👑</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;