import React, { useRef } from 'react';

const NameScreen = ({ playerName, setPlayerName, handleNameSubmit }) => {
  const nameInputRef = useRef(null);

  return (
    <div style={{
      minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '16px', background: '#07080d',
      fontFamily: "'Share Tech Mono', monospace", position: 'relative', overflow: 'hidden'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,229,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,200,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      {/* Ambient */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,200,0.05) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative', background: '#10131e', border: '1px solid rgba(0,229,200,0.2)',
        borderRadius: '4px', padding: '48px 40px', width: '100%', maxWidth: '400px',
        boxShadow: '0 0 80px rgba(0,229,200,0.06)'
      }}>
        {/* Top line */}
        <div style={{position:'absolute',top:0,left:'20px',right:'20px',height:'1px',background:'linear-gradient(90deg,transparent,#00e5c8,transparent)'}} />
        {/* Corners */}
        {[['top:8px;left:8px','borderTop','borderLeft'],['top:8px;right:8px','borderTop','borderRight'],['bottom:8px;left:8px','borderBottom','borderLeft'],['bottom:8px;right:8px','borderBottom','borderRight']].map(([pos],i) => (
          <div key={i} style={{
            position:'absolute', width:'10px', height:'10px',
            ...(i===0?{top:8,left:8}:i===1?{top:8,right:8}:i===2?{bottom:8,left:8}:{bottom:8,right:8}),
            ...(i===0||i===1?{borderTop:'1.5px solid rgba(0,229,200,0.4)'}:{borderBottom:'1.5px solid rgba(0,229,200,0.4)'}),
            ...(i===0||i===2?{borderLeft:'1.5px solid rgba(0,229,200,0.4)'}:{borderRight:'1.5px solid rgba(0,229,200,0.4)'})
          }} />
        ))}

        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'36px',marginBottom:'12px'}}>🧠</div>
          <h1 style={{
            fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'clamp(22px,5vw,32px)',
            letterSpacing:'0.12em', background:'linear-gradient(135deg,#00e5c8,#3b82f6,#f5a623)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            marginBottom:'6px'
          }}>MEMORY</h1>
          <p style={{color:'rgba(0,229,200,0.35)',fontSize:'10px',letterSpacing:'0.3em',textTransform:'uppercase'}}>
            sequence recall protocol
          </p>
        </div>

        <form onSubmit={handleNameSubmit}>
          <label style={{display:'block',color:'rgba(255,255,255,0.35)',fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>
            initialize player
          </label>
          <input
            ref={nameInputRef}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="enter callsign..."
            autoFocus
            required
            style={{
              width:'100%', padding:'13px 16px', background:'#070a10',
              border:'1px solid rgba(0,229,200,0.2)', borderRadius:'2px',
              color:'#00e5c8', fontFamily:"'Share Tech Mono',monospace", fontSize:'15px',
              outline:'none', boxSizing:'border-box',
            }}
            onFocus={e => { e.target.style.borderColor='#00e5c8'; e.target.style.boxShadow='0 0 15px rgba(0,229,200,0.15)'; }}
            onBlur={e => { e.target.style.borderColor='rgba(0,229,200,0.2)'; e.target.style.boxShadow='none'; }}
          />
          <button
            type="submit"
            style={{
              width:'100%', marginTop:'20px', padding:'13px',
              background:'transparent', border:'1px solid #00e5c8',
              borderRadius:'2px', color:'#00e5c8',
              fontFamily:"'Orbitron',monospace", fontSize:'11px', fontWeight:700,
              letterSpacing:'0.2em', cursor:'pointer', textTransform:'uppercase',
              transition:'all 0.2s'
            }}
            onMouseEnter={e => { e.target.style.background='rgba(0,229,200,0.1)'; e.target.style.boxShadow='0 0 25px rgba(0,229,200,0.25)'; }}
            onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.boxShadow='none'; }}
          >
            ▶ ENGAGE SEQUENCE
          </button>
        </form>

        <div style={{display:'flex',gap:'8px',justifyContent:'center',marginTop:'28px'}}>
          {['#00e5c8','#3b82f6','#f5a623','rgba(255,255,255,0.15)'].map((c,i) => (
            <div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:c}} />
          ))}
        </div>
        <p style={{color:'rgba(255,255,255,0.12)',fontSize:'10px',textAlign:'center',marginTop:'14px',letterSpacing:'0.15em'}}>
          WATCH · REPEAT · SURVIVE
        </p>
      </div>
    </div>
  );
};

export default NameScreen;
