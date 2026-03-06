import React from 'react';

const MobileFloatingButtons = ({ 
  showLeftOverlay, 
  showRightOverlay, 
  setShowLeftOverlay, 
  setShowRightOverlay, 
  toggleMute, 
  isMuted,
  closeOverlays 
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
            <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">2</span></div><p className="text-white/70 text-sm">For every round you must click on the previously blinked colors and the recent one</p></div>
            <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">3</span></div><p className="text-white/70 text-sm">Each correct round adds one color</p></div>
            <div className="flex gap-3"><div className="step-number w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="step-text text-purple-400 text-xs font-bold">4</span></div><p className="text-white/70 text-sm">Wrong click = game over!</p></div>
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