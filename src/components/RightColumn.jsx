import React from 'react';

const RightColumn = ({ players, setPlayers, getRankStyle, getRankIcon }) => {
  return (
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
                    <div className="flex items-center gap-1">
                      <p className="player-name-rank text-white font-medium truncate">{player.name}</p>
                      {player.kingBadge && <span className="text-yellow-400 text-xs">👑</span>}
                      <span className="text-white/40 text-xs ml-1">({player.mode})</span>
                    </div>
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
  );
};

export default RightColumn;