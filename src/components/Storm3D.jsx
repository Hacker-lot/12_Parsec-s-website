import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Bleeding negative: colour in the middle, B&W film-negative at the rim.
const FRAG = `
  uniform sampler2D uMap;
  uniform float uNeg;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
    vec3 neg = vec3(1.0 - g);
    vec3 col = mix(c.rgb, neg, uNeg);
    gl_FragColor = vec4(col, c.a);
  }
`

const MIN_R = 0.9 // inner reach of the vortex
const MAX_R = 4.3 // outer rim (full negative)
const BASE_W = 1.7 // paper width in world units
const FLY_Z = 7 // z of the enlarged photo

// A swirling 3D storm of photos spiralling inward around a central axis.
export default function Storm3D({ images, selectedId, onSelect }) {
  const canvasRef = useRef(null)
  const selectedRef = useRef(selectedId)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    selectedRef.current = selectedId
  }, [selectedId])

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
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 0, 10)

    const group = new THREE.Group()
    scene.add(group)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const mouse = new THREE.Vector2()
    const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const mouseWorld = new THREE.Vector3()
    const magnet = new THREE.Vector3()
    const target = new THREE.Vector3()
    const scaleV = new THREE.Vector3(1, 1, 1)

    const planes = []
    let disposed = false

    // swirling debris (the storm's dust)
    const debrisN = 220
    const dpos = new Float32Array(debrisN * 3)
    for (let i = 0; i < debrisN; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.6 + Math.random() * 4.6
      dpos[i * 3] = Math.cos(a) * r
      dpos[i * 3 + 1] = (Math.random() - 0.5) * 3
      dpos[i * 3 + 2] = Math.sin(a) * r
    }
    const debrisGeo = new THREE.BufferGeometry()
    debrisGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
    const debrisMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00ff66,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const debris = new THREE.Points(debrisGeo, debrisMat)
    group.add(debris)

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
      mouse.copy(pointer)
    }
    const onClick = () => {
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(planes, false)
      if (hits.length) {
        const id = hits[0].object.userData.id
        if (id) onSelectRef.current(id === selectedRef.current ? null : id)
      }
    }
    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('click', onClick)

    const loader = new THREE.TextureLoader()

    // Build photo planes.
    ;(async () => {
      for (let i = 0; i < images.length; i++) {
        const url = images[i].url
        const tex = await new Promise((res, rej) => loader.load(url, res, undefined, rej)).catch(
          () => null,
        )
        if (disposed) {
          if (tex) tex.dispose()
          return
        }
        if (!tex) continue
        tex.colorSpace = THREE.SRGBColorSpace

        const img = tex.image
        const aspect = img && img.width ? img.width / img.height : 4 / 3
        const geo = new THREE.PlaneGeometry(BASE_W, BASE_W / aspect)
        const mat = new THREE.ShaderMaterial({
          uniforms: { uMap: { value: tex }, uNeg: { value: 0 } },
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          side: THREE.DoubleSide,
        })
        const mesh = new THREE.Mesh(geo, mat)

        // spread evenly across the radial range (clear bleeding-edge gradient)
        const frac = images.length > 1 ? i / (images.length - 1) : 0
        const radius = MIN_R + frac * (MAX_R - MIN_R)
        const angle = i * 2.39996

        mesh.userData = {
          id: images[i].id,
          aspect,
          radius,
          angle,
          y: ((i % 4) - 1.5) * 1.15,
          inward: reduced ? 0 : 0.16 + (i % 3) * 0.02,
          phase: i * 1.37,
          targetScale: 1,
        }
        mesh.position.set(radius * Math.cos(angle), mesh.userData.y, radius * Math.sin(angle))
        mat.uniforms.uNeg.value = THREE.MathUtils.clamp(
          (radius - MIN_R) / (MAX_R - MIN_R),
          0,
          1,
        )
        mesh.lookAt(camera.position)

        group.add(mesh)
        planes.push(mesh)
      }
    })()

    const clock = new THREE.Clock()
    const animate = () => {
      if (disposed) return
      requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime
      const sel = selectedRef.current

      if (!reduced) {
        debris.rotation.y += dt * 0.22

        raycaster.setFromCamera(mouse, camera)
        if (raycaster.ray.intersectPlane(zPlane, mouseWorld)) {
          mouseWorld.x = THREE.MathUtils.clamp(mouseWorld.x, -4.5, 4.5)
          mouseWorld.y = THREE.MathUtils.clamp(mouseWorld.y, -4.5, 4.5)
        }

        const hovered = new Set(
          raycaster.intersectObjects(planes, false).map((h) => h.object),
        )

        for (const mesh of planes) {
          const o = mesh.userData
          const isSel = sel && o.id === sel

          if (isSel) {
            // full colour + fit the whole image within the viewport
            mesh.material.uniforms.uNeg.value = 0
            const dist = camera.position.z - FLY_Z
            const vh = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
            const vw = vh * camera.aspect
            o.targetScale = Math.min((0.82 * vw) / BASE_W, (0.82 * vh * o.aspect) / BASE_W)

            target.set(0, 0, FLY_Z)
            mesh.position.lerp(target, 0.04)
            scaleV.setScalar(o.targetScale)
            mesh.scale.lerp(scaleV, 0.06)
          } else {
            // rotate + spiral inward (recursive vortex)
            o.angle += (1.7 / Math.sqrt(o.radius + 0.3)) * dt
            o.radius -= o.inward * dt
            if (o.radius < MIN_R) o.radius = MAX_R // recurse back to the outer rim

            const orbitPos = new THREE.Vector3(
              o.radius * Math.cos(o.angle),
              o.y + Math.sin(t * 0.8 + o.phase) * 0.12,
              o.radius * Math.sin(o.angle),
            )
            magnet.subVectors(mouseWorld, orbitPos).multiplyScalar(0.22)
            target.copy(orbitPos).add(magnet)
            o.targetScale = sel ? 0.5 : hovered.has(mesh) ? 1.16 : 1
            mesh.position.lerp(target, 0.14)
            scaleV.setScalar(o.targetScale)
            mesh.scale.lerp(scaleV, 0.12)

            // radial "bleeding" negative — colour at centre, negative at the rim
            const r = Math.hypot(mesh.position.x, mesh.position.z)
            mesh.material.uniforms.uNeg.value = THREE.MathUtils.clamp(
              (r - MIN_R) / (MAX_R - MIN_R),
              0,
              1,
            )
          }

          mesh.lookAt(camera.position)
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('click', onClick)
      planes.forEach((m) => {
        m.geometry.dispose()
        m.material.uniforms.uMap.value.dispose()
        m.material.dispose()
      })
      debrisGeo.dispose()
      debrisMat.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="storm3d" aria-hidden="true" />
}
