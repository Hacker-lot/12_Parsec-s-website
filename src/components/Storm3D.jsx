import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Gradient negative film: a photo burns to B&W negative from its edges inward,
// pushed by how far up the funnel wall it rides (uNeg), and fades with depth.
const FRAG = `
  uniform sampler2D uMap;
  uniform float uNeg;
  uniform float uAlpha;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
    vec3 neg = vec3(1.0 - g);
    float edge = smoothstep(0.16, 0.7, distance(vUv, vec2(0.5)));
    float amt = clamp(uNeg + edge * 0.55, 0.0, 1.0);
    vec3 col = mix(c.rgb, neg, amt);
    gl_FragColor = vec4(col, c.a * uAlpha);
  }
`

// Funnel geometry — the viewer stands in the eye, the wall spins around them.
const Y_MIN = -3.6 // narrow throat of the funnel
const Y_MAX = 4.8 // wide rim overhead
const R_MIN = 2.3
const R_MAX = 7.4
const BASE_W = 2.3 // media width in world units
const FOCUS_ANCHOR = new THREE.Vector3(1.45, -0.05, -3.1) // camera-space, right of the detail panel

const radiusAt = (y) =>
  R_MIN + ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (R_MAX - R_MIN)

const isVideo = (url) => /\.(mp4|webm|ogg)(\?|$)/i.test(url)

