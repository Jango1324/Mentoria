'use client'

import { useState, useEffect } from 'react'

const MESSAGES = [
  'Booting Mentoria OS',
  'Mapping opportunities',
  'Loading knowledge graph',
  'Preparing student workspace',
  'Syncing Learning DNA',
]

const BAR_TOTAL = 10
const MSG_MS   = 1200
const PROG_MS  = MSG_MS / 2  // 600ms per block → fills in one message cycle

// Backticks escaped as \`, backslashes as \\
const ASCII_ART = `            ___    ___
        .."\`)" \`.." \`(\`\`..
      .'; _..=. :: \`-'._ ;\`.
     : ) ;"\`':._::_.      ( :.
   .:-"   _.  \`"##"\` "._   \`-:\\
  /."   -"\`  ._.::._. .'"-   ".:
 : :    ( -: \`" :: "\` :- )    : )
( .":==._' \`'=._##_.='\` '_.==: .'
(:  \`, \`"\`    \`"##"\`    \`"\` .'\`".)
 \\\`'  \`"--.  "- )( -" ..--"\`  \`-/
 (" (_." =""-..."\`...-""= "._) ")
  "..__..-"  )%\`..'%(  "-..__.."
       (#"...'\\%%%%/\`..."#)
        \`######\`--'######"
          "###")@@(\`###"
               \\@@/
                )(        rscr`

export default function AsciiBrainLoader() {
  const [msgIdx, setMsgIdx]   = useState(0)
  const [filled, setFilled]   = useState(0)

  useEffect(() => {
    const msgId  = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), MSG_MS)
    const progId = setInterval(() => setFilled(f => f >= BAR_TOTAL ? 0 : f + 1), PROG_MS)
    return () => { clearInterval(msgId); clearInterval(progId) }
  }, [])

  const bar = '[' + '■'.repeat(filled) + '□'.repeat(BAR_TOTAL - filled) + ']'

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#07070E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: '"JetBrains Mono", "Consolas", "Courier New", monospace',
    }}>
      <style>{`
        @keyframes aldrGlow {
          0%, 100% { opacity: 0.62; }
          50%       { opacity: 1; }
        }
        @keyframes aldrBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aldr-halo, .aldr-art, .aldr-cursor { animation: none !important; }
          .aldr-cursor { opacity: 1 !important; }
        }
      `}</style>

      {/* Ambient halo behind the art */}
      <div
        className="aldr-halo"
        style={{
          position: 'absolute',
          width: 'min(560px, 90vw)',
          height: 'min(560px, 90vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,106,245,0.11) 0%, transparent 68%)',
          animation: 'aldrGlow 3.2s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ASCII brain */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <pre
          className="aldr-art"
          style={{
            color: '#4F6AF5',
            fontSize: 'clamp(8px, 1.05vw, 12px)',
            lineHeight: 1.42,
            margin: '0 0 36px',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            textAlign: 'left',
            animation: 'aldrGlow 3.2s ease-in-out infinite',
            textShadow: '0 0 20px rgba(79,106,245,0.50)',
            userSelect: 'none',
          }}
        >{ASCII_ART}</pre>
      </div>

      {/* Message row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        height: 22,
      }}>
        <span style={{
          color: '#4F6AF5',
          fontSize: 13,
          userSelect: 'none',
        }}>
          {'>'}
        </span>
        <span style={{
          color: '#EBEBEB',
          fontSize: 13,
          letterSpacing: '0.05em',
          opacity: 0.88,
          minWidth: 270,
          fontFamily: 'inherit',
        }}>
          {MESSAGES[msgIdx]}
        </span>
        <span
          className="aldr-cursor"
          style={{
            color: '#4F6AF5',
            fontSize: 15,
            fontWeight: 'bold',
            animation: 'aldrBlink 1s step-end infinite',
            userSelect: 'none',
          }}
        >
          _
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        color: 'rgba(235,235,235,0.40)',
        fontSize: 13,
        letterSpacing: '0.14em',
        fontFamily: 'inherit',
        userSelect: 'none',
      }}>
        {bar}
      </div>
    </div>
  )
}
