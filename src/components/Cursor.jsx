import { useEffect, useRef } from 'react'

// Crosshair at rest; four independent spring brackets acquire interactive targets.
export default function Cursor() {
  const cornersRef = useRef([])
  const crossRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return undefined
    const corners = cornersRef.current
    const cross = crossRef.current
    if (!cross || corners.some((corner) => !corner)) return undefined

    const CORNER_SIZE = 18
    const CROSS_SIZE = 22
    const GAP = 7
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const positions = Array.from({ length: 4 }, () => [pointer.x, pointer.y])
    const targets = Array.from({ length: 4 }, () => [pointer.x, pointer.y])
    // A small difference between corners keeps the frame organic without
    // introducing overshoot or the loose rubber-band movement it had before.
    const cornerEase = [0.22, 0.2, 0.19, 0.17]
    let hoverEl = null
    let raf = 0

    const retrigger = (element, className) => {
      element.classList.remove(className)
      void element.offsetWidth
      element.classList.add(className)
    }

    const setHoverTarget = (next) => {
      if (next === hoverEl) return
      hoverEl = next
      const framing = Boolean(hoverEl)
      cross.classList.toggle('is-framing', framing)
      corners.forEach((corner) => {
        corner.classList.toggle('is-framing', framing)
        corner.classList.remove('is-locking')
      })
    }

    const updateTargets = () => {
      let box = {
        x: pointer.x - 11,
        y: pointer.y - 11,
        width: 22,
        height: 22,
      }

      if (hoverEl && hoverEl.isConnected) {
        const rect = hoverEl.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          box = {
            x: rect.left - GAP,
            y: rect.top - GAP,
            width: rect.width + GAP * 2,
            height: rect.height + GAP * 2,
          }
        }
      } else if (hoverEl) {
        setHoverTarget(null)
      }

      targets[0][0] = box.x
      targets[0][1] = box.y
      targets[1][0] = box.x + box.width - CORNER_SIZE
      targets[1][1] = box.y
      targets[2][0] = box.x
      targets[2][1] = box.y + box.height - CORNER_SIZE
      targets[3][0] = box.x + box.width - CORNER_SIZE
      targets[3][1] = box.y + box.height - CORNER_SIZE
    }

    const placeCross = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      cross.style.transform =
        `translate3d(${pointer.x - CROSS_SIZE / 2}px, ${pointer.y - CROSS_SIZE / 2}px, 0)`
    }

    const onMove = (event) => {
      placeCross(event)
    }

    const onOver = (event) => {
      const element = event.target.closest?.('a, button, [role="button"], [data-cursor]') || null
      setHoverTarget(element)
    }

    const onDown = (event) => {
      // A press can arrive without a preceding move (keyboard-assisted tools,
      // a newly focused window, or a DOM transition). Anchor the visual cursor
      // to the real click before animating it so the hit point never drifts.
      placeCross(event)
      cross.classList.add('is-pressed')
      corners.forEach((corner) => corner.classList.add('is-pressed'))
      retrigger(cross, 'is-firing')
    }

    const onUp = () => {
      cross.classList.remove('is-pressed')
      corners.forEach((corner) => {
        corner.classList.remove('is-pressed')
      })
    }

    updateTargets()
    cross.style.transform =
      `translate3d(${pointer.x - CROSS_SIZE / 2}px, ${pointer.y - CROSS_SIZE / 2}px, 0)`
    corners.forEach((corner, index) => {
      positions[index][0] = targets[index][0]
      positions[index][1] = targets[index][1]
      corner.style.transform = `translate3d(${positions[index][0]}px, ${positions[index][1]}px, 0)`
    })

    const loop = () => {
      raf = requestAnimationFrame(loop)
      updateTargets()

      for (let index = 0; index < corners.length; index += 1) {
        positions[index][0] += (targets[index][0] - positions[index][0]) * cornerEase[index]
        positions[index][1] += (targets[index][1] - positions[index][1]) * cornerEase[index]
        corners[index].style.transform =
          `translate3d(${positions[index][0]}px, ${positions[index][1]}px, 0)`
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <>
      <div ref={crossRef} className="cursor-cross" aria-hidden="true" />
      <div ref={(el) => (cornersRef.current[0] = el)} className="corner corner--tl" aria-hidden="true" />
      <div ref={(el) => (cornersRef.current[1] = el)} className="corner corner--tr" aria-hidden="true" />
      <div ref={(el) => (cornersRef.current[2] = el)} className="corner corner--bl" aria-hidden="true" />
      <div ref={(el) => (cornersRef.current[3] = el)} className="corner corner--br" aria-hidden="true" />
    </>
  )
}
