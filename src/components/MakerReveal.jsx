import { useEffect } from 'react'
import GlitchEffect from './originkit/ui/glitch-text.tsx'
import ScanAction from './ScanAction.jsx'

export default function MakerReveal({ active, onDismiss }) {
  useEffect(() => {
    if (!active) return undefined
    document.body.classList.add('maker-reveal-active')
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('maker-reveal-active')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active, onDismiss])

  if (!active) return null

  return (
    <div className="maker-reveal" role="dialog" aria-modal="true" aria-label="Maker identity unlocked">
      <div className="maker-reveal__grid" aria-hidden="true" />
      <p className="maker-reveal__eyebrow">// IDENTITY LEAK COMPLETE // VISIT 05</p>
      <div className="maker-reveal__glitch">
        <p className="maker-reveal__message-base">
          🤔 You Really Like this Site. You have visited the site 5 times. Well, Here is The Maker.
        </p>
        <GlitchEffect
          text="🤔 You Really Like this Site. You have visited the site 5 times. Well, Here is The Maker."
          color="#fff8e7"
          font={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 70,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 0.95,
          }}
          playMode="enter"
          startAlign="top"
          infinite
          shake={{ enabled: true, intensity: 6, x: 6, y: 2 }}
          slice={{ enabled: true, intensity: 7, minHeight: 10, maxHeight: 55 }}
        />
      </div>
      <p className="maker-reveal__sub">HTTP 418 OVERRIDE ACCEPTED // PORTRAIT CHANNEL RESTORED</p>
      <ScanAction label="CONTINUE // REVEAL MAKER" onClick={onDismiss} />
    </div>
  )
}
