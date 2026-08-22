import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PAPER_W = 1.8
const PAPER_H = 1.8 * 1.414 // A4 portrait ratio

// Draws an A4 sheet with a trapezoid name-tab at the very top.
function createPaperTexture(project) {
  const w = 600
  const h = 848
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff8e7'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#0d0d0d'
  ctx.lineWidth = 6
  ctx.strokeRect(14, 14, w - 28, h - 28)

  // faint ruled lines
  ctx.strokeStyle = 'rgba(13, 13, 13, 0.07)'
  ctx.lineWidth = 2
  for (let y = 200; y < h - 70; y += 44) {
    ctx.beginPath()
    ctx.moveTo(60, y)
    ctx.lineTo(w - 60, y)
    ctx.stroke()
  }

  ctx.fillStyle = '#0d0d0d'
  ctx.font = '700 30px "Space Mono", monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(project.index, 52, 60)

  // trapezoid tab with the project name
  const tTop = 24
  const tBottom = 150
  const tLeft = 80
  const tRight = w - 80
  ctx.fillStyle = '#00ff66'
  ctx.beginPath()
  ctx.moveTo(tLeft, tBottom)
  ctx.lineTo(tLeft + 40, tTop)
  ctx.lineTo(tRight - 40, tTop)
  ctx.lineTo(tRight, tBottom)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#0d0d0d'
  ctx.font = '700 36px "Archivo Black", "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(project.title, w / 2, (tTop + tBottom) / 2, tRight - tLeft - 28)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  return tex
}

// A hollow drawer (open front + top) with A4 papers stacked front-to-back inside.
export default function Cabinet3D({ projects, selectedId, onSelect }) {
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
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 2.0, 9.5)
    camera.lookAt(0, -0.5, 0.7)

    const group = new THREE.Group()
    scene.add(group)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const target = new THREE.Vector3()
    const scaleV = new THREE.Vector3(1, 1, 1)
    const planes = []
    let disposed = false

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

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    fontsReady.then(() => {
      if (disposed) return
      const N = projects.length

      // ---- hollow drawer (deck) ----
      const drawerMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a })
      const w = 2.2
      const d = 1.4
      const h = 4.7
      const floorTop = -2.4
      const cz = 0.95 // z-centre of the drawer
      const t = 0.08

      const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), drawerMat)
      floor.position.set(0, floorTop - 0.05, cz)
      group.add(floor)

      const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), drawerMat)
      back.position.set(0, floorTop + h / 2, cz - d / 2)
      group.add(back)

      const left = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), drawerMat)
      left.position.set(-w / 2, floorTop + h / 2, cz)
      group.add(left)

      const right = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), drawerMat)
      right.position.set(w / 2, floorTop + h / 2, cz)
      group.add(right)

      // green rim on the top front edge
      const rim = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.05, 0.06),
        new THREE.MeshBasicMaterial({ color: 0x00ff66 }),
      )
      rim.position.set(0, floorTop + h, cz + d / 2)
      group.add(rim)

      // ---- stacked papers ----
      const rise = 0.5
      const depth = 0.22
      const frontZ = 1.3

      projects.forEach((p, i) => {
        const tex = createPaperTexture(p)
        const geo = new THREE.PlaneGeometry(PAPER_W, PAPER_H)
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
        const mesh = new THREE.Mesh(geo, mat)

        const y = floorTop + PAPER_H / 2 + i * rise
        const z = frontZ - i * depth
        mesh.userData = {
          id: p.id,
          home: new THREE.Vector3(0, y, z),
          out: new THREE.Vector3(0, 0.1, 3.2),
        }
        mesh.position.copy(mesh.userData.home)
        group.add(mesh)
        planes.push(mesh)
      })
    })

    const clock = new THREE.Clock()
    const animate = () => {
      if (disposed) return
      requestAnimationFrame(animate)
      const sel = selectedRef.current

      if (!reduced) {
        raycaster.setFromCamera(pointer, camera)
        const hovered = new Set(raycaster.intersectObjects(planes, false).map((h) => h.object))

        for (const mesh of planes) {
          const o = mesh.userData
          const isSel = sel && o.id === sel

          let tx = o.home.x
          let ty = o.home.y
          let tz = o.home.z
          if (isSel) {
            tx = o.out.x
            ty = o.out.y
            tz = o.out.z
          } else if (hovered.has(mesh)) {
            tz += 0.35
          }
          target.set(tx, ty, tz)
          mesh.position.lerp(target, 0.1)

          const s = isSel ? 1.15 : 1
          scaleV.setScalar(s)
          mesh.scale.lerp(scaleV, 0.1)
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
        m.material.map.dispose()
        m.material.dispose()
      })
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="cabinet3d" aria-hidden="true" />
}
