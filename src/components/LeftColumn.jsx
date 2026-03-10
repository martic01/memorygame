import React from 'react';

const Section = ({ label, children }) => (
  <div style={{ marginBottom: '20px' }} >
    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: '8px' }}>
      {label}
    </div>
    {children}
  </div>
);

const Step = ({ n, text }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '7px' }}>
    <div style={{ width: '18px', height: '18px', background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
      <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '9px', fontWeight: 700, color: '#00e5c8' }}>{n}</span>
    </div>
    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', lineHeight: 1.5 }}>{text}</p>
  </div>
);

const ModeCard = ({ icon, name, desc, accent, active }) => (
  <div style={{
    background: active ? `rgba(${accent},0.08)` : 'rgba(0,0,0,0.2)',
    border: `1px solid rgba(${accent},${active ? '0.35' : '0.15'})`,
    borderRadius: '3px', padding: '9px 11px', marginBottom: '6px',
    transition: 'all 0.2s'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
      <span style={{ fontSize: '13px' }}>{icon}</span>
      <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '10px', fontWeight: 700, color: `rgb(${accent})`, letterSpacing: '0.05em' }}>{name}</span>
    </div>
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', lineHeight: 1.4 }}>{desc}</p>
  </div>
);

const LeftColumn = ({ playerName, kingBadge }) => {
  return (
    <div className="left-column" style={{
      display: 'none', // Hidden by default on mobile
      height: 'calc(100vh - 32px)',
      position: 'sticky',
      top: '16px',
    }}>
      {/* Add media query for desktop */}
      <style>{`
        @media (min-width: 800px) {
          .left-column {
            display: block !important;
             width: 300px !important;
          }
           
        }
      `}</style>

      <div style={{
        height: '100%', background: '#10131e', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '4px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: '16px', right: '16px', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(0,229,200,0.4),transparent)' }} />

        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '9px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ width: '26px', height: '26px', background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.2)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>❓</div>
          <span style={{ fontFamily: "'Orbitron',monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#00e5c8', textTransform: 'uppercase' }}>How to Play</span>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,229,200,0.2) transparent' }}>
          
          {/* BASIC RULES */}
          <Section label="Basic Rules">
            <Step n="1" text="Watch the sequence of colors that light up" />
            <Step n="2" text="Repeat the colors in the exact same order" />
            <Step n="3" text="Each correct round adds one new color" />
            <Step n="4" text="Wrong click = Game Over!" />
          </Section>

          {/* GAMEPLAY EXAMPLE */}
          <Section label="Example">
            <div style={{ background: 'rgba(0,229,200,0.05)', borderRadius: '4px', padding: '12px', marginBottom: '8px' }}>
              <div style={{ color: '#00e5c8', fontSize: '10px', fontFamily: "'Orbitron',monospace", marginBottom: '8px' }}>HOW THE SEQUENCE GROWS:</div>
              
              <div style={{ marginBottom: '8px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#00e5c8' }}>Level 1:</span> 🔴 Red blinks
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginLeft: '12px' }}>
                  You click: 🔴 Red
                </p>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#00e5c8' }}>Level 2:</span> 🔵 Blue blinks (new color)
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginLeft: '12px' }}>
                  You click: 🔴 Red, then 🔵 Blue
                </p>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#00e5c8' }}>Level 3:</span> 🟢 Green blinks (new color)
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginLeft: '12px' }}>
                  You click: 🔴 Red, 🔵 Blue, then 🟢 Green
                </p>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#00e5c8' }}>Level 4:</span> ⚫ Black blinks (new color)
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginLeft: '12px' }}>
                  You click: 🔴 Red, 🔵 Blue, 🟢 Green, then ⚫ Black
                </p>
              </div>
              
              <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,95,87,0.1)', borderRadius: '3px' }}>
                <p style={{ color: '#ff5f57', fontSize: '10px', fontWeight: 600 }}>
                  ⚠️ If you click the wrong color at any point, the game ends and your score is the number of colors you correctly remembered.
                </p>
              </div>
            </div>
          </Section>

          {/* GAME MODES */}
          <Section label="Game Modes">
            <ModeCard icon="⚡" name="Quick Game" desc="Endless loop • Play until mistake" accent="59,130,246" />
            <ModeCard icon="😎" name="Easy Mode" desc="5 songs • 40 second timer • Win if score ≥ 5" accent="34,197,94" />
            <ModeCard icon="😇" name="Hard Mode" desc="2 intense songs • 70 second timer • Win if score ≥ 10" accent="245,166,35" />
            <ModeCard icon="👑" name="King Mode" desc="2 epic songs • Full song length • Win if score ≥ 15 to earn 👑 badge" accent="255,95,87" />
          </Section>

          {/* WIN CONDITIONS */}
          <Section label="Win Condition">
            <div style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)', borderRadius: '3px', padding: '10px 12px' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '6px' }}>Easy / Hard / King modes:</p>
              {['Complete all sequences', 'Song plays to the end', 'No mistakes'].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: '#00e5c8', fontSize: '10px' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{t}</span>
                </div>
              ))}
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', marginTop: '6px' }}>Quick Game: endless, no win condition</p>
            </div>
          </Section>

          {/* TIMER SYSTEM */}
          <Section label="⏱ Timer">
            <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '3px', padding: '10px 12px' }}>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ color: '#f5a623', fontSize: '10px' }}>⏱</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>20s timer appears during gameplay</span>
              </div>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#f5a623', fontSize: '10px' }}>↻</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>Resets on every click</span>
              </div>
              <div style={{ background: 'rgba(255,95,87,0.1)', border: '1px solid rgba(255,95,87,0.2)', borderRadius: '2px', padding: '7px 9px' }}>
                <p style={{ color: '#ff5f57', fontSize: '10px', fontFamily: "'Orbitron',monospace", letterSpacing: '0.05em', marginBottom: '4px' }}>⚠ WARNING SYSTEM</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>First timeout → warning modal</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Second timeout → game quits (no score)</p>
              </div>
            </div>
          </Section>

          {/* KING BADGE */}
          {kingBadge && (
            <div style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '3px', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>👑</span>
              <span style={{ color: '#f5a623', fontSize: '10px', fontFamily: "'Orbitron',monospace", fontWeight: 700 }}>KING STATUS UNLOCKED</span>
            </div>
          )}
        </div>

        {/* Player footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg,rgba(0,229,200,0.2),rgba(59,130,246,0.2))',
            border: '1px solid rgba(0,229,200,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: '13px', color: '#00e5c8' }}>
              {playerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Active Player</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>{playerName}</p>
              {kingBadge && <span style={{ color: '#f5a623', fontSize: '12px' }}>👑</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;