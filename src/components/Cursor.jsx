import { useEffect, useRef } from 'react'

// Four separate right-angle corner brackets with spring + magnetic movement.
// They collapse to the cursor, and expand to frame any interactive element.
export default function Cursor() {
  const cornersRef = useRef([])

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const corners = cornersRef.current
    if (corners.some((c) => !c)) return

    const S = 18 // corner box size
    const GAP = 7

    // order: TL, TR, BL, BR
    const pos = [[0, 0], [0, 0], [0, 0], [0, 0]]
    const vel = [[0, 0], [0, 0], [0, 0], [0, 0]]
    const target = [[0, 0], [0, 0], [0, 0], [0, 0]]

    let hoverEl = null
    let box = { x: 0, y: 0, w: 22, h: 22 }

    const updateTargets = () => {
      const bx = box.x
      const by = box.y
      const bw = box.w
      const bh = box.h
      target[0][0] = bx
      target[0][1] = by
      target[1][0] = bx + bw - S
      target[1][1] = by
      target[2][0] = bx
      target[2][1] = by + bh - S
      target[3][0] = bx + bw - S
      target[3][1] = by + bh - S
    }

    const onMove = (e) => {
      box = { x: e.clientX - 11, y: e.clientY - 11, w: 22, h: 22 }
      if (hoverEl && hoverEl.isConnected) {
        const r = hoverEl.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          box = {
            x: r.left - GAP,
            y: r.top - GAP,
            w: r.width + GAP * 2,
            h: r.height + GAP * 2,
          }
        }
      }
      updateTargets()
    }
    const onOver = (e) => {
      const el = e.target.closest
        ? e.target.closest('a, button, [role="button"], [data-cursor]')
        : null
      hoverEl = el
    }

    // start centred on screen
    box = { x: window.innerWidth / 2 - 11, y: window.innerHeight / 2 - 11, w: 22, h: 22 }
    updateTargets()
    for (let i = 0; i < 4; i++) {
      pos[i][0] = target[i][0]
      pos[i][1] = target[i][1]
      corners[i].style.transform = `translate3d(${pos[i][0]}px, ${pos[i][1]}px, 0)`
    }

    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      for (let i = 0; i < 4; i++) {
        vel[i][0] += (target[i][0] - pos[i][0]) * 0.24
        vel[i][1] += (target[i][1] - pos[i][1]) * 0.24
        vel[i][0] *= 0.6
        vel[i][1] *= 0.6
        pos[i][0] += vel[i][0]
        pos[i][1] += vel[i][1]
        corners[i].style.transform = `translate3d(${pos[i][0]}px, ${pos[i][1]}px, 0)`
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div ref={(el) => (cornersRef.current[0] = el)} className="corner corner--tl" aria-hidden="true" />
      <div ref={(el) => (cornersRef.current[1] = el)} className="corner corner--tr" aria-hidden="true" />
      <div ref={(el) => (cornersRef.current[2] = el)} className="corner corner--bl" aria-hidden="true" />
      <div ref={(el) => (cornersRef.current[3] = el)} className="corner corner--br" aria-hidden="true" />
    </>
  )
}
