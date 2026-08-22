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
    const crossPos = [pointer.x - CROSS_SIZE / 2, pointer.y - CROSS_SIZE / 2]
    const crossVel = [0, 0]
    const positions = Array.from({ length: 4 }, () => [pointer.x, pointer.y])
    const velocities = Array.from({ length: 4 }, () => [0, 0])
    const targets = Array.from({ length: 4 }, () => [pointer.x, pointer.y])
    const stiffness = [0.115, 0.101, 0.092, 0.083]
    const damping = [0.76, 0.775, 0.79, 0.805]
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
      corners.forEach((corner, index) => {
        corner.classList.toggle('is-framing', framing)
        if (framing) {
          corner.style.setProperty('--corner-delay', `${index * 26}ms`)
          retrigger(corner, 'is-locking')
        }
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

    const onMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const onOver = (event) => {
      const element = event.target.closest?.('a, button, [role="button"], [data-cursor]') || null
      setHoverTarget(element)
    }

    const onDown = () => {
      cross.classList.add('is-pressed')
      corners.forEach((corner) => corner.classList.add('is-pressed'))
      retrigger(cross, 'is-firing')
    }

    const onUp = () => {
      cross.classList.remove('is-pressed')
      corners.forEach((corner, index) => {
        corner.classList.remove('is-pressed')
        if (hoverEl) {
          corner.style.setProperty('--corner-delay', `${index * 22}ms`)
          retrigger(corner, 'is-locking')
        }
      })
    }

    updateTargets()
    corners.forEach((corner, index) => {
      positions[index][0] = targets[index][0]
      positions[index][1] = targets[index][1]
      corner.style.transform = `translate3d(${positions[index][0]}px, ${positions[index][1]}px, 0)`
    })

    const loop = () => {
      raf = requestAnimationFrame(loop)
      updateTargets()

      const aiming = document.body.classList.contains('asteroid-game-active')
      const crossStiffness = aiming ? 0.42 : 0.31
      const crossDamping = aiming ? 0.7 : 0.66
      const crossTargetX = pointer.x - CROSS_SIZE / 2
      const crossTargetY = pointer.y - CROSS_SIZE / 2
      crossVel[0] = (crossVel[0] + (crossTargetX - crossPos[0]) * crossStiffness) * crossDamping
      crossVel[1] = (crossVel[1] + (crossTargetY - crossPos[1]) * crossStiffness) * crossDamping
      crossPos[0] += crossVel[0]
      crossPos[1] += crossVel[1]
      cross.style.transform = `translate3d(${crossPos[0]}px, ${crossPos[1]}px, 0)`

      for (let index = 0; index < corners.length; index += 1) {
        velocities[index][0] =
          (velocities[index][0] + (targets[index][0] - positions[index][0]) * stiffness[index]) *
          damping[index]
        velocities[index][1] =
          (velocities[index][1] + (targets[index][1] - positions[index][1]) * stiffness[index]) *
          damping[index]
        positions[index][0] += velocities[index][0]
        positions[index][1] += velocities[index][1]
        corners[index].style.transform =
          `translate3d(${positions[index][0]}px, ${positions[index][1]}px, 0)`
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
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
