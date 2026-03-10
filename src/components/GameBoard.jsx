import React from 'react';
import { modeMusic } from '../constants/modeMusic';
import { colors } from '../constants/colors';

const colorMap = {
  '1': { bg: '#dc2626', hover: '#ef4444' },
  '2': { bg: '#2563eb', hover: '#3b82f6' },
  '3': { bg: '#16a34a', hover: '#22c55e' },
  '4': { bg: '#374151', hover: '#6b7280' },
};

const modeAccent = {
  quickgame: '#3b82f6',
  easy: '#22c55e',
  hard: '#f5a623',
  king: '#ff5f57',
};

const GameBoard = ({
  playerName, kingBadge, gameStarted, gameActive, gameOver, gameWon,
  randomArray, activeColor, selectedMode, isMuted, toggleMute,
  inactivitySeconds, startGame, handleColorClick, getGlowStyle, selectMode
}) => {
  const accent = modeAccent[selectedMode] || '#00e5c8';

  return (
    <div style={{
      background: '#10131e',
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Share Tech Mono', monospace",
      boxShadow: gameStarted && !gameOver && !gameWon ? `0 0 40px ${accent}15` : 'none',
      transition: 'box-shadow 0.5s ease',
      height: '97%',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>
      {/* Responsive width for mobile */}
      <style>{`
        @media (max-width: 800px) {
          .game-board-container {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Accent top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${accent},transparent)`, transition: 'background 0.3s', zIndex: 1, flexShrink: 0 }} />

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.25)', flexShrink: 0, flexWrap: 'wrap', gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span style={{ fontSize: '16px' }}>🧠</span>
          <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: '13px', letterSpacing: '0.1em', background: 'linear-gradient(135deg,#00e5c8,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MEMORY</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', background: 'rgba(0,229,200,0.06)', border: '1px solid rgba(0,229,200,0.15)', borderRadius: '3px' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>👤</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playerName}</span>
            {kingBadge && <span style={{ fontSize: '10px' }}>👑</span>}
          </div>

          {gameStarted && !gameOver && !gameWon && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: '3px' }}>
              <span style={{ color: '#f5a623', fontSize: '11px' }}>⏱</span>
              <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: '12px', color: '#f5a623' }}>{inactivitySeconds}s</span>
            </div>
          )}

          <button
            onClick={toggleMute}
            style={{ padding: '5px 9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >{isMuted ? '🔇' : '🔊'}</button>
        </div>
      </div>

      {/* ── Mode selector ── */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '5px', flexWrap: 'wrap', flexShrink: 0 }}>
        {Object.entries(modeMusic).map(([key, mode]) => {
          const isActive = selectedMode === key;
          const ma = modeAccent[key] || '#00e5c8';
          const disabled = gameStarted && !gameOver && !gameWon;
          return (
            <button
              key={key}
              onClick={() => selectMode(key)}
              disabled={disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px',
                background: isActive ? `${ma}18` : 'rgba(0,0,0,0.2)',
                border: `1px solid ${isActive ? ma : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '3px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled && !isActive ? 0.4 : 1,
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '12px' }}>{mode.icon}</span>
              <span style={{ color: isActive ? ma : 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: "'Orbitron',monospace", fontWeight: 700, letterSpacing: '0.04em' }}>{mode.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── Color grid — FIXED: removed aspect ratio constraint that caused clicking issues ── */}
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        padding: '12px 14px', 
        background: 'rgba(0,0,0,0.15)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          width: '100%',
          maxWidth: '380px',
          // Removed aspectRatio constraint that was causing clicking issues
        }}>
          {colors.map((color) => {
            const cm = colorMap[color.id] || {};
            const isActive = activeColor === color.id;
            const glowStyle = getGlowStyle(color);
            const canClick = gameActive && !gameOver && !gameWon && gameStarted;
            return (
              <button
                key={color.id}
                id={color.id}
                onClick={() => handleColorClick(color.id)}
                disabled={!canClick}
                style={{
                  width: '100%',
                  paddingBottom: '100%', // This creates a perfect square using padding
                  position: 'relative',
                  background: isActive ? cm.hover : cm.bg,
                  border: `2px solid ${isActive ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)'}`,
                  borderRadius: '6px',
                  cursor: canClick ? 'pointer' : 'not-allowed',
                  opacity: !canClick ? 0.75 : 1,
                  transition: 'all 0.1s ease',
                  overflow: 'hidden',
                  transform: isActive ? 'scale(0.98)' : 'scale(1)',
                  ...glowStyle
                }}
              >
                {/* Inner decorative elements - positioned absolutely within the button */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '45%', 
                  background: 'linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 100%)', 
                  borderRadius: '4px 4px 0 0', 
                  pointerEvents: 'none' 
                }} />
                <div style={{ 
                  position: 'absolute', 
                  top: '5px', 
                  left: '5px', 
                  width: '8px', 
                  height: '8px', 
                  borderTop: '1.5px solid rgba(255,255,255,0.25)', 
                  borderLeft: '1.5px solid rgba(255,255,255,0.25)',
                  pointerEvents: 'none' 
                }} />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '5px', 
                  right: '5px', 
                  width: '8px', 
                  height: '8px', 
                  borderBottom: '1.5px solid rgba(255,255,255,0.15)', 
                  borderRight: '1.5px solid rgba(255,255,255,0.15)',
                  pointerEvents: 'none' 
                }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Control bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '130px', padding: '7px 11px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '3px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
            background: !gameActive && gameStarted && !gameOver && !gameWon ? '#f5a623' : gameActive ? '#22c55e' : 'rgba(255,255,255,0.2)',
            boxShadow: gameActive ? '0 0 8px #22c55e' : !gameActive && gameStarted ? '0 0 8px #f5a623' : 'none'
          }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', flex: 1 }}>
            {!gameStarted ? 'Press START' :
              !gameActive && !gameOver && !gameWon ? 'Watching...' :
                gameActive ? `Click ${randomArray.length} color${randomArray.length !== 1 ? 's' : ''}` :
                  gameWon ? 'Victory!' : gameOver ? 'Game Over' : 'Ready'}
          </p>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontFamily: "'Orbitron',monospace", flexShrink: 0 }}>LV{randomArray.length}</span>
        </div>

        <button
          onClick={startGame}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px',
            background: 'transparent', border: `1px solid ${accent}`,
            borderRadius: '3px', color: accent,
            fontFamily: "'Orbitron',monospace", fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.12em', cursor: 'pointer', textTransform: 'uppercase',
            transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}15`; e.currentTarget.style.boxShadow = `0 0 20px ${accent}40`; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          ▶ {randomArray.length > 0 ? 'New Game' : 'Start'}
        </button>
      </div>

      {/* ── Score footer ── */}
      <div style={{ padding: '5px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', flexShrink: 0 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '0.08em' }}>
          Score · {Math.max(0, randomArray.length - 1)} colors remembered
        </p>
      </div>
    </div>
  );
};

export default GameBoard;