import React from 'react';

const RightColumn = ({ players, setPlayers, getRankStyle, getRankIcon }) => {
  const rankColors = {
    'rank-first': { border:'rgba(245,166,35,0.4)', bg:'rgba(245,166,35,0.06)', color:'#f5a623' },
    'rank-second': { border:'rgba(180,180,180,0.3)', bg:'rgba(180,180,180,0.04)', color:'rgba(200,200,200,0.8)' },
    'rank-third': { border:'rgba(180,120,80,0.3)', bg:'rgba(180,120,80,0.05)', color:'rgba(180,120,80,0.9)' },
  };

  return (
    <>
      {/* Use Tailwind classes for responsive behavior */}
      <div className="hidden lg:block" style={{
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px'
      }}>
        {/* Add CSS to ensure Tailwind classes work with inline styles */}
        <style>{`
          @media (max-width: 800px) {
            .hidden.lg\\:block {
              display: none !important;
            }
          }
        `}</style>
        
        <div style={{
          height:'100%', background:'#10131e', border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:'4px', display:'flex', flexDirection:'column', overflow:'hidden',
          position:'relative'
        }}>
          <div style={{position:'absolute',top:0,left:'16px',right:'16px',height:'1px',background:'linear-gradient(90deg,transparent,rgba(245,166,35,0.5),transparent)'}} />
          
          {/* Header */}
          <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(0,0,0,0.2)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
              <div style={{width:'26px',height:'26px',background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.25)',borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px'}}>🏆</div>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',color:'#f5a623',textTransform:'uppercase'}}>Leaderboard</span>
            </div>
            <button
              onClick={() => { setPlayers([]); localStorage.removeItem('simonPlayers'); }}
              style={{
                padding:'5px 10px', background:'rgba(255,95,87,0.08)',
                border:'1px solid rgba(255,95,87,0.2)', borderRadius:'2px',
                color:'rgba(255,95,87,0.7)', fontSize:'11px', cursor:'pointer',
                fontFamily:"'Share Tech Mono',monospace", transition:'all 0.2s'
              }}
              onMouseEnter={e => { e.target.style.background='rgba(255,95,87,0.15)'; e.target.style.color='#ff5f57'; }}
              onMouseLeave={e => { e.target.style.background='rgba(255,95,87,0.08)'; e.target.style.color='rgba(255,95,87,0.7)'; }}
              title="Reset leaderboard"
            >↻</button>
          </div>

          {/* List */}
          <div style={{flex:1,overflowY:'auto',padding:'12px',scrollbarWidth:'thin',scrollbarColor:'rgba(245,166,35,0.2) transparent'}}>
            {players.length > 0 ? (
              <div>
                {players.map((player, index) => {
                  const style = rankColors[getRankStyle(index)] || {};
                  return (
                    <div key={player.id} style={{
                      display:'flex', alignItems:'center', gap:'10px',
                      padding:'9px 11px', borderRadius:'3px', marginBottom:'6px',
                      background: style.bg || 'rgba(0,0,0,0.2)',
                      border: `1px solid ${style.border || 'rgba(255,255,255,0.07)'}`,
                    }}>
                      <div style={{
                        width:'28px',height:'28px',borderRadius:'50%',
                        background:'rgba(0,0,0,0.3)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize: index < 3 ? '14px' : '10px',
                        fontFamily:"'Orbitron',monospace", fontWeight:700,
                        color: style.color || 'rgba(255,255,255,0.4)',
                        flexShrink:0
                      }}>
                        {getRankIcon(index)}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                          <p style={{color:'rgba(255,255,255,0.8)',fontSize:'12px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'85px'}}>{player.name}</p>
                          {player.kingBadge && <span style={{fontSize:'10px'}}>👑</span>}
                          <span style={{color:'rgba(255,255,255,0.25)',fontSize:'9px',fontFamily:"'Orbitron',monospace"}}>{player.mode}</span>
                        </div>
                        <p style={{color:'rgba(255,255,255,0.25)',fontSize:'9px'}}>{player.date}</p>
                      </div>
                      <div style={{
                        padding:'4px 8px', background:'rgba(0,229,200,0.08)',
                        border:'1px solid rgba(0,229,200,0.2)',
                        borderRadius:'2px', fontFamily:"'Orbitron',monospace",
                        fontWeight:700, color:'#00e5c8', fontSize:'13px',
                        minWidth:'36px', textAlign:'center'
                      }}>{player.score}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:'28px',marginBottom:'10px',opacity:0.3}}>🏆</div>
                <p style={{color:'rgba(255,255,255,0.3)',fontSize:'12px',marginBottom:'4px'}}>No scores yet</p>
                <p style={{color:'rgba(255,255,255,0.15)',fontSize:'10px'}}>Play a game to appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightColumn;