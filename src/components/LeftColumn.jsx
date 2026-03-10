import React from 'react';

const Section = ({ label, children }) => (
  <div style={{marginBottom:'20px'}} >
    <div style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:700,letterSpacing:'0.2em',color:'rgba(255,255,255,0.2)',textTransform:'uppercase',marginBottom:'8px'}}>
      {label}
    </div>
    {children}
  </div>
);

const Step = ({ n, text }) => (
  <div style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'7px'}}>
    <div style={{width:'18px',height:'18px',background:'rgba(0,229,200,0.1)',border:'1px solid rgba(0,229,200,0.3)',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'1px'}}>
      <span style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:700,color:'#00e5c8'}}>{n}</span>
    </div>
    <p style={{color:'rgba(255,255,255,0.55)',fontSize:'11px',lineHeight:1.5}}>{text}</p>
  </div>
);

const ModeCard = ({ icon, name, desc, accent, active }) => (
  <div style={{
    background: active ? `rgba(${accent},0.08)` : 'rgba(0,0,0,0.2)',
    border: `1px solid rgba(${accent},${active?'0.35':'0.15'})`,
    borderRadius:'3px', padding:'9px 11px', marginBottom:'6px',
    transition:'all 0.2s'
  }}>
    <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'3px'}}>
      <span style={{fontSize:'13px'}}>{icon}</span>
      <span style={{fontFamily:"'Orbitron',monospace",fontSize:'10px',fontWeight:700,color:`rgb(${accent})`,letterSpacing:'0.05em'}}>{name}</span>
    </div>
    <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',lineHeight:1.4}}>{desc}</p>
  </div>
);

const LeftColumn = ({ playerName, kingBadge }) => {
  return (
    <div className="left-column" style={{
      display: 'none', // Hidden by default on mobile
      height: 'calc(100vh - 32px)',
      position: 'sticky',
      top: '16px'
    }}>
      {/* Add media query for desktop */}
      <style>{`
        @media (min-width: 800px) {
          .left-column {
            display: block !important;
          }
        }
      `}</style>
      
      <div style={{
        height:'100%', background:'#10131e', border:'1px solid rgba(255,255,255,0.06)',
        borderRadius:'4px', display:'flex', flexDirection:'column', overflow:'hidden',
        position:'relative'
      }}>
        <div style={{position:'absolute',top:0,left:'16px',right:'16px',height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,229,200,0.4),transparent)'}} />
        
        {/* Header */}
        <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:'9px',background:'rgba(0,0,0,0.2)'}}>
          <div style={{width:'26px',height:'26px',background:'rgba(0,229,200,0.1)',border:'1px solid rgba(0,229,200,0.2)',borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px'}}>❓</div>
          <span style={{fontFamily:"'Orbitron',monospace",fontSize:'11px',fontWeight:700,letterSpacing:'0.12em',color:'#00e5c8',textTransform:'uppercase'}}>How to Play</span>
        </div>

        {/* Scrollable content */}
        <div style={{flex:1,overflowY:'auto',padding:'16px',scrollbarWidth:'thin',scrollbarColor:'rgba(0,229,200,0.2) transparent'}}>
          <Section label="Basic Rules">
            <Step n="1" text="Watch the color sequence" />
            <Step n="2" text="Repeat in the same order" />
            <Step n="3" text="Each round adds one color" />
            <Step n="4" text="Wrong click = game over" />
          </Section>

          <Section label="Game Modes">
            <ModeCard icon="⚡" name="Quick Game" desc="Endless loop • Play until mistake" accent="59,130,246" />
            <ModeCard icon="😎" name="Easy Mode" desc="5 songs • Win before song ends" accent="34,197,94" />
            <ModeCard icon="😇" name="Hard Mode" desc="2 intense songs • Beat the music" accent="245,166,35" />
            <ModeCard icon="👑" name="King Mode" desc="2 epic songs • Earn the crown badge" accent="255,95,87" />
          </Section>

          <Section label="Win Condition">
            <div style={{background:'rgba(0,229,200,0.05)',border:'1px solid rgba(0,229,200,0.15)',borderRadius:'3px',padding:'10px 12px'}}>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',marginBottom:'6px'}}>Easy / Hard / King modes:</p>
              {['Complete all sequences','Song plays to the end','Zero mistakes'].map((t,i) => (
                <div key={i} style={{display:'flex',gap:'7px',alignItems:'center',marginBottom:'4px'}}>
                  <span style={{color:'#00e5c8',fontSize:'10px'}}>✓</span>
                  <span style={{color:'rgba(255,255,255,0.5)',fontSize:'10px'}}>{t}</span>
                </div>
              ))}
              <p style={{color:'rgba(255,255,255,0.25)',fontSize:'10px',marginTop:'6px'}}>Quick Game: endless, no win condition</p>
            </div>
          </Section>

          <Section label="⏱ Timer">
            <div style={{background:'rgba(245,166,35,0.06)',border:'1px solid rgba(245,166,35,0.2)',borderRadius:'3px',padding:'10px 12px'}}>
              <div style={{display:'flex',gap:'7px',alignItems:'center',marginBottom:'5px'}}>
                <span style={{color:'#f5a623',fontSize:'10px'}}>⏱</span>
                <span style={{color:'rgba(255,255,255,0.5)',fontSize:'10px'}}>20s timer, resets on each click</span>
              </div>
              <div style={{background:'rgba(255,95,87,0.1)',border:'1px solid rgba(255,95,87,0.2)',borderRadius:'2px',padding:'7px 9px',marginTop:'4px'}}>
                <p style={{color:'#ff5f57',fontSize:'10px',fontFamily:"'Orbitron',monospace",letterSpacing:'0.05em',marginBottom:'4px'}}>⚠ WARNING</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px'}}>Timeout → warning modal</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px'}}>2nd timeout → game quits</p>
              </div>
            </div>
          </Section>
        </div>

        {/* Player footer */}
        <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{
            width:'32px',height:'32px',borderRadius:'50%',
            background:'linear-gradient(135deg,rgba(0,229,200,0.2),rgba(59,130,246,0.2))',
            border:'1px solid rgba(0,229,200,0.3)',
            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0
          }}>
            <span style={{fontFamily:"'Orbitron',monospace",fontWeight:700,fontSize:'13px',color:'#00e5c8'}}>
              {playerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div style={{minWidth:0,flex:1}}>
            <p style={{color:'rgba(255,255,255,0.25)',fontSize:'9px',letterSpacing:'0.15em',textTransform:'uppercase'}}>Active Player</p>
            <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
              <p style={{color:'rgba(255,255,255,0.8)',fontSize:'12px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'90px'}}>{playerName}</p>
              {kingBadge && <span style={{color:'#f5a623',fontSize:'12px'}}>👑</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;