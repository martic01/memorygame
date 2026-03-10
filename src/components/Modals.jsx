import React from 'react';
import { modeMusic } from '../constants/modeMusic';

const ModalWrapper = ({ children }) => (
  <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:70,padding:'16px'}}>
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(6px)'}} />
    <div className="animate-slideIn" style={{position:'relative',width:'100%',maxWidth:'400px'}}>
      {children}
    </div>
  </div>
);

const modalBase = {
  background:'#0d0f18', borderRadius:'4px', padding:'36px 32px',
  fontFamily:"'Share Tech Mono', monospace", position:'relative', overflow:'hidden'
};

const Btn = ({ onClick, accent, children }) => {
  const colors = {
    teal: { bg:'rgba(0,229,200,0.08)', border:'rgba(0,229,200,0.4)', color:'#00e5c8', hover:'rgba(0,229,200,0.15)' },
    red:  { bg:'rgba(255,95,87,0.08)',  border:'rgba(255,95,87,0.4)',  color:'#ff5f57', hover:'rgba(255,95,87,0.15)' },
    amber:{ bg:'rgba(245,166,35,0.08)', border:'rgba(245,166,35,0.4)', color:'#f5a623', hover:'rgba(245,166,35,0.15)' },
    gray: { bg:'rgba(160,160,160,0.08)', border:'rgba(160,160,160,0.4)', color:'#a0a0a0', hover:'rgba(160,160,160,0.15)' },
  }[accent] || {};
  return (
    <button
      onClick={onClick}
      style={{
        width:'100%', padding:'12px', background:colors.bg, border:`1px solid ${colors.border}`,
        borderRadius:'3px', color:colors.color, fontFamily:"'Orbitron',monospace",
        fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', cursor:'pointer',
        textTransform:'uppercase', transition:'all 0.2s'
      }}
      onMouseEnter={e => { e.currentTarget.style.background=colors.hover; e.currentTarget.style.boxShadow=`0 0 20px ${colors.border}`; }}
      onMouseLeave={e => { e.currentTarget.style.background=colors.bg; e.currentTarget.style.boxShadow='none'; }}
    >{children}</button>
  );
};

