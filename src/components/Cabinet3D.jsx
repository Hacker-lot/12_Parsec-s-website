import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PAPER_W = 2.55
const PAPER_H = 3.3
const TAB_SLOTS = 4

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const smoothstep = (value) => {
  const x = clamp(value, 0, 1)
  return x * x * (3 - 2 * x)
}

function tabSlot(index) {
  if (TAB_SLOTS === 1) return 0
  const period = (TAB_SLOTS - 1) * 2
  const step = index % period
  return step < TAB_SLOTS ? step : period - step
}

function createPaperTexture(project) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 996
  const ctx = canvas.getContext('2d')
  const seed = Number(project.index) * 37

  ctx.fillStyle = '#eee9d9'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Fine deterministic paper fibre. It reads as texture without dirtying the typography.
  ctx.fillStyle = 'rgba(13, 13, 13, 0.035)'
  for (let i = 0; i < 520; i += 1) {
    const x = (i * 97 + seed * 13) % canvas.width
    const y = (i * 53 + seed * 29) % canvas.height
    ctx.fillRect(x, y, 1 + (i % 3), 1)
  }

  ctx.strokeStyle = '#101310'
  ctx.lineWidth = 7
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36)

  ctx.fillStyle = '#0d0d0d'
  ctx.font = '700 26px "Space Mono", monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`FILE // ${project.index}`, 58, 76)
  ctx.textAlign = 'right'
  ctx.fillText(project.year, canvas.width - 58, 76)

  ctx.fillStyle = '#00ff66'
  ctx.fillRect(58, 116, 104, 9)
  ctx.fillStyle = '#0d0d0d'
  ctx.font = '700 60px "Archivo Black", sans-serif'
  ctx.textAlign = 'left'
  const words = project.title.split(' ')
  words.forEach((word, i) => ctx.fillText(word, 58, 205 + i * 68, canvas.width - 116))

  const bodyY = 205 + words.length * 68 + 40
  ctx.fillStyle = '#60635d'
  ctx.font = '700 20px "Space Mono", monospace'
  ctx.fillText(project.subtitle.toUpperCase(), 58, bodyY, canvas.width - 116)

  ctx.strokeStyle = 'rgba(13, 13, 13, 0.16)'
  ctx.lineWidth = 2
  for (let y = bodyY + 58; y < canvas.height - 115; y += 45) {
    ctx.beginPath()
    ctx.moveTo(58, y)
    ctx.lineTo(canvas.width - 58, y)
    ctx.stroke()
  }

  ctx.fillStyle = '#0d0d0d'
  ctx.font = '700 19px "Space Mono", monospace'
  ctx.fillText(project.tags.join('  /  '), 58, canvas.height - 64, canvas.width - 116)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function createLabelTexture(label) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#00ff66'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#09100b'
  ctx.font = '700 38px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, canvas.width / 2, canvas.height / 2, canvas.width - 34)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createPlateTexture(count) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#101310'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#00ff66'
  ctx.lineWidth = 8
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
  ctx.fillStyle = '#00ff66'
  ctx.font = '700 31px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`PROJECT ARCHIVE  /  ${String(count).padStart(2, '0')} FILES`, 384, 80)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createTabGeometry(slot) {
  const slotWidth = (PAPER_W - 0.42) / TAB_SLOTS
  const left = -PAPER_W / 2 + 0.21 + slot * slotWidth
  const right = left + slotWidth + 0.12
  const shape = new THREE.Shape()
  shape.moveTo(left, PAPER_H / 2)
  shape.lineTo(left + 0.12, PAPER_H / 2 + 0.3)
  shape.lineTo(right - 0.12, PAPER_H / 2 + 0.3)
  shape.lineTo(right, PAPER_H / 2)
  shape.closePath()
  return { geometry: new THREE.ShapeGeometry(shape), left, right }
}

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
    if (!canvas) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x090b09, 8.5, 14)

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
    camera.position.set(0, 1.0, 10.2)
    camera.lookAt(0, -0.25, 0)

    const cabinet = new THREE.Group()
    cabinet.rotation.x = -0.035
    scene.add(cabinet)

    scene.add(new THREE.HemisphereLight(0xd8ffe5, 0x050705, 1.3))
    const key = new THREE.DirectionalLight(0xffffff, 3.2)
    key.position.set(-3.5, 6, 7)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key)
    const greenLight = new THREE.PointLight(0x00ff66, 5, 8, 2)
    greenLight.position.set(2.7, 1.8, 3.6)
    scene.add(greenLight)

    const steel = new THREE.MeshStandardMaterial({
      color: 0x151a16,
      roughness: 0.63,
      metalness: 0.82,
    })
    const innerSteel = new THREE.MeshStandardMaterial({
      color: 0x080b09,
      roughness: 0.8,
      metalness: 0.55,
    })
    const green = new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x003b18,
      roughness: 0.45,
      metalness: 0.32,
    })

    const addBox = (size, position, material = steel) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
      mesh.position.set(...position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      cabinet.add(mesh)
      return mesh
    }

    addBox([4.45, 0.22, 2.5], [0, -2.26, 0.15], innerSteel)
    addBox([0.25, 4.8, 2.5], [-2.18, 0.03, 0.15])
    addBox([0.25, 4.8, 2.5], [2.18, 0.03, 0.15])
    addBox([4.45, 0.34, 2.5], [0, 2.34, 0.15])
    addBox([4.1, 4.45, 0.15], [0, 0.05, -1.04], innerSteel)
    addBox([4.45, 0.08, 0.12], [0, -1.96, 1.39], green)
    addBox([4.45, 0.08, 0.12], [0, 2.13, 1.39], green)

    const plateTexture = createPlateTexture(projects.length)
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(2.45, 0.51),
      new THREE.MeshBasicMaterial({ map: plateTexture }),
    )
    plate.position.set(0, -2.08, 1.465)
    cabinet.add(plate)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(8, 8)
    const targetPosition = new THREE.Vector3()
    const targetScale = new THREE.Vector3()
    const papers = []
    const hitTargets = []
    let disposed = false
    let pointerInside = false
    let pointerDown = false
    let pointerId = null
    let downX = 0
    let downY = 0
    let lastY = 0
    let moved = false
    let browse = 0
    let browseTarget = 0
    let browseVelocity = 0

    const paperMaterialOptions = {
      side: THREE.DoubleSide,
      roughness: 0.92,
      metalness: 0,
    }

    const buildPapers = () => {
      projects.forEach((project, index) => {
        const group = new THREE.Group()
        const geometry = new THREE.PlaneGeometry(PAPER_W, PAPER_H, 12, 18)
        const basePositions = geometry.attributes.position.array.slice()
        const material = new THREE.MeshStandardMaterial({
          ...paperMaterialOptions,
          map: createPaperTexture(project),
        })
        const body = new THREE.Mesh(geometry, material)
        body.castShadow = true
        body.receiveShadow = true
        body.userData.paperIndex = index
        group.add(body)

        const slot = tabSlot(index)
        const tabData = createTabGeometry(slot)
        const tab = new THREE.Mesh(tabData.geometry, green.clone())
        tab.position.z = 0.006
        tab.castShadow = true
        tab.userData.paperIndex = index
        group.add(tab)

        const labelWidth = tabData.right - tabData.left - 0.12
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(labelWidth, 0.18),
          new THREE.MeshBasicMaterial({ map: createLabelTexture(project.codeName || project.title) }),
        )
        label.position.set((tabData.left + tabData.right) / 2, PAPER_H / 2 + 0.16, 0.012)
        label.userData.paperIndex = index
        group.add(label)

        group.userData = {
          id: project.id,
          index,
          body,
          material,
          basePositions,
          currentBend: 0,
          targetBend: 0,
          labelMaterial: label.material,
          tabMaterial: tab.material,
        }
        cabinet.add(group)
        papers.push(group)
        hitTargets.push(body, tab, label)
      })
    }

    const fontsReady = document.fonts?.ready || Promise.resolve()
    fontsReady.then(() => {
      if (!disposed) buildPapers()
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1), false)
      camera.aspect = Math.max(rect.width, 1) / Math.max(rect.height, 1)
      const narrow = rect.width < 680
      camera.position.set(0, narrow ? 0.7 : 1.0, narrow ? 11.9 : 10.2)
      camera.lookAt(0, -0.25, 0)
      camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect()
      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top
      pointer.x = (localX / rect.width) * 2 - 1
      pointer.y = -(localY / rect.height) * 2 + 1
      return { rect, localX, localY }
    }

    const onPointerEnter = () => {
      pointerInside = true
    }
    const onPointerLeave = () => {
      pointerInside = false
      if (!pointerDown) pointer.set(8, 8)
    }
    const onPointerDown = (event) => {
      const { localX, localY } = updatePointer(event)
      pointerDown = true
      pointerId = event.pointerId
      downX = localX
      downY = localY
      lastY = localY
      moved = false
      canvas.setPointerCapture(event.pointerId)
    }
    const onPointerMove = (event) => {
      const { rect, localX, localY } = updatePointer(event)
      if (pointerDown && event.pointerId === pointerId) {
        const dy = localY - lastY
        if (Math.hypot(localX - downX, localY - downY) > 7) moved = true
        browseTarget = clamp(browseTarget + (dy / rect.height) * projects.length * 2.35, 0, projects.length - 1)
        browseVelocity += (dy / rect.height) * 0.9
        lastY = localY
      }
    }
    const onWheel = (event) => {
      if (selectedRef.current) return
      const max = projects.length - 1
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 18
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? canvas.clientHeight
          : 1
      const delta = event.deltaY * unit
      const canBrowse = (delta > 0 && browseTarget < max) || (delta < 0 && browseTarget > 0)
      if (!canBrowse) return

      event.preventDefault()
      browseTarget = clamp(browseTarget + delta * 0.0042, 0, max)
      browseVelocity += clamp(delta * 0.00038, -0.16, 0.16)
    }
    const finishPointer = (event) => {
      if (!pointerDown || event.pointerId !== pointerId) return
      pointerDown = false
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      if (!moved) {
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.intersectObjects(hitTargets, false)[0]
        if (hit) {
          const index = hit.object.userData.paperIndex
          const paper = papers[index]
          if (paper) {
            browseTarget = index
            onSelectRef.current(paper.userData.id === selectedRef.current ? null : paper.userData.id)
          }
        } else if (selectedRef.current) {
          onSelectRef.current(null)
        }
      }
      pointerId = null
    }

    canvas.addEventListener('pointerenter', onPointerEnter)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', finishPointer)
    canvas.addEventListener('pointercancel', finishPointer)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    const updatePaperBend = (paper, bend) => {
      const data = paper.userData
      data.currentBend += (bend - data.currentBend) * (reducedMotion ? 1 : 0.12)
      const positions = data.body.geometry.attributes.position
      const source = data.basePositions
      for (let i = 0; i < positions.count; i += 1) {
        const y = source[i * 3 + 1]
        const x = source[i * 3]
        const topness = clamp((y + PAPER_H / 2) / PAPER_H, 0, 1)
        const edgeFlutter = Math.sin((x / PAPER_W + 0.5) * Math.PI) * 0.018
        positions.array[i * 3 + 2] = Math.pow(topness, 2.55) * data.currentBend + edgeFlutter * data.currentBend
      }
      positions.needsUpdate = true
      data.body.geometry.computeVertexNormals()
    }

    let frame = 0
    const animate = () => {
      if (disposed) return
      frame = requestAnimationFrame(animate)

      browseVelocity += (browseTarget - browse) * (reducedMotion ? 1 : 0.055)
      browseVelocity *= reducedMotion ? 0 : 0.76
      browse = reducedMotion ? browseTarget : clamp(browse + browseVelocity, 0, projects.length - 1)

      raycaster.setFromCamera(pointer, camera)
      const hoverHit = pointerInside ? raycaster.intersectObjects(hitTargets, false)[0] : null
      const hoverIndex = hoverHit?.object.userData.paperIndex
      canvas.classList.toggle('is-grabbing', pointerDown)
      canvas.classList.toggle('is-over-file', Number.isInteger(hoverIndex))

      papers.forEach((paper, index) => {
        const selected = paper.userData.id === selectedRef.current
        const anotherSelected = selectedRef.current && !selected
        const passed = smoothstep(browse - index)
        const proximity = Math.max(0, 1 - Math.abs(index - browse))
        const hovered = index === hoverIndex
        const baseY = -0.15 + index * 0.11
        const baseZ = 0.73 - index * 0.075

        const fallSide = index % 2 === 0 ? -1 : 1
        let x = fallSide * passed * (0.38 + index * 0.025)
        let y = baseY - passed * (3.25 + index * 0.08)
        let z = baseZ + passed * 0.5 + proximity * 0.12 + (hovered ? 0.1 : 0)
        let rotationX = -0.035 - passed * 0.24
        let rotationZ = fallSide * passed * 0.12
        let scale = 1

        if (selected) {
          y = 0.18
          z = 3.15
          rotationX = -0.01
          rotationZ = 0
          scale = 1.13
        } else if (anotherSelected) {
          z -= 0.32
          scale = 0.985
        }

        targetPosition.set(x, y, z)
        targetScale.setScalar(scale)
        const ease = reducedMotion ? 1 : selected ? 0.095 : 0.15
        paper.position.lerp(targetPosition, ease)
        paper.scale.lerp(targetScale, ease)
        paper.rotation.x += (rotationX - paper.rotation.x) * ease
        paper.rotation.z += (rotationZ - paper.rotation.z) * ease

        const bend = selected ? 0.025 : 0.055 + passed * 0.2 + proximity * 0.16 + Math.min(Math.abs(browseVelocity) * 1.7, 0.24)
        updatePaperBend(paper, bend)

        const browseOpacity = 1 - passed * 0.96
        const opacity = anotherSelected ? Math.min(0.42, browseOpacity) : browseOpacity
        paper.userData.material.transparent = true
        paper.userData.material.opacity += (opacity - paper.userData.material.opacity) * 0.14
        paper.userData.tabMaterial.transparent = true
        paper.userData.tabMaterial.opacity = paper.userData.material.opacity
        paper.userData.labelMaterial.transparent = true
        paper.userData.labelMaterial.opacity = paper.userData.material.opacity
        paper.visible = paper.userData.material.opacity > 0.025 || selected
        paper.renderOrder = selected ? 100 : index
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerenter', onPointerEnter)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', finishPointer)
      canvas.removeEventListener('pointercancel', finishPointer)
      canvas.removeEventListener('wheel', onWheel)
      cabinet.traverse((object) => {
        object.geometry?.dispose()
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => {
            material.map?.dispose()
            material.dispose()
          })
        }
      })
      renderer.dispose()
    }
  }, [projects])

  return <canvas ref={canvasRef} className="cabinet3d" aria-hidden="true" />
}
