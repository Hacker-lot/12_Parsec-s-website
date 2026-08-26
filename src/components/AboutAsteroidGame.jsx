import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import ScanAction from './ScanAction.jsx'

const HI_SCORE_KEY = 'asteroid-hi-score'

// Roguelike upgrade pool. Clearing a wave offers three; take one, stack them.
const UPGRADES = [
  {
    id: 'plating',
    name: 'SPARE PLATING',
    desc: '+1 hull plate, welded on mid-flight.',
    apply: (g) => {
      g.maxHull = Math.min(6, g.maxHull + 1)
      g.hull = Math.min(g.maxHull, g.hull + 1)
    },
  },
  {
    id: 'overclock',
    name: 'OVERCLOCK',
    desc: '+30% score on every kill. Stacks.',
    apply: (g) => { g.scoreMult += 0.3 },
  },
  {
    id: 'blast',
    name: 'BLAST CHARGE',
    desc: 'Kills detonate, damaging nearby asteroids.',
    apply: (g) => { g.blast += 1 },
  },
  {
    id: 'chain',
    name: 'ARC COIL',
    desc: 'Kills arc lightning to the nearest asteroid.',
    apply: (g) => { g.chain += 1 },
  },
  {
    id: 'dilation',
    name: 'TIME DILATION',
    desc: 'Asteroids fly 12% slower. Stacks.',
    apply: (g) => { g.speedMult *= 0.88 },
  },
  {
    id: 'greed',
    name: 'GREED PROTOCOL',
    desc: 'Combo window +1.2s. Greed is good.',
    apply: (g) => { g.comboWindow += 1.2 },
  },
  {
    id: 'crit',
    name: 'LUCKY SALVO',
    desc: '20% chance a kill crits for 3x score. Stacks.',
    apply: (g) => { g.crit += 0.2 },
  },
]

const quotaFor = (wave) => 5 + wave * 3
const speedBaseFor = (wave) => 5.6 + wave * 0.55

// Asteroid variants unlocked as waves climb.
const rollKind = (wave) => {
  const r = Math.random()
  if (wave >= 4 && r < 0.14) return 'bulwark'
  if (wave >= 3 && r < 0.28) return 'splitter'
  if (wave >= 2 && r < 0.46) return 'swift'
  return 'standard'
}

const KIND_STATS = {
  standard: { points: 100, speed: 1, hp: 1, color: 0x00ff66, minR: 0.55, maxR: 1.15 },
  swift: { points: 150, speed: 1.75, hp: 1, color: 0xfff8e7, minR: 0.32, maxR: 0.5 },
  splitter: { points: 200, speed: 0.9, hp: 1, color: 0x00ff66, minR: 0.85, maxR: 1.1 },
  bulwark: { points: 300, speed: 0.62, hp: 2, color: 0x00ff66, minR: 1.15, maxR: 1.5 },
}

const freshRun = () => ({
  score: 0,
  hull: 3,
  maxHull: 3,
  wave: 1,
  combo: 0,
  lastKillAt: -99,
  comboWindow: 3,
  scoreMult: 1,
  blast: 0,
  chain: 0,
  speedMult: 1,
  crit: 0,
  spawned: 0,
  quota: quotaFor(1),
  spawnIn: 0.25,
})

const pad6 = (n) => String(Math.max(0, Math.round(n))).padStart(6, '0')

