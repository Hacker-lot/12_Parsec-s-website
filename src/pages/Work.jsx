import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Storm3D from '../components/Storm3D.jsx'
import { stormMedia } from '../lib/stormMedia.js'
import ScanAction from '../components/ScanAction.jsx'

export default function Work() {
  const root = useRef(null)
  const audioRef = useRef(null)
  const [selectedSerial, setSelectedSerial] = useState(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)
  const [playing, setPlaying] = useState(false)
  const selected = stormMedia.find((m) => m.serial === selectedSerial) || null

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(
        '.work [data-reveal]',
        { y: reducedMotion ? 0 : 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.7,
          ease: 'power4.out',
          stagger: reducedMotion ? 0 : 0.07,
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  // ESC returns the extracted item to the storm
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setSelectedSerial(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // extracted audio: the side plays itself, and stops when returned
  useEffect(() => {
    const el = audioRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
    setPlaying(false)
    if (selected?.audio) {
      const audio = el || new Audio()
      audio.src = selected.audio
      audioRef.current = audio
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }, [selectedSerial]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => audioRef.current?.pause(), [])

  const toggleAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  const submitSerial = (event) => {
    event.preventDefault()
    const hit = stormMedia.find((m) => m.serial === query.trim())
    if (hit) {
      setSelectedSerial(hit.serial)
      setQuery('')
      setError(false)
    } else {
      setError(true)
      window.setTimeout(() => setError(false), 700)
    }
  }

  return (
    <div ref={root} className="work">
      <div className="work__head container" data-reveal>
        <p className="eyebrow">// THE STORM — STAND IN THE EYE</p>
      </div>

      <div className="storm3d-wrap">
        <Storm3D media={stormMedia} selectedSerial={selectedSerial} onSelect={setSelectedSerial} />
      </div>

      {!selected && (
        <form
          className={`storm-search${error ? ' is-error' : ''}`}
          onSubmit={submitSerial}
          data-reveal
        >
          <div className="storm-search__row">
            <label htmlFor="storm-serial">SERIAL //</label>
            <input
              id="storm-serial"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="000000"
              inputMode="numeric"
              autoComplete="off"
              spellCheck="false"
              aria-label="6-digit serial number"
            />
            <button type="submit" data-cursor>EXTRACT →</button>
          </div>
          <small>
            {error
              ? 'NO SIGNAL // SERIAL UNKNOWN'
              : `ENTER 6-DIGIT SERIAL // TRY ${stormMedia[0]?.serial}`}
          </small>
        </form>
      )}

      {selected && (
        <aside className="storm-detail" aria-live="polite">
          <p className="eyebrow">// SERIAL {selected.serial} — {selected.kind}</p>
          <h2>{selected.caption}</h2>
          <p className="storm-detail__text">{selected.detail}</p>
          {selected.audio && (
            <button type="button" className="storm-detail__audio" onClick={toggleAudio} data-cursor>
              <b>{playing ? '◼ STOP' : '▸ PLAY'}</b>
              <span>SIDE A — THEME.WAV</span>
            </button>
          )}
          <img className="storm-detail__img" src={selected.url} alt={selected.caption} />
          <ScanAction
            label="✕ RETURN TO THE STORM"
            onClick={() => setSelectedSerial(null)}
            tone="ghost"
            compact
          />
        </aside>
      )}

      {/* mobile fallback — a browsable archive list */}
      <div className="storm-mobile">
        {stormMedia.map((m) => (
          <button
            key={m.serial}
            className="storm-mobile__photo"
            onClick={() => setSelectedSerial(m.serial)}
            data-cursor
          >
            <img src={m.url} alt={m.caption} loading="lazy" />
            <span className="storm-mobile__serial">{m.serial} // {m.kind}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
