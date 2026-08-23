import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createMakerCyberBust } from '../three/createMakerCyberBust.js'

const clamp = THREE.MathUtils.clamp

export default function MakerCyberPortrait() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30)
    camera.position.set(0, 0.1, 4.8)
    camera.lookAt(0, 0.18, 0)

    const model = createMakerCyberBust()
    scene.add(model.root)

    const pointer = new THREE.Vector2(0, 0)
    const eyeRotation = new THREE.Vector2(0, 0)
    const headRotation = new THREE.Vector2(0, 0)
    const revealStart = performance.now()
    let frame = 0
    let previous = performance.now()
    let visible = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      renderer.setSize(rect.width, rect.height, false)
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
    }

    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    }, { threshold: 0.02 })
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    resize()

    const render = (now) => {
      frame = window.requestAnimationFrame(render)
      if (!visible) {
        previous = now
        return
      }

      const delta = Math.min((now - previous) / 1000, 0.05)
      previous = now

      const revealProgress = reducedMotion ? 1 : clamp((now - revealStart) / 2300, 0, 1)
      const revealEase = 1 - Math.pow(1 - revealProgress, 3)
      model.revealUniform.value = THREE.MathUtils.lerp(
        model.revealRange[0] - 0.2,
        model.revealRange[1] + 0.2,
        revealEase,
      )

      const desiredYaw = pointer.x * 0.42
      const desiredPitch = pointer.y * 0.24
      const eyeTargetYaw = clamp(desiredYaw, -0.2, 0.2)
      const eyeTargetPitch = clamp(desiredPitch, -0.13, 0.13)
      const yawExcess = Math.max(0, Math.abs(desiredYaw) - 0.13) * Math.sign(desiredYaw)
      const pitchExcess = Math.max(0, Math.abs(desiredPitch) - 0.085) * Math.sign(desiredPitch)
      const headTargetYaw = clamp(yawExcess * 0.52, -0.16, 0.16)
      const headTargetPitch = clamp(pitchExcess * 0.42, -0.085, 0.085)
      const eyeDamping = 1 - Math.exp(-delta * (reducedMotion ? 18 : 10))
      const headDamping = 1 - Math.exp(-delta * (reducedMotion ? 12 : 3.8))

      eyeRotation.x = THREE.MathUtils.lerp(eyeRotation.x, eyeTargetPitch, eyeDamping)
      eyeRotation.y = THREE.MathUtils.lerp(eyeRotation.y, eyeTargetYaw, eyeDamping)
      headRotation.x = THREE.MathUtils.lerp(headRotation.x, headTargetPitch, headDamping)
      headRotation.y = THREE.MathUtils.lerp(headRotation.y, headTargetYaw, headDamping)

      model.eyePivots.forEach((eye) => {
        const rest = eye.userData.restPosition
        eye.position.x = rest.x + eyeRotation.y * 0.22
        eye.position.y = rest.y - eyeRotation.x * 0.2
        eye.rotation.x = eyeRotation.x
        eye.rotation.y = eyeRotation.y
      })
      model.headPivot.rotation.x = headRotation.x
      model.headPivot.rotation.y = headRotation.y

      renderer.render(scene, camera)
    }

    frame = window.requestAnimationFrame(render)
    window.__IMG2THREEJS_READY__ = true

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      observer.disconnect()
      resizeObserver.disconnect()
      model.dispose()
      renderer.dispose()
      delete window.__IMG2THREEJS_READY__
    }
  }, [])

  return (
    <div
      className="maker-portrait"
      role="img"
      aria-label="Unlocked neon contour portrait of the maker. Its pupils and head follow the pointer."
    >
      <canvas ref={canvasRef} className="maker-portrait__canvas" aria-hidden="true" />
      <div className="maker-portrait__wash" aria-hidden="true" />
      <div className="maker-portrait__reticle" aria-hidden="true" />
      <div className="maker-portrait__meta">
        <span>IDENT // MAKER</span>
        <span>GAZE // ONLINE</span>
      </div>
      <p>PORTRAIT CHANNEL RESTORED</p>
    </div>
  )
}
