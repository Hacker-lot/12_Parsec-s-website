import { useEffect, useRef, useState } from 'react'
import Storm3D from '../components/Storm3D.jsx'
import { allTracks, buildRotation, neteaseEmbedUrl } from '../lib/radioTracks.js'

const LOCAL_PLAYS = 3 // each local signal loops this many times before advancing

const stormMedia = allTracks.map((t) => ({ serial: t.id, kind: t.genre, url: t.cover }))

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// Infinite vibe radio: a tornado of sleeves, and whatever is on air tears
// out of the wall with its dossier. No serials — the station drives itself.
export default function Radio() {
  const [rotation, setRotation] = useState(buildRotation)
  const [idx, setIdx] = useState(0)
  const [live, setLive] = useState(false)
  const [paused, setPaused] = useState(false)
  const [loopCount, setLoopCount] = useState(1)
  const [progress, setProgress] = useState(0) // 0..1, local tracks only

  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const nextRef = useRef(() => {})

  const current = rotation[idx] || null

  nextRef.current = () => {
    setIdx((i) => {
      if (i + 1 >= rotation.length) {
        setRotation(buildRotation())
        return 0
      }
      return i + 1
    })
  }

  const jumpTo = (id) => {
    if (id == null) return
    const at = rotation.findIndex((t) => t.id === id)
    if (at >= 0) setIdx(at)
    else setRotation((r) => [...r, allTracks.find((t) => t.id === id)].filter(Boolean))
    setLive(true)
    setPaused(false)
  }

  // playback engine — local files are event-driven, embeds run on a timer
  useEffect(() => {
    if (!live || !current) return undefined
    setLoopCount(1)
    setProgress(0)
    window.clearTimeout(timerRef.current)

    if (current.audio) {
      const audio = audioRef.current || (audioRef.current = new Audio())
      audio.src = current.audio
      audio.loop = false
      audio.ontimeupdate = () => {
        if (audio.duration) setProgress(audio.currentTime / audio.duration)
      }
      audio.onended = () => {
        setLoopCount((c) => {
          if (c < LOCAL_PLAYS) {
            audio.currentTime = 0
            audio.play().catch(() => {})
            return c + 1
          }
          nextRef.current()
          return 1
        })
      }
      if (!paused) audio.play().catch(() => setPaused(true))
    }
    // embeds play inside their iframe; the dossier advances on the clock
    return () => window.clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, current?.id])

  // embed advance timer (re-armed on pause/resume)
  useEffect(() => {
    window.clearTimeout(timerRef.current)
    if (live && current?.netease && !paused) {
      timerRef.current = window.setTimeout(
        () => nextRef.current(),
        (current.duration + 8) * 1000,
      )
    }
    return () => window.clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, current?.id, paused])

  const togglePause = () => {
    if (current?.audio && audioRef.current) {
      if (paused) audioRef.current.play().catch(() => {})
      else audioRef.current.pause()
    }
    setPaused(!paused)
  }

  return (
    <div className="radio">
      <div className="radio__bar">
        <span className="radio__brand">12_PARSEC <b>RADIO</b></span>
        <span className="radio__freq">FM 66.6 // THE EYE OF THE STORM</span>
        <a className="radio__home" href="https://io12parsec.com" data-cursor>← MAIN SITE</a>
      </div>

      <div className="radio__storm">
        <Storm3D
          media={stormMedia}
          selectedSerial={live && current ? current.id : null}
          onSelect={jumpTo}
        />
      </div>

      {!live && (
        <div className="radio__tunein">
          <p className="eyebrow">// INFINITE VIBE RADIO</p>
          <h2>TUNE<br />IN.</h2>
          <p className="radio__tunein-sub">
            Britpop, post-punk, guitar ambient and station static — broadcast
            from the eye of the storm. Records via official NetEase embeds;
            interludes synthesized in-house.
          </p>
          <button type="button" className="radio__go" onClick={() => { setLive(true); setPaused(false) }} data-cursor>
            ▸ ON AIR
          </button>
        </div>
      )}

      {live && current && (
        <aside className="radio__dossier" aria-live="polite">
          <p className="eyebrow">
            <span className="radio__onair">{paused ? 'PAUSED' : 'ON AIR'}</span>
            {' · '}{String(idx + 1).padStart(2, '0')} / {String(rotation.length).padStart(2, '0')} — {current.genre}
          </p>
          <h2>{current.title}</h2>
          <p className="radio__artist">{current.artist}</p>

          <div className="radio__progress" aria-hidden="true">
            <i
              style={
                current.audio
                  ? { width: `${progress * 100}%` }
                  : paused
                    ? { width: 0 }
                    : { animationDuration: `${current.duration + 8}s` }
              }
              className={current.audio ? '' : paused ? '' : 'is-embed'}
            />
          </div>
          <p className="radio__meta">
            {current.audio
              ? `LOCAL SIGNAL // LOOP ${loopCount}/${LOCAL_PLAYS}`
              : `NETEASE BROADCAST // ≈${fmt(current.duration)}`}
          </p>

          {current.netease && !paused && (
            <iframe
              key={current.id}
              title={`${current.title} — ${current.artist}`}
              src={neteaseEmbedUrl(current.netease)}
              className="radio__embed"
              allow="autoplay"
              frameBorder="0"
            />
          )}

          <div className="radio__controls">
            <button type="button" onClick={togglePause} data-cursor>
              {paused ? '▸ RESUME' : current.audio ? '❚❚ PAUSE' : '◼ STOP'}
            </button>
            <button type="button" onClick={() => nextRef.current()} data-cursor>
              SKIP →
            </button>
          </div>

          <img className="radio__cover" src={current.cover} alt={current.title} />
        </aside>
      )}

      {/* mobile / no-WebGL fallback — the station log */}
      <div className="radio__log">
        {rotation.map((t, i) => (
          <button
            key={t.id}
            className={`radio__log-entry${live && i === idx ? ' is-now' : ''}`}
            onClick={() => jumpTo(t.id)}
            data-cursor
          >
            <img src={t.cover} alt="" loading="lazy" />
            <span>
              <b>{t.title}</b>
              <small>{t.artist} — {t.genre}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
