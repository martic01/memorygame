import React from 'react';

const MobileFloatingButtons = ({
  showLeftOverlay, showRightOverlay,
  setShowLeftOverlay, setShowRightOverlay,
  toggleMute, isMuted, closeOverlays,
  kingBadge, players, getRankStyle, getRankIcon
}) => {
  const rankColors = {
    'rank-first': { border:'rgba(245,166,35,0.4)', bg:'rgba(245,166,35,0.06)' },
    'rank-second': { border:'rgba(180,180,180,0.3)', bg:'rgba(180,180,180,0.04)' },
    'rank-third': { border:'rgba(180,120,80,0.3)', bg:'rgba(180,120,80,0.05)' },
  };

  const floatBtnStyle = {
    width:'44px', height:'44px', borderRadius:'50%',
    background:'rgba(13,15,24,0.9)', backdropFilter:'blur(12px)',
    border:'1px solid rgba(255,255,255,0.12)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'18px', cursor:'pointer', transition:'all 0.2s',
    boxShadow:'0 4px 20px rgba(0,0,0,0.4)'
  };

  const overlayStyle = (show, side) => ({
    position:'fixed', top:0, [side]:0,
    width:'82%', maxWidth:'320px', height:'100vh',
    zIndex:50, transition:'transform 0.3s ease',
    transform: show ? 'translateX(0)' : side === 'left' ? 'translateX(-100%)' : 'translateX(100%)',
    background:'#0d0f18', borderRight: side === 'left' ? '1px solid rgba(255,255,255,0.08)' : 'none',
    borderLeft: side === 'right' ? '1px solid rgba(255,255,255,0.08)' : 'none',
    display:'flex', flexDirection:'column', fontFamily:"'Share Tech Mono',monospace"
  });

  return (
    <>
      {/* FABs */}
      <div className='gamer' style={{position:'fixed',right:'12px',top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',gap:'10px',zIndex:30}}>
         <style>{`
      @media (min-width: 800px) {
        .gamer {
         display:none !important;
        }
      }
    `}</style>
        {[
          { icon:'❓', onClick: () => setShowLeftOverlay(true) },
          { icon:'🏆', onClick: () => setShowRightOverlay(true) },
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick} style={floatBtnStyle}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(0,229,200,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}
          >{btn.icon}</button>
        ))}
      </div>

      {/* HOW TO PLAY overlay */}
      <div className="lg:hidden" style={overlayStyle(showLeftOverlay, 'left')}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.3)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
            <span style={{fontSize:'14px'}}>❓</span>
            <span style={{fontFamily:"'Orbitron',monospace",fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',color:'#00e5c8'}}>HOW TO PLAY</span>
          </div>
          <button onClick={closeOverlays} style={{padding:'5px 9px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'2px',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:'11px'}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'16px',scrollbarWidth:'thin'}}>
          {/* Rules */}
          <div style={{marginBottom:'18px'}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:700,letterSpacing:'0.2em',color:'rgba(255,255,255,0.2)',textTransform:'uppercase',marginBottom:'8px'}}>Basic Rules</div>
            {['Watch the color sequence','Repeat in the same order','Each round adds one color','Wrong click = game over'].map((t,i) => (
              <div key={i} style={{display:'flex',gap:'9px',alignItems:'flex-start',marginBottom:'7px'}}>
                <div style={{width:'18px',height:'18px',background:'rgba(0,229,200,0.1)',border:'1px solid rgba(0,229,200,0.3)',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:700,color:'#00e5c8'}}>{i+1}</span>
                </div>
                <p style={{color:'rgba(255,255,255,0.55)',fontSize:'11px',lineHeight:1.5}}>{t}</p>
              </div>
            ))}
          </div>
          {/* Modes */}
          <div style={{marginBottom:'18px'}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:700,letterSpacing:'0.2em',color:'rgba(255,255,255,0.2)',textTransform:'uppercase',marginBottom:'8px'}}>Game Modes</div>
            {[
              {icon:'⚡',name:'Quick Game',desc:'Endless loop · Play until mistake',accent:'59,130,246'},
              {icon:'😎',name:'Easy Mode',desc:'5 songs · Win before song ends',accent:'34,197,94'},
              {icon:'😇',name:'Hard Mode',desc:'2 songs · Beat the music',accent:'245,166,35'},
              {icon:'👑',name:'King Mode',desc:'2 songs · Earn the crown badge',accent:'255,95,87'},
            ].map((m,i) => (
              <div key={i} style={{background:`rgba(${m.accent},0.06)`,border:`1px solid rgba(${m.accent},0.2)`,borderRadius:'3px',padding:'9px 11px',marginBottom:'6px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'3px'}}>
                  <span style={{fontSize:'13px'}}>{m.icon}</span>
                  <span style={{fontFamily:"'Orbitron',monospace",fontSize:'10px',fontWeight:700,color:`rgb(${m.accent})`,letterSpacing:'0.05em'}}>{m.name}</span>
                </div>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px'}}>{m.desc}</p>
              </div>
            ))}
          </div>
          {/* Timer */}
          <div>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:700,letterSpacing:'0.2em',color:'rgba(255,255,255,0.2)',textTransform:'uppercase',marginBottom:'8px'}}>Timer</div>
            <div style={{background:'rgba(245,166,35,0.06)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:'3px',padding:'10px 12px'}}>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:'10px',marginBottom:'6px'}}>⏱ 20s timer, resets on each click</p>
              <div style={{background:'rgba(255,95,87,0.08)',border:'1px solid rgba(255,95,87,0.2)',borderRadius:'2px',padding:'7px 9px'}}>
                <p style={{color:'#ff5f57',fontSize:'10px',fontFamily:"'Orbitron',monospace",marginBottom:'4px'}}>⚠ WARNING</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px'}}>Timeout → warning modal<br/>2nd timeout → game quits</p>
              </div>
            </div>
          </div>
          {kingBadge && (
            <div style={{marginTop:'14px',background:'rgba(245,166,35,0.08)',border:'1px solid rgba(245,166,35,0.3)',borderRadius:'3px',padding:'10px',textAlign:'center'}}>
              <span style={{color:'#f5a623',fontSize:'12px',fontFamily:"'Orbitron',monospace"}}>👑 KING STATUS ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* LEADERBOARD overlay */}
      <div className="lg:hidden" style={overlayStyle(showRightOverlay, 'right')}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.3)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
            <span style={{fontSize:'14px'}}>🏆</span>
            <span style={{fontFamily:"'Orbitron',monospace",fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',color:'#f5a623'}}>LEADERBOARD</span>
          </div>
          <button onClick={closeOverlays} style={{padding:'5px 9px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'2px',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:'11px'}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'12px',scrollbarWidth:'thin'}}>
          {players && players.length > 0 ? (
            <div>
              {players.map((player, index) => {
                const s = rankColors[getRankStyle ? getRankStyle(index) : ''] || {};
                return (
                  <div key={player.id} style={{
                    display:'flex',alignItems:'center',gap:'10px',
                    padding:'9px 11px',borderRadius:'3px',marginBottom:'6px',
                    background:s.bg||'rgba(0,0,0,0.2)', border:`1px solid ${s.border||'rgba(255,255,255,0.07)'}`
                  }}>
                    <div style={{width:'26px',height:'26px',borderRadius:'50%',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:index<3?'13px':'10px',fontFamily:"'Orbitron',monospace",fontWeight:700,color:'rgba(255,255,255,0.6)',flexShrink:0}}>
                      {getRankIcon ? getRankIcon(index) : index + 1}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                        <p style={{color:'rgba(255,255,255,0.8)',fontSize:'12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'80px'}}>{player.name}</p>
                        {player.kingBadge && <span style={{fontSize:'10px'}}>👑</span>}
                        <span style={{color:'rgba(255,255,255,0.25)',fontSize:'9px'}}>{player.mode}</span>
                      </div>
                      <p style={{color:'rgba(255,255,255,0.25)',fontSize:'9px'}}>{player.date}</p>
                    </div>
                    <div style={{padding:'4px 8px',background:'rgba(0,229,200,0.08)',border:'1px solid rgba(0,229,200,0.2)',borderRadius:'2px',fontFamily:"'Orbitron',monospace",fontWeight:700,color:'#00e5c8',fontSize:'13px',minWidth:'34px',textAlign:'center'}}>
                      {player.score}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'40px 20px'}}>
              <div style={{fontSize:'28px',marginBottom:'10px',opacity:0.2}}>🏆</div>
              <p style={{color:'rgba(255,255,255,0.3)',fontSize:'12px'}}>No scores yet</p>
              <p style={{color:'rgba(255,255,255,0.15)',fontSize:'10px',marginTop:'4px'}}>Play a game to appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {(showLeftOverlay || showRightOverlay) && (
        <div className="lg:hidden" onClick={closeOverlays} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',zIndex:40}} />
      )}
    </>
  );
};

export default MobileFloatingButtons;