export const WarningModal = ({ show, onContinue, onQuit }) => {
  if (!show) return null;
  return (
    <ModalWrapper>
      <div style={{...modalBase, border:'1px solid rgba(245,166,35,0.4)', boxShadow:'0 0 60px rgba(245,166,35,0.1)'}}>
        <div style={{position:'absolute',top:0,left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,#f5a623,transparent)'}} />
        <div style={{textAlign:'center'}}>
          <div style={{width:'64px',height:'64px',margin:'0 auto 20px',background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.4)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>⚠️</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'20px',fontWeight:900,color:'#f5a623',letterSpacing:'0.1em',marginBottom:'10px'}}>WARNING</h2>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'12px',lineHeight:1.7,marginBottom:'24px'}}>
            Idle timeout detected. This is your last warning.<br/>Play or the session will be terminated.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <Btn onClick={onContinue} accent="teal">▶ Continue Playing</Btn>
            <Btn onClick={onQuit} accent="red">✕ Quit Match</Btn>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const VictoryModal = ({ show, selectedMode, score, onPlayAgain }) => {
  if (!show) return null;
  const isKing = selectedMode === 'king';
  return (
    <ModalWrapper>
      <div style={{...modalBase, border:`2px solid ${isKing?'#f5a623':'#00e5c8'}`, boxShadow:`0 0 80px ${isKing?'rgba(245,166,35,0.2)':'rgba(0,229,200,0.15)'}`}}>
        <div style={{position:'absolute',top:0,left:'20px',right:'20px',height:'2px',background:`linear-gradient(90deg,transparent,${isKing?'#f5a623':'#00e5c8'},transparent)`}} />
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'12px'}}>{isKing ? '👑' : '🏆'}</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'24px',fontWeight:900,color:isKing?'#f5a623':'#00e5c8',letterSpacing:'0.1em',marginBottom:'6px'}}>VICTORY</h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'11px',letterSpacing:'0.1em',marginBottom:'4px',textTransform:'uppercase'}}>
            {modeMusic[selectedMode]?.name} cleared
          </p>
          {isKing && <p style={{color:'#f5a623',fontSize:'12px',fontFamily:"'Orbitron',monospace",marginBottom:'4px'}}>KING STATUS UNLOCKED 👑</p>}
          <div style={{
            display:'inline-flex',alignItems:'center',gap:'8px',
            padding:'10px 20px',background:'rgba(0,229,200,0.06)',
            border:'1px solid rgba(0,229,200,0.2)',borderRadius:'3px',margin:'16px 0 24px'
          }}>
            <span style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>SCORE</span>
            <span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'28px',color:'#00e5c8'}}>{score}</span>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:'11px'}}>colors</span>
          </div>
          <Btn onClick={onPlayAgain} accent={isKing?'amber':'teal'}>▶ Play Again</Btn>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const FailureModal = ({ show, selectedMode, score, onPlayAgain }) => {
  if (!show) return null;
  return (
    <ModalWrapper>
      <div style={{...modalBase, border:'1px solid rgba(160,160,160,0.4)', boxShadow:'0 0 60px rgba(160,160,160,0.1)'}}>
        <div style={{position:'absolute',top:0,left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,#a0a0a0,transparent)'}} />
        <div style={{textAlign:'center'}}>
          <div style={{width:'64px',height:'64px',margin:'0 auto 20px',background:'rgba(160,160,160,0.1)',border:'1px solid rgba(160,160,160,0.4)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>⚠️</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'20px',fontWeight:900,color:'#a0a0a0',letterSpacing:'0.1em',marginBottom:'10px'}}>FAILED</h2>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'12px',lineHeight:1.7,marginBottom:'8px'}}>
            {modeMusic[selectedMode]?.name} not cleared
          </p>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'11px',marginBottom:'16px'}}>
            Score too low to win this mode
          </p>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:'8px',
            padding:'10px 20px',background:'rgba(160,160,160,0.06)',
            border:'1px solid rgba(160,160,160,0.2)',borderRadius:'3px',margin:'8px 0 24px'
          }}>
            <span style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>SCORE</span>
            <span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'28px',color:'#a0a0a0'}}>{score}</span>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:'11px'}}>colors</span>
          </div>
          <Btn onClick={onPlayAgain} accent="gray">▶ Try Again</Btn>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const ResumeModal = ({ show, playerName, score, onContinue, onRestart }) => {
  if (!show) return null;
  return (
    <ModalWrapper>
      <div style={{...modalBase, border:'1px solid rgba(59,130,246,0.3)', boxShadow:'0 0 60px rgba(59,130,246,0.08)'}}>
        <div style={{position:'absolute',top:0,left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,#3b82f6,transparent)'}} />
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'36px',marginBottom:'14px'}}>🎮</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'18px',fontWeight:900,color:'rgba(255,255,255,0.9)',letterSpacing:'0.1em',marginBottom:'6px'}}>WELCOME BACK</h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'4px'}}>{playerName}</p>
          <p style={{color:'rgba(255,255,255,0.3)',fontSize:'11px',marginBottom:'8px'}}>Previous session saved</p>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:'8px',
            padding:'8px 18px',background:'rgba(59,130,246,0.08)',
            border:'1px solid rgba(59,130,246,0.2)',borderRadius:'3px',marginBottom:'24px'
          }}>
            <span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'24px',color:'#3b82f6'}}>{score}</span>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:'11px'}}>colors remembered</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <Btn onClick={onContinue} accent="teal">▶ Continue Session</Btn>
            <Btn onClick={onRestart} accent="red">↺ New Game</Btn>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const GameOverModal = ({ show, score, onPlayAgain, onNewPlayer }) => {
  if (!show) return null;
  return (
    <ModalWrapper>
      <div style={{...modalBase, border:'1px solid rgba(255,95,87,0.3)', boxShadow:'0 0 60px rgba(255,95,87,0.08)'}}>
        <div style={{position:'absolute',top:0,left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,#ff5f57,transparent)'}} />
        <div style={{textAlign:'center'}}>
          <div style={{width:'60px',height:'60px',margin:'0 auto 16px',background:'rgba(255,95,87,0.1)',border:'1px solid rgba(255,95,87,0.3)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px'}}>✕</div>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'22px',fontWeight:900,color:'#ff5f57',letterSpacing:'0.12em',marginBottom:'10px'}}>GAME OVER</h2>
          <div style={{
            display:'inline-flex',alignItems:'center',gap:'8px',
            padding:'10px 20px',background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.1)',borderRadius:'3px',marginBottom:'24px'
          }}>
            <span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'32px',color:'rgba(255,255,255,0.9)'}}>{score}</span>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:'11px'}}>colors remembered</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <Btn onClick={onPlayAgain} accent="teal">▶ Try Again</Btn>
            <Btn onClick={onNewPlayer} accent="amber">◈ New Player</Btn>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};