export default function AboutAsteroidGame({ active, onExit }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  const onExitRef = useRef(onExit)
  const phaseRef = useRef('briefing')
  const gameRef = useRef(freshRun())
  const resetRef = useRef(() => {})
  const redeployRef = useRef(() => {})

  const [phase, setPhase] = useState('briefing') // briefing | run | draft | over
  const [score, setScore] = useState(0)
  const [hull, setHull] = useState(3)
  const [maxHull, setMaxHull] = useState(3)
  const [wave, setWave] = useState(1)
  const [combo, setCombo] = useState(0)
  const [draftOptions, setDraftOptions] = useState([])
  const [newBest, setNewBest] = useState(false)
  const [hiScore, setHiScore] = useState(() => {
    try {
      const stored = Number.parseInt(window.localStorage.getItem(HI_SCORE_KEY) || '0', 10)
      return Number.isFinite(stored) ? stored : 0
    } catch {
      return 0
    }
  })

  const setPhaseAll = (next) => {
    phaseRef.current = next
    setPhase(next)
  }

  const beginIntercept = () => setPhaseAll('run')
  const redeploy = () => {
    redeployRef.current()
    setPhaseAll('run')
  }
  const pickUpgrade = (upgrade) => {
    const g = gameRef.current
    upgrade.apply(g)
    g.wave += 1
    g.spawned = 0
    g.quota = quotaFor(g.wave)
    g.spawnIn = 1.1
    setHull(g.hull)
    setMaxHull(g.maxHull)
    setWave(g.wave)
    setDraftOptions([])
    setPhaseAll('run')
  }

  useEffect(() => {
    activeRef.current = active
    document.body.classList.toggle('asteroid-game-active', active)
    if (active) {
      gameRef.current = freshRun()
      phaseRef.current = 'briefing'
      setPhase('briefing')
      setScore(0)
      setHull(3)
      setMaxHull(3)
      setWave(1)
      setCombo(0)
      setDraftOptions([])
      setNewBest(false)
      resetRef.current()
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
    const asteroids = []
    const lasers = []
    const explosions = []
    const killQueue = []
    const resetTimers = new Set()
    const clock = new THREE.Clock()
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
      gameRef.current = freshRun()
      setScore(0)
      setHull(3)
      setMaxHull(3)
      setWave(1)
      setCombo(0)
    }
    redeployRef.current = resetGame
    resetRef.current = resetGame

    const spawnAsteroid = ({ kind, position, loose } = {}) => {
      const g = gameRef.current
      const resolvedKind = kind || rollKind(g.wave)
      const stats = KIND_STATS[resolvedKind]
      const radius = stats.minR + Math.random() * (stats.maxR - stats.minR)
      const detail = resolvedKind === 'bulwark' ? 1 : Math.random() > 0.65 ? 1 : 0
      const geometry = new THREE.IcosahedronGeometry(radius, detail)
      const hitMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      const hitMesh = new THREE.Mesh(geometry, hitMaterial)
      const edgeGeometry = new THREE.EdgesGeometry(geometry, 11)
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: stats.color,
        transparent: true,
        opacity: 0.8,
      })
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
      const group = new THREE.Group()
      group.add(hitMesh, edges)
      group.position.copy(
        position ||
          new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 9, -44),
      )
      group.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      scene.add(group)

      const asteroid = {
        group,
        hitMesh,
        edges,
        kind: resolvedKind,
        hp: stats.hp,
        points: stats.points,
        speed: (speedBaseFor(g.wave) + Math.random() * 4.2) * stats.speed * g.speedMult,
        spinX: (Math.random() - 0.5) * 1.2,
        spinY: (Math.random() - 0.5) * 1.2,
        flash: 0,
      }
      hitMesh.userData.asteroid = asteroid
      asteroids.push(asteroid)
      if (!loose) g.spawned += 1
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

    const addBeam = (from, to, color = 0x00ff66, life = 0.12) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([from, to])
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      })
      const line = new THREE.Line(geometry, material)
      scene.add(line)
      lasers.push({ group: line, life, maxLife: life })
    }

    const addLaser = (destination) => {
      const origins = [new THREE.Vector3(-2.6, -2.3, 3.4), new THREE.Vector3(2.6, -2.3, 3.4)]
      origins.forEach((origin) => addBeam(origin, destination))
    }

    const damageAsteroid = (asteroid, amount) => {
      asteroid.hp -= amount
      asteroid.flash = 0.22
      if (asteroid.hp <= 0 && !killQueue.includes(asteroid)) killQueue.push(asteroid)
    }

    // Iterative kill resolution: blast / chain upgrades queue more kills.
    const processKills = () => {
      const g = gameRef.current
      while (killQueue.length) {
        const asteroid = killQueue.shift()
        const index = asteroids.indexOf(asteroid)
        if (index < 0) continue

        burst(asteroid.group.position.clone())
        const deathPosition = asteroid.group.position.clone()
        const wasSplitter = asteroid.kind === 'splitter'
        removeFrom(asteroids, asteroid)

        if (wasSplitter) {
          for (let i = 0; i < 2; i += 1) {
            spawnAsteroid({
              kind: 'swift',
              loose: true,
              position: deathPosition
                .clone()
                .add(new THREE.Vector3((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6, 0)),
            })
          }
        }

        // combo + scoring
        const now = clock.elapsedTime
        g.combo = now - g.lastKillAt <= g.comboWindow ? Math.min(9, g.combo + 1) : 1
        g.lastKillAt = now
        let pts = asteroid.points * g.scoreMult * Math.max(1, g.combo)
        if (Math.random() < g.crit) pts *= 3
        if (deathPosition.z > -6) pts *= 1.5 // danger-close bonus
        g.score += Math.round(pts)
        setScore(g.score)
        setCombo(g.combo)

        if (g.blast > 0) {
          const blastRadius = 2.4 + g.blast * 0.9
          asteroids.slice().forEach((other) => {
            if (other.group.position.distanceTo(deathPosition) < blastRadius) {
              damageAsteroid(other, g.blast)
            }
          })
        }
        if (g.chain > 0 && asteroids.length) {
          let nearest = null
          let nearestDist = Infinity
          asteroids.forEach((other) => {
            const dist = other.group.position.distanceTo(deathPosition)
            if (dist < nearestDist) {
              nearestDist = dist
              nearest = other
            }
          })
          if (nearest && nearestDist < 7) {
            addBeam(deathPosition, nearest.group.position.clone(), 0xfff8e7, 0.16)
            damageAsteroid(nearest, g.chain)
          }
        }
      }
    }

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const shoot = (event) => {
      if (!activeRef.current || phaseRef.current !== 'run') return
      updatePointer(event)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(
        asteroids.map((asteroid) => asteroid.hitMesh),
        false,
      )
      const destination = hits[0]
        ? hits[0].point.clone()
        : raycaster.ray.at(36, new THREE.Vector3())
      addLaser(destination)

      if (hits[0]) {
        damageAsteroid(hits[0].object.userData.asteroid, 1)
        processKills()
      } else if (gameRef.current.combo > 0) {
        gameRef.current.combo = 0
        setCombo(0)
      }
    }

    const endRun = () => {
      const g = gameRef.current
      let best = 0
      try {
        best = Number.parseInt(window.localStorage.getItem(HI_SCORE_KEY) || '0', 10) || 0
        if (g.score > best) {
          window.localStorage.setItem(HI_SCORE_KEY, String(g.score))
          best = g.score
          setNewBest(true)
        } else {
          setNewBest(false)
        }
      } catch {
        best = Math.max(g.score, 0)
        setNewBest(true)
      }
      setHiScore(best)
      setPhaseAll('over')
    }

    const clearWave = () => {
      const g = gameRef.current
      g.score += 200 * g.wave
      setScore(g.score)
      const shuffled = [...UPGRADES].sort(() => Math.random() - 0.5)
      setDraftOptions(shuffled.slice(0, 3))
      setPhaseAll('draft')
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

      const g = gameRef.current
      const running = phaseRef.current === 'run'

      if (running) {
        g.spawnIn -= delta
        if (g.spawnIn <= 0 && g.spawned < g.quota) {
          spawnAsteroid()
          g.spawnIn =
            Math.max(0.34, 1.0 - g.wave * 0.05 - g.score / 9000) + Math.random() * 0.3
        }

        for (let index = asteroids.length - 1; index >= 0; index -= 1) {
          const asteroid = asteroids[index]
          asteroid.group.position.z += asteroid.speed * delta
          asteroid.group.rotation.x += asteroid.spinX * delta
          asteroid.group.rotation.y += asteroid.spinY * delta
          const approach = THREE.MathUtils.clamp((asteroid.group.position.z + 44) / 45, 0, 1)
          asteroid.edges.material.opacity = asteroid.flash > 0 ? 1 : 0.35 + approach * 0.65
          if (asteroid.flash > 0) asteroid.flash -= delta

          if (asteroid.group.position.z > 4.1) {
            removeFrom(asteroids, asteroid)
            g.hull -= 1
            g.combo = 0
            setHull(g.hull)
            setCombo(0)
            document.body.classList.remove('asteroid-impact')
            void document.body.offsetWidth
            document.body.classList.add('asteroid-impact')
            if (g.hull <= 0) {
              const timer = window.setTimeout(() => {
                resetTimers.delete(timer)
                if (activeRef.current) endRun()
              }, 700)
              resetTimers.add(timer)
            }
          }
        }

        // wave cleared: quota spent and skies empty → salvage draft
        if (g.spawned >= g.quota && asteroids.length === 0 && g.hull > 0) clearWave()
      }

      for (let index = lasers.length - 1; index >= 0; index -= 1) {
        const laser = lasers[index]
        laser.life -= delta
        laser.group.material.opacity = Math.max(0, laser.life / laser.maxLife)
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

      // Keep the projection stable. Moving the camera after a shot was fired
      // shifted the laser endpoint away from the stationary screen crosshair.
      camera.rotation.x = 0
      camera.rotation.y = 0
      renderer.render(scene, camera)
    }
    render()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      redeployRef.current = () => {}
      resetRef.current = () => {}
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
        <span className="about-game__hud-cell">
          SCORE // {pad6(score)}
          <small>HI // {pad6(hiScore)}</small>
        </span>
        <strong>ASTEROID INTERCEPT // WAVE {String(wave).padStart(2, '0')}</strong>
        <span className="about-game__hud-cell about-game__hud-cell--right">
          HULL // {'◆'.repeat(hull)}{'◇'.repeat(Math.max(0, maxHull - hull))}
          <small>COMBO // x{combo}</small>
        </span>
      </div>
      <div className="about-game__cockpit" aria-hidden="true">
        <span className="about-game__wing about-game__wing--left" />
        <span className="about-game__wing about-game__wing--right" />
        <span className="about-game__dash" />
      </div>
      <p className="about-game__orders">
        {phase === 'run' ? 'AIM // CLICK TO FIRE — MISSES BREAK COMBO' : 'STAND BY'}
      </p>
      <ScanAction label="ESC // EJECT" onClick={onExit} tone="ghost" compact className="about-game__exit" style={{ position: 'absolute' }} />

      {phase === 'briefing' && (
        <div className="about-game__briefing" role="dialog" aria-modal="true" aria-labelledby="order-66-title">
          <p className="eyebrow">// ORDER 66 EXECUTED</p>
          <h2 id="order-66-title">SIGNAL<br />FOUND.</h2>
          <p>
            Congrats, you found my easter egg. You have pressed 66 times. Survive wave after
            wave, salvage an upgrade after each one, and chase the high score. Press escape to exit.
          </p>
          <div className="about-game__tutorial">
            <span><b>01</b> MOVE THE CROSSHAIR TO AIM</span>
            <span><b>02</b> CLICK OR TAP TO FIRE — A MISS BREAKS YOUR COMBO</span>
            <span><b>03</b> CLEAR THE WAVE, DRAFT 1 OF 3 UPGRADES</span>
            <span><b>04</b> HULL HITS ZERO — THE RUN ENDS. SCORE IS KEPT.</span>
          </div>
          <ScanAction label="BEGIN INTERCEPT →" onClick={beginIntercept} className="about-game__begin" />
        </div>
      )}

      {phase === 'draft' && (
        <div className="about-game__briefing about-game__draft" role="dialog" aria-modal="true" aria-labelledby="draft-title">
          <p className="eyebrow">// WAVE {String(wave).padStart(2, '0')} CLEARED — SALVAGE AVAILABLE</p>
          <h2 id="draft-title">CHOOSE<br />UPGRADE.</h2>
          <div className="about-game__draft-grid">
            {draftOptions.map((upgrade) => (
              <button
                key={upgrade.id}
                type="button"
                className="about-game__upgrade"
                onClick={() => pickUpgrade(upgrade)}
                data-cursor
              >
                <b>{upgrade.name}</b>
                <span>{upgrade.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'over' && (
        <div className="about-game__briefing about-game__over" role="dialog" aria-modal="true" aria-labelledby="over-title">
          <p className="eyebrow">// HULL FAILURE — RUN TERMINATED</p>
          <h2 id="over-title">SIGNAL<br />LOST.</h2>
          <div className="about-game__stats">
            <span>FINAL SCORE <b>{pad6(score)}</b></span>
            <span>WAVE REACHED <b>{String(wave).padStart(2, '0')}</b></span>
            <span>BEST RUN <b>{pad6(hiScore)}{newBest ? ' // NEW RECORD' : ''}</b></span>
          </div>
          <ScanAction label="REDEPLOY →" onClick={redeploy} className="about-game__begin" />
        </div>
      )}
    </section>
  )
}