// A tornado of media. Photos, videos and album sleeves rise along the funnel
// wall, spinning faster near the throat; the audience stands in the eye.
export default function Storm3D({ media, selectedSerial, onSelect }) {
  const canvasRef = useRef(null)
  const planesRef = useRef([])
  const selectedRef = useRef(selectedSerial)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    selectedRef.current = selectedSerial
    planesRef.current.forEach((mesh) => {
      const o = mesh.userData
      const focused = selectedSerial != null && o.serial === selectedSerial
      o.mode = focused ? 'focus' : 'orbit'
      if (!focused) {
        // re-enter the funnel from wherever the mesh currently floats
        o.y = THREE.MathUtils.clamp(mesh.position.y, Y_MIN, Y_MAX)
        o.angle = Math.atan2(mesh.position.z, mesh.position.x)
      }
    })
  }, [selectedSerial])

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!window.matchMedia('(min-width: 901px)').matches) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 60)
    camera.position.set(0, 0.3, 0)
    scene.add(camera)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(-2, -2)
    const anchorWorld = new THREE.Vector3()
    const target = new THREE.Vector3()
    const scaleV = new THREE.Vector3(1, 1, 1)

    let disposed = false
    let timeScale = 1
    let yaw = 0
    let pitch = 0
    let yawTarget = 0
    let pitchTarget = 0

    // wind-blown dust inside the funnel
    const debrisN = 260
    const dpos = new Float32Array(debrisN * 3)
    for (let i = 0; i < debrisN; i++) {
      const y = Y_MIN + Math.random() * (Y_MAX - Y_MIN)
      const a = Math.random() * Math.PI * 2
      const r = radiusAt(y) * (0.75 + Math.random() * 0.3)
      dpos[i * 3] = Math.cos(a) * r
      dpos[i * 3 + 1] = y
      dpos[i * 3 + 2] = Math.sin(a) * r
    }
    const debrisGeo = new THREE.BufferGeometry()
    debrisGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
    const debrisMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x00ff66,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const debris = new THREE.Points(debrisGeo, debrisMat)
    scene.add(debris)

    // faint structural rings tracing the funnel
    const ringGroup = new THREE.Group()
    for (let i = 0; i <= 5; i += 1) {
      const y = Y_MIN + (i / 5) * (Y_MAX - Y_MIN)
      const r = radiusAt(y)
      const pts = new THREE.EllipseCurve(0, 0, r, r).getPoints(72)
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({
        color: 0x00ff66,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      })
      const ring = new THREE.LineLoop(geo, mat)
      ring.rotation.x = -Math.PI / 2
      ring.position.y = y
      ringGroup.add(ring)
    }
    scene.add(ringGroup)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.clientWidth || 1
      const h = parent.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
      if (selectedRef.current == null && !reduced) {
        yawTarget = -pointer.x * 0.38
        pitchTarget = pointer.y * 0.2
      }
    }
    const onClick = () => {
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(planesRef.current, false)
      if (!hits.length) return
      const serial = hits[0].object.userData.serial
      if (!serial) return
      // while one item is focused, only it answers (click it to release)
      if (selectedRef.current != null && serial !== selectedRef.current) return
      onSelectRef.current(serial === selectedRef.current ? null : serial)
    }
    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('click', onClick)

    const textureLoader = new THREE.TextureLoader()
    const videos = []

    const loadTexture = (url) => {
      if (isVideo(url)) {
        const video = document.createElement('video')
        video.src = url
        video.muted = true
        video.loop = true
        video.playsInline = true
        video.play().catch(() => {})
        videos.push(video)
        const tex = new THREE.VideoTexture(video)
        tex.colorSpace = THREE.SRGBColorSpace
        return Promise.resolve(tex)
      }
      return new Promise((res, rej) => textureLoader.load(url, res, undefined, rej)).catch(
        () => null,
      )
    }

    // Build media planes along the funnel wall.
    ;(async () => {
      for (let i = 0; i < media.length; i++) {
        const tex = await loadTexture(media[i].url)
        if (disposed) {
          if (tex) tex.dispose()
          return
        }
        if (!tex) continue

        const img = tex.image
        const aspect = img && img.width ? img.width / img.height : 4 / 3
        const geo = new THREE.PlaneGeometry(BASE_W, BASE_W / aspect)
        const mat = new THREE.ShaderMaterial({
          uniforms: { uMap: { value: tex }, uNeg: { value: 0.5 }, uAlpha: { value: 1 } },
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          side: THREE.DoubleSide,
        })
        const mesh = new THREE.Mesh(geo, mat)

        const y = Y_MIN + ((i + 0.5) / media.length) * (Y_MAX - Y_MIN)
        const angle = i * 2.39996 // golden angle spread
        mesh.userData = {
          serial: media[i].serial,
          aspect,
          y,
          angle,
          rise: reduced ? 0.06 : 0.5 + Math.random() * 0.4,
          rJit: (Math.random() - 0.5) * 0.7,
          bobPhase: i * 1.37,
          mode: selectedRef.current === media[i].serial ? 'focus' : 'orbit',
        }
        mesh.position.set(
          radiusAt(y) * Math.cos(angle),
          y,
          radiusAt(y) * Math.sin(angle),
        )
        mesh.lookAt(camera.position)

        scene.add(mesh)
        planesRef.current.push(mesh)
      }
    })()

    const clock = new THREE.Clock()
    const animate = () => {
      if (disposed) return
      requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime
      const sel = selectedRef.current

      // the storm holds its breath while an item is extracted
      timeScale += ((sel ? 0.16 : 1) - timeScale) * Math.min(1, dt * 3)
      if (reduced) timeScale = Math.min(timeScale, 0.15)

      // look around the eye — locked while an item is extracted
      if (sel != null) {
        yawTarget = 0
        pitchTarget = 0
      }
      yaw += (yawTarget - yaw) * Math.min(1, dt * 4)
      pitch += (pitchTarget - pitch) * Math.min(1, dt * 4)
      camera.rotation.set(pitch, yaw, 0, 'YXZ')
      camera.position.y = 0.3 + (reduced ? 0 : Math.sin(t * 0.4) * 0.12)

      debris.rotation.y += dt * 0.9 * timeScale
      ringGroup.rotation.y -= dt * 0.05 * timeScale

      for (const mesh of planesRef.current) {
        const o = mesh.userData
        const focused = sel != null && o.serial === sel

        if (o.mode === 'focus') {
          // tear out of the wall, fill most of the screen, regain colour
          anchorWorld.copy(FOCUS_ANCHOR)
          camera.localToWorld(anchorWorld)
          const dist = camera.position.distanceTo(anchorWorld)
          const vh = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
          const vw = vh * camera.aspect
          const fit = Math.min((0.5 * vw) / BASE_W, (0.8 * vh * o.aspect) / BASE_W)

          mesh.position.lerp(anchorWorld, 0.075)
          scaleV.setScalar(fit)
          mesh.scale.lerp(scaleV, 0.085)
          mesh.material.uniforms.uNeg.value +=
            (0 - mesh.material.uniforms.uNeg.value) * 0.1
          mesh.material.uniforms.uAlpha.value +=
            (1 - mesh.material.uniforms.uAlpha.value) * 0.12
        } else {
          // rise along the funnel wall; the throat spins fastest
          o.y += o.rise * dt * timeScale
          if (o.y > Y_MAX) {
            o.y = Y_MIN
            o.angle = Math.random() * Math.PI * 2
          }
          const r = radiusAt(o.y) + o.rJit
          o.angle += (2.8 / Math.sqrt(Math.max(r, 0.8))) * dt * timeScale

          target.set(
            r * Math.cos(o.angle),
            o.y + Math.sin(t * 0.8 + o.bobPhase) * 0.14,
            r * Math.sin(o.angle),
          )
          mesh.position.lerp(target, Math.min(1, dt * 9))
          scaleV.setScalar(1)
          mesh.scale.lerp(scaleV, 0.1)

          // gradient negative: colour near the eye, burnt negative at the rim
          const neg = THREE.MathUtils.clamp((r - R_MIN) / (R_MAX - R_MIN), 0, 1) * 0.9
          mesh.material.uniforms.uNeg.value += (neg - mesh.material.uniforms.uNeg.value) * 0.1

          // depth fade across the funnel + dim the wall while one is out
          const dist = mesh.position.distanceTo(camera.position)
          const depthFade = THREE.MathUtils.clamp(1.25 - dist / 12, 0, 1)
          const alpha = depthFade * (sel ? 0.22 : 1)
          mesh.material.uniforms.uAlpha.value +=
            (alpha - mesh.material.uniforms.uAlpha.value) * 0.12
        }

        mesh.lookAt(camera.position)
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('click', onClick)
      planesRef.current.forEach((m) => {
        m.geometry.dispose()
        m.material.uniforms.uMap.value.dispose()
        m.material.dispose()
        scene.remove(m)
      })
      planesRef.current = []
      videos.forEach((v) => {
        v.pause()
        v.removeAttribute('src')
      })
      debrisGeo.dispose()
      debrisMat.dispose()
      ringGroup.children.forEach((ring) => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="storm3d" aria-hidden="true" />
}
