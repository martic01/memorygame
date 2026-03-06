import React from 'react';
import { modeMusic } from '../constants/modeMusic';

export const WarningModal = ({ show, onContinue, onQuit }) => {
  if (!show) return null;

  return (
    <div className="warning-modal fixed inset-0 flex items-center justify-center z-[70] p-4">
      <div className="warning-backdrop absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div className="warning-content relative bg-orange-500/20 backdrop-blur-2xl rounded-2xl p-8 max-w-md w-full border-2 border-orange-400/50 animate-slideIn">
        <div className="text-center">
          <div className="warning-icon w-20 h-20 mx-auto mb-4 bg-orange-500/30 rounded-full flex items-center justify-center border-2 border-orange-400 text-4xl">
            ⚠️
          </div>
          <h2 className="text-3xl font-bold text-orange-300 mb-4">Warning!</h2>
          <p className="text-white/90 text-lg mb-6">
            You are trying to trick me! This is your last warning. Play or quit!
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="warning-button w-full px-6 py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition text-lg"
            >
              Continue Playing
            </button>

            <button
              onClick={onQuit}
              className="warning-button w-full px-6 py-3 bg-gradient-to-r from-red-500/30 to-orange-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition text-lg"
            >
              Quit Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VictoryModal = ({ show, selectedMode, score, onPlayAgain }) => {
  if (!show) return null;

  return (
    <div className="victory-modal fixed inset-0 flex items-center justify-center z-[70] p-4">
      <div className="victory-backdrop absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div className={`victory-content relative backdrop-blur-2xl rounded-2xl p-8 max-w-md w-full border-4 animate-slideIn ${
        selectedMode === 'king' ? 'border-yellow-400 shadow-[0_0_50px_rgba(255,215,0,0.8)]' : 'border-green-400'
      }`}>
        <div className="text-center">
          <div className="victory-icon w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-yellow-500/30 to-purple-500/30 rounded-full flex items-center justify-center border-4 border-yellow-400 text-5xl">
            {selectedMode === 'king' ? '👑' : '🏆'}
          </div>
          <h2 className="text-4xl font-bold text-yellow-300 mb-2">VICTORY!</h2>
          <p className="text-white/80 text-xl mb-2">You conquered {modeMusic[selectedMode].name}!</p>
          {selectedMode === 'king' && (
            <p className="text-yellow-400 font-bold text-lg mb-2">You are now a KING! 👑</p>
          )}
          <p className="text-white/70 text-lg mb-4">
            Score: <span className="text-yellow-400 font-bold text-2xl">{score}</span> colors
          </p>

          <button
            onClick={onPlayAgain}
            className="victory-button w-full px-6 py-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition text-lg"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export const ResumeModal = ({ show, playerName, score, onContinue, onRestart }) => {
  if (!show) return null;

  return (
    <div className="resume-prompt-overlay fixed inset-0 flex items-center justify-center z-[60] p-4">
      <div className="resume-backdrop absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div className="resume-content relative bg-white/10 backdrop-blur-2xl rounded-2xl p-8 max-w-md w-full border border-white/30 animate-slideIn">
        <div className="text-center">
          <div className="resume-icon w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center border-2 border-white/50 text-4xl">
            🎮
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-white/70 text-lg mb-2">{playerName}</p>
          <p className="text-white/50 text-sm mb-6">
            You had a score of <span className="text-yellow-400 font-bold text-xl">{score}</span> colors remembered
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="resume-button w-full px-6 py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition text-lg"
            >
              Continue Game
            </button>

            <button
              onClick={onRestart}
              className="restart-button w-full px-6 py-3 bg-gradient-to-r from-red-500/30 to-orange-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition text-lg"
            >
              Start New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GameOverModal = ({ show, score, onPlayAgain, onNewPlayer }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="modal-content relative bg-white/10 backdrop-blur-2xl rounded-2xl p-6 max-w-sm w-full border border-white/30 animate-slideIn">
        <div className="text-center">
          <div className="modal-icon w-16 h-16 mx-auto mb-3 bg-red-500/30 rounded-full flex items-center justify-center border-2 border-red-400/50 text-red-300 text-2xl">✕</div>
          <h2 className="modal-title text-2xl font-bold text-white mb-1">Game Over</h2>
          <p className="modal-score text-3xl font-bold text-white mb-2">{score}</p>
          <p className="modal-score-label text-white/70 text-sm mb-4">colors remembered</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onPlayAgain}
              className="modal-button w-full px-5 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition"
            >
              Play Again
            </button>

            <button
              onClick={onNewPlayer}
              className="modal-button w-full px-5 py-2 bg-gradient-to-r from-green-500/30 to-teal-500/30 text-white font-semibold rounded-xl border border-white/30 hover:scale-105 transition"
            >
              New Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};