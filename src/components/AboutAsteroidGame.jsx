import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function AboutAsteroidGame({ active, onExit }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  const onExitRef = useRef(onExit)
  const resetRef = useRef(null)
  const briefingRef = useRef(true)
  const [score, setScore] = useState(0)
  const [hull, setHull] = useState(3)
  const [briefing, setBriefing] = useState(true)

  useEffect(() => {
    activeRef.current = active
    document.body.classList.toggle('asteroid-game-active', active)
    if (active) {
      briefingRef.current = true
      setBriefing(true)
      setScore(0)
      setHull(3)
      resetRef.current?.()
    }
    return () => document.body.classList.remove('asteroid-game-active')
  }, [active])

  useEffect(() => {
    onExitRef.current = onExit
  }, [onExit])

  useEffect(() => {
    if (!active) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onExitRef.current?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050705, 0.021)
    const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 100)
    camera.position.set(0, 0, 5)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const aimPoint = new THREE.Vector3()
    const asteroids = []
    const lasers = []
    const explosions = []
    const resetTimers = new Set()
    const clock = new THREE.Clock()
    let scoreValue = 0
    let hullValue = 3
    let spawnIn = 0.25
    let raf = 0
    let disposed = false

    const disposeObject = (object) => {
      object.traverse?.((child) => {
        child.geometry?.dispose()
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((material) => material.dispose())
        }
      })
      object.parent?.remove(object)
    }

    const removeFrom = (list, object) => {
      const index = list.indexOf(object)
      if (index >= 0) list.splice(index, 1)
      disposeObject(object.group || object)
    }

    const clearSceneObjects = () => {
      while (asteroids.length) removeFrom(asteroids, asteroids[0])
      while (lasers.length) removeFrom(lasers, lasers[0])
      while (explosions.length) removeFrom(explosions, explosions[0])
      resetTimers.forEach((timer) => window.clearTimeout(timer))
      resetTimers.clear()
    }

    const resetGame = () => {
      clearSceneObjects()
      scoreValue = 0
      hullValue = 3
      spawnIn = 0.18
      setScore(0)
      setHull(3)
    }
    resetRef.current = resetGame

    const spawnAsteroid = () => {
      const radius = 0.55 + Math.random() * 0.8
      const detail = Math.random() > 0.65 ? 1 : 0
      const geometry = new THREE.IcosahedronGeometry(radius, detail)
      const hitMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      const hitMesh = new THREE.Mesh(geometry, hitMaterial)
      const edgeGeometry = new THREE.EdgesGeometry(geometry, 11)
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: Math.random() > 0.18 ? 0x00ff66 : 0xfff8e7,
        transparent: true,
        opacity: 0.8,
      })
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
      const group = new THREE.Group()
      group.add(hitMesh, edges)
      group.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 9, -44)
      group.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      scene.add(group)

      const asteroid = {
        group,
        hitMesh,
        edges,
        speed: 6.2 + Math.random() * 4.6,
        spinX: (Math.random() - 0.5) * 1.2,
        spinY: (Math.random() - 0.5) * 1.2,
      }
      hitMesh.userData.asteroid = asteroid
      asteroids.push(asteroid)
    }

    const burst = (position) => {
      const count = 22
      const positions = new Float32Array(count * 3)
      const velocities = []
      for (let index = 0; index < count; index += 1) {
        const direction = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize()
        velocities.push(direction.multiplyScalar(2.2 + Math.random() * 3.5))
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const material = new THREE.PointsMaterial({
        color: 0x00ff66,
        size: 0.12,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const points = new THREE.Points(geometry, material)
      points.position.copy(position)
      scene.add(points)
      explosions.push({ group: points, velocities, life: 0.58 })
    }

    const addLaser = (destination) => {
      const origins = [new THREE.Vector3(-2.6, -2.3, 3.4), new THREE.Vector3(2.6, -2.3, 3.4)]
      origins.forEach((origin) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([origin, destination])
        const material = new THREE.LineBasicMaterial({
          color: 0x00ff66,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        })
        const line = new THREE.Line(geometry, material)
        scene.add(line)
        lasers.push({ group: line, life: 0.12 })
      })
    }

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const shoot = (event) => {
      if (!activeRef.current) return
      updatePointer(event)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(asteroids.map((asteroid) => asteroid.hitMesh), false)
      const destination = hits[0]
        ? hits[0].point.clone()
        : raycaster.ray.at(36, new THREE.Vector3())
      addLaser(destination)

      if (hits[0]) {
        const asteroid = hits[0].object.userData.asteroid
        burst(asteroid.group.position.clone())
        removeFrom(asteroids, asteroid)
        scoreValue += 100
        setScore(scoreValue)
      }
    }

    const resize = () => {
      const width = canvas.clientWidth || window.innerWidth
      const height = canvas.clientHeight || window.innerHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    canvas.addEventListener('pointerdown', shoot)
    window.addEventListener('resize', resize)
    resize()

    const render = () => {
      if (disposed) return
      raf = requestAnimationFrame(render)
      const delta = Math.min(clock.getDelta(), 0.04)

      if (!activeRef.current) {
        renderer.clear()
        return
      }

      if (briefingRef.current) {
        renderer.render(scene, camera)
        return
      }

      spawnIn -= delta
      if (spawnIn <= 0 && hullValue > 0) {
        spawnAsteroid()
        spawnIn = Math.max(0.42, 1.05 - scoreValue / 3600) + Math.random() * 0.35
      }

      for (let index = asteroids.length - 1; index >= 0; index -= 1) {
        const asteroid = asteroids[index]
        asteroid.group.position.z += asteroid.speed * delta
        asteroid.group.rotation.x += asteroid.spinX * delta
        asteroid.group.rotation.y += asteroid.spinY * delta
        const approach = THREE.MathUtils.clamp((asteroid.group.position.z + 44) / 45, 0, 1)
        asteroid.edges.material.opacity = 0.35 + approach * 0.65

        if (asteroid.group.position.z > 4.1) {
          removeFrom(asteroids, asteroid)
          hullValue -= 1
          setHull(hullValue)
          document.body.classList.remove('asteroid-impact')
          void document.body.offsetWidth
          document.body.classList.add('asteroid-impact')
          if (hullValue <= 0) {
            const timer = window.setTimeout(() => {
              resetTimers.delete(timer)
              if (activeRef.current) resetGame()
            }, 900)
            resetTimers.add(timer)
          }
        }
      }

      for (let index = lasers.length - 1; index >= 0; index -= 1) {
        const laser = lasers[index]
        laser.life -= delta
        laser.group.material.opacity = Math.max(0, laser.life / 0.12)
        if (laser.life <= 0) removeFrom(lasers, laser)
      }

      for (let index = explosions.length - 1; index >= 0; index -= 1) {
        const explosion = explosions[index]
        explosion.life -= delta
        const positions = explosion.group.geometry.attributes.position
        for (let particle = 0; particle < positions.count; particle += 1) {
          const velocity = explosion.velocities[particle]
          positions.setXYZ(
            particle,
            positions.getX(particle) + velocity.x * delta,
            positions.getY(particle) + velocity.y * delta,
            positions.getZ(particle) + velocity.z * delta,
          )
        }
        positions.needsUpdate = true
        explosion.group.material.opacity = Math.max(0, explosion.life / 0.58)
        if (explosion.life <= 0) removeFrom(explosions, explosion)
      }

      aimPoint.set(pointer.x * 0.11, pointer.y * 0.08, 0)
      camera.rotation.y += (aimPoint.x - camera.rotation.y) * 0.045
      camera.rotation.x += (-aimPoint.y - camera.rotation.x) * 0.045
      renderer.render(scene, camera)
    }
    render()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      resetRef.current = null
      canvas.removeEventListener('pointerdown', shoot)
      window.removeEventListener('resize', resize)
      clearSceneObjects()
      renderer.dispose()
      document.body.classList.remove('asteroid-impact')
    }
  }, [])

  return (
    <section
      className={`about-game${active ? ' is-active' : ''}`}
      aria-hidden={!active}
      aria-label="Asteroid interception game"
    >
      <canvas ref={canvasRef} className="about-game__canvas" />
      <div className="about-game__wash" aria-hidden="true" />
      <div className="about-game__hud" aria-live="polite">
        <span>SCORE // {String(score).padStart(6, '0')}</span>
        <strong>ASTEROID INTERCEPT</strong>
        <span>HULL // {'◆'.repeat(hull)}{'◇'.repeat(Math.max(0, 3 - hull))}</span>
      </div>
      <div className="about-game__cockpit" aria-hidden="true">
        <span className="about-game__wing about-game__wing--left" />
        <span className="about-game__wing about-game__wing--right" />
        <span className="about-game__dash" />
      </div>
      <p className="about-game__orders">AIM // CLICK TO FIRE</p>
      <button type="button" className="about-game__exit" onClick={onExit} data-cursor>
        ESC // EJECT
      </button>
      {briefing && (
        <div className="about-game__briefing" role="dialog" aria-modal="true" aria-labelledby="order-66-title">
          <p className="eyebrow">// ORDER 66 EXECUTED</p>
          <h2 id="order-66-title">SIGNAL<br />FOUND.</h2>
          <p>
            Congrats, you found my easter egg. You have pressed 66 times. Press escape to exit.
          </p>
          <div className="about-game__tutorial">
            <span><b>01</b> MOVE THE CROSSHAIR TO AIM</span>
            <span><b>02</b> CLICK OR TAP TO FIRE</span>
            <span><b>03</b> STOP ASTEROIDS BEFORE THEY REACH THE HULL</span>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              briefingRef.current = false
              setBriefing(false)
            }}
            data-cursor
          >
            BEGIN INTERCEPT →
          </button>
        </div>
      )}
    </section>
  )
}
