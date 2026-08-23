import * as THREE from 'three'

const GREEN = new THREE.Color('#00ff66')
const PINK = new THREE.Color('#ff2dd6')
const WARM_WHITE = new THREE.Color('#fff8e7')
const REVEAL_MIN_Y = -1.12
const REVEAL_MAX_Y = 1.58

function seededNoise(index) {
  const value = Math.sin(index * 91.3458 + 17.153) * 47453.5453
  return value - Math.floor(value)
}

function createPointMaterial(revealUniform, { opacity = 0.9, size = 4.2 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRevealY: revealUniform,
      uRevealSoftness: { value: 0.1 },
      uOpacity: { value: opacity },
      uPointSize: { value: size },
    },
    vertexShader: `
      uniform float uPointSize;
      attribute float importance;
      varying vec3 vColor;
      varying float vWorldY;
      varying float vImportance;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;
        vWorldY = worldPosition.y;
        vColor = color;
        vImportance = importance;
        gl_PointSize = uPointSize * mix(0.58, 1.28, importance) * (5.0 / -viewPosition.z);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform float uRevealY;
      uniform float uRevealSoftness;
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vWorldY;
      varying float vImportance;

      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float radius = length(center);
        if (radius > 0.5) discard;
        float revealed = 1.0 - smoothstep(uRevealY - uRevealSoftness, uRevealY + uRevealSoftness, vWorldY);
        float disc = 1.0 - smoothstep(0.3, 0.5, radius);
        float core = 1.0 - smoothstep(0.0, 0.17, radius);
        if (revealed < 0.015) discard;
        gl_FragColor = vec4(vColor, revealed * uOpacity * (disc * 0.58 + core * 0.42) * mix(0.6, 1.0, vImportance));
      }
    `,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
}

function createLineMaterial(revealUniform, opacity = 0.92) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRevealY: revealUniform,
      uRevealSoftness: { value: 0.1 },
      uOpacity: { value: opacity },
    },
    vertexShader: `
      varying vec3 vColor;
      varying float vWorldY;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldY = worldPosition.y;
        vColor = color;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float uRevealY;
      uniform float uRevealSoftness;
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vWorldY;

      void main() {
        float revealed = 1.0 - smoothstep(uRevealY - uRevealSoftness, uRevealY + uRevealSoftness, vWorldY);
        if (revealed < 0.015) discard;
        gl_FragColor = vec4(vColor, revealed * uOpacity);
      }
    `,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
}

function addPointAttributes(geometry, worldOffsetY = 0, whiteMix = 0) {
  const position = geometry.getAttribute('position')
  const colors = new Float32Array(position.count * 3)
  const importance = geometry.getAttribute('importance')
    ?? new THREE.BufferAttribute(new Float32Array(position.count).fill(0.72), 1)
  const mixed = new THREE.Color()

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index)
    const y = position.getY(index) + worldOffsetY
    const gradient = THREE.MathUtils.clamp(
      THREE.MathUtils.smoothstep(y, REVEAL_MIN_Y, REVEAL_MAX_Y) * 0.62 + (x + 1) * 0.19,
      0,
      1,
    )
    mixed.copy(GREEN).lerp(PINK, gradient).lerp(WARM_WHITE, whiteMix)
    colors[index * 3] = mixed.r
    colors[index * 3 + 1] = mixed.g
    colors[index * 3 + 2] = mixed.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('importance', importance)
}

function createPointPath(name, sourcePoints, material, {
  samples = 28,
  worldOffsetY = 0,
  whiteMix = 0,
  importance = 0.9,
} = {}) {
  const curve = new THREE.CatmullRomCurve3(sourcePoints.map((point) => new THREE.Vector3(...point)))
  const points = curve.getPoints(samples)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  geometry.setAttribute('importance', new THREE.BufferAttribute(new Float32Array(points.length).fill(importance), 1))
  addPointAttributes(geometry, worldOffsetY, whiteMix)
  const cloud = new THREE.Points(geometry, material)
  cloud.name = name
  cloud.userData.partId = name
  return cloud
}

function createLinePath(name, sourcePoints, material, {
  samples = 48,
  worldOffsetY = 0,
  whiteMix = 0,
  closed = false,
} = {}) {
  const curve = new THREE.CatmullRomCurve3(
    sourcePoints.map((point) => new THREE.Vector3(...point)),
    closed,
    'centripetal',
  )
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(samples))
  addPointAttributes(geometry, worldOffsetY, whiteMix)
  const line = new THREE.Line(geometry, material)
  line.name = name
  line.userData.partId = name
  return line
}

function sculptHeadGeometry() {
  const geometry = new THREE.SphereGeometry(1, 72, 56)
  const positions = geometry.getAttribute('position')
  const vertex = new THREE.Vector3()

  for (let index = 0; index < positions.count; index += 1) {
    vertex.fromBufferAttribute(positions, index)
    const lower = THREE.MathUtils.smoothstep(vertex.y, -0.98, -0.08)
    const chinTaper = 1 - 0.24 * Math.exp(-Math.pow((vertex.y + 0.9) * 5.1, 2))
    const cheekWidth = 1 + 0.052 * Math.exp(-Math.pow((vertex.y + 0.05) * 3.6, 2))
    const jaw = THREE.MathUtils.lerp(0.56, 1, lower)
    const temple = 1 - 0.035 * Math.exp(-Math.pow((vertex.y - 0.43) * 4.5, 2))
    const crown = vertex.y > 0.62 ? THREE.MathUtils.lerp(1, 0.94, (vertex.y - 0.62) / 0.38) : 1

    vertex.x *= 0.82 * jaw * cheekWidth * temple * crown * chinTaper
    vertex.y *= 1.06
    vertex.z *= vertex.z > 0 ? 0.62 : 0.72

    if (vertex.z > 0) {
      const eyeSocketL = Math.exp(-((vertex.x - 0.3) ** 2 / 0.038 + (vertex.y - 0.1) ** 2 / 0.018))
      const eyeSocketR = Math.exp(-((vertex.x + 0.3) ** 2 / 0.038 + (vertex.y - 0.1) ** 2 / 0.018))
      const mouthPlane = Math.exp(-(vertex.x ** 2 / 0.18 + (vertex.y + 0.48) ** 2 / 0.035))
      const cheekLift = Math.exp(-((Math.abs(vertex.x) - 0.43) ** 2 / 0.03 + (vertex.y + 0.09) ** 2 / 0.12))
      vertex.z += cheekLift * 0.025 - (eyeSocketL + eyeSocketR) * 0.035 + mouthPlane * 0.018
    }

    positions.setXYZ(index, vertex.x, vertex.y, vertex.z)
  }

  geometry.computeVertexNormals()
  return geometry
}

function selectImportantVertices(source) {
  const position = source.getAttribute('position')
  const normal = source.getAttribute('normal')
  const points = []
  const importanceValues = []

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index)
    const y = position.getY(index)
    const z = position.getZ(index)
    const front = z > 0.08
    const silhouette = Math.abs(x) > 0.69 || y > 0.93 || y < -0.86
    const browZone = front && y > 0.2 && y < 0.45 && Math.abs(x) < 0.58
    const eyeZone = front && y > -0.03 && y < 0.23 && Math.abs(x) > 0.11 && Math.abs(x) < 0.55
    const noseZone = front && Math.abs(x) < 0.16 && y > -0.36 && y < 0.25
    const mouthZone = front && Math.abs(x) < 0.34 && y > -0.57 && y < -0.34
    const cheekZone = front && Math.abs(x) > 0.31 && Math.abs(x) < 0.62 && y > -0.33 && y < 0.08
    const jawZone = front && y < -0.55

    let importance = 0.2
    if (silhouette) importance = 0.82
    if (browZone || cheekZone || jawZone) importance = Math.max(importance, 0.68)
    if (eyeZone || noseZone || mouthZone) importance = 0.93

    const density = silhouette ? 0.44
      : eyeZone || noseZone || mouthZone ? 0.34
        : browZone || cheekZone || jawZone ? 0.19
          : front ? 0.075 : 0.035

    if (seededNoise(index) > density) continue
    const push = 0.008
    points.push(
      x + normal.getX(index) * push,
      y + normal.getY(index) * push,
      z + normal.getZ(index) * push,
    )
    importanceValues.push(importance)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  geometry.setAttribute('importance', new THREE.Float32BufferAttribute(importanceValues, 1))
  return geometry
}

function createFeatureDisc(name, radius, material, worldOffsetY, whiteMix = 0.65) {
  const points = []
  const importance = []
  for (let ring = 0; ring < 3; ring += 1) {
    const ringRadius = radius * (0.28 + ring * 0.34)
    const count = 6 + ring * 5
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2
      points.push(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0)
      importance.push(0.82 + ring * 0.08)
    }
  }
  points.push(0, 0, 0)
  importance.push(1)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  geometry.setAttribute('importance', new THREE.Float32BufferAttribute(importance, 1))
  addPointAttributes(geometry, worldOffsetY, whiteMix)
  const cloud = new THREE.Points(geometry, material)
  cloud.name = name
  cloud.userData.partId = name
  return cloud
}

export function createMakerCyberBust() {
  const root = new THREE.Group()
  root.name = 'maker-cyber-portrait'
  const nodes = new Map()
  const revealUniform = { value: REVEAL_MIN_Y - 0.2 }
  const pointMaterial = createPointMaterial(revealUniform, { opacity: 0.14, size: 1.85 })
  const featureMaterial = createPointMaterial(revealUniform, { opacity: 1, size: 4.2 })
  const markMaterial = createPointMaterial(revealUniform, { opacity: 0.72, size: 1.8 })
  const lineMaterial = createLineMaterial(revealUniform, 0.88)
  const highlightLineMaterial = createLineMaterial(revealUniform, 1)

  const register = (node, parent = root) => {
    parent.add(node)
    nodes.set(node.name, node)
    return node
  }

  const neckGeometry = new THREE.CylinderGeometry(0.29, 0.37, 0.6, 40, 12)
  neckGeometry.scale(1, 1, 0.82)
  const neckPointsGeometry = selectImportantVertices(neckGeometry)
  addPointAttributes(neckPointsGeometry, -0.8)
  const neck = new THREE.Points(neckPointsGeometry, pointMaterial)
  neck.name = 'neck'
  neck.position.set(0, -0.8, -0.06)
  register(neck)
  register(createLinePath('neck-rim-l', [
    [-0.34, -1.1, -0.03], [-0.32, -0.88, 0], [-0.3, -0.57, 0.03],
  ], lineMaterial, { worldOffsetY: 0 }), root)
  register(createLinePath('neck-rim-r', [
    [0.34, -1.1, -0.03], [0.32, -0.88, 0], [0.3, -0.57, 0.03],
  ], lineMaterial, { worldOffsetY: 0 }), root)

  const headPivot = new THREE.Group()
  headPivot.name = 'head-pivot'
  headPivot.position.set(0, 0.25, 0)
  headPivot.rotation.order = 'YXZ'
  register(headPivot)

  const denseHead = sculptHeadGeometry()
  const importantHeadGeometry = selectImportantVertices(denseHead)
  addPointAttributes(importantHeadGeometry, 0.41)
  const headPoints = new THREE.Points(importantHeadGeometry, pointMaterial)
  headPoints.name = 'facial-surface-points'
  headPoints.position.y = 0.16
  headPoints.renderOrder = 1
  register(headPoints, headPivot)

  register(createLinePath('face-outer-rim', [
    [-0.73, 0.67, 0.18], [-0.82, 0.43, 0.22], [-0.83, 0.12, 0.24],
    [-0.72, -0.28, 0.28], [-0.55, -0.58, 0.31], [-0.37, -0.78, 0.34],
    [-0.17, -0.93, 0.36], [0, -1.01, 0.37], [0.17, -0.93, 0.36],
    [0.37, -0.78, 0.34], [0.55, -0.58, 0.31], [0.72, -0.28, 0.28],
    [0.83, 0.12, 0.24], [0.82, 0.43, 0.22],
    [0.73, 0.67, 0.18],
  ], highlightLineMaterial, { samples: 132, worldOffsetY: 0.25 }), headPivot)

  register(createLinePath('hair-outer-rim', [
    [-0.73, 0.66, 0.18], [-0.79, 0.86, 0.06], [-0.7, 1.02, 0],
    [-0.61, 1.08, -0.04], [-0.52, 1.24, -0.08], [-0.37, 1.21, -0.1],
    [-0.23, 1.36, -0.13], [-0.08, 1.32, -0.14], [0.07, 1.4, -0.15],
    [0.2, 1.33, -0.14], [0.35, 1.37, -0.12], [0.49, 1.24, -0.09],
    [0.62, 1.19, -0.04], [0.69, 1.04, 0], [0.79, 0.9, 0.06],
    [0.73, 0.66, 0.18],
  ], highlightLineMaterial, { samples: 110, worldOffsetY: 0.25 }), headPivot)

  register(createLinePath('hairline', [
    [-0.68, 0.72, 0.48], [-0.48, 0.78, 0.57], [-0.28, 0.74, 0.62],
    [-0.08, 0.8, 0.64], [0.12, 0.76, 0.63], [0.32, 0.81, 0.59],
    [0.52, 0.76, 0.54], [0.68, 0.7, 0.47],
  ], lineMaterial, { samples: 72, worldOffsetY: 0.25 }), headPivot)

  ;[-1, 1].forEach((side) => {
    const anatomicalSide = side < 0 ? 'r' : 'l'
    register(createLinePath(`ear-${anatomicalSide}`, [
      [side * 0.82, 0.39, -0.02], [side * 0.99, 0.29, 0.01], [side * 1.01, 0.07, 0.01],
      [side * 0.92, -0.09, 0], [side * 0.85, 0.08, 0.03], [side * 0.91, 0.26, 0.03],
    ], lineMaterial, { samples: 52, worldOffsetY: 0.41 }), headPivot)
  })

  const hairPoints = []
  const hairImportance = []
  for (let row = 0; row < 17; row += 1) {
    const y = 0.58 + row * 0.045
    const halfWidth = 0.81 * Math.sqrt(Math.max(0, 1 - ((y - 0.88) / 0.64) ** 2))
    const count = Math.max(4, Math.round(halfWidth * 42))
    for (let index = 0; index <= count; index += 1) {
      if (seededNoise(row * 101 + index) < 0.47) continue
      const x = THREE.MathUtils.lerp(-halfWidth, halfWidth, index / count)
      const fringe = y < 0.72 ? 0.06 * Math.sin(x * 15) + 0.035 * Math.sin(x * 29) : 0
      const z = 0.52 * Math.sqrt(Math.max(0, 1 - (x / 0.9) ** 2)) - 0.11
      hairPoints.push(x, y + fringe, z)
      hairImportance.push(y < 0.74 ? 0.9 : 0.62)
    }
  }
  const hairGeometry = new THREE.BufferGeometry()
  hairGeometry.setAttribute('position', new THREE.Float32BufferAttribute(hairPoints, 3))
  hairGeometry.setAttribute('importance', new THREE.Float32BufferAttribute(hairImportance, 1))
  addPointAttributes(hairGeometry, 0.25)
  const hair = new THREE.Points(hairGeometry, pointMaterial)
  hair.name = 'hair-landmarks'
  register(hair, headPivot)

  const eyePivots = []
  ;[-1, 1].forEach((side) => {
    const anatomicalSide = side < 0 ? 'r' : 'l'
    const x = side * 0.3
    register(createLinePath(`upper-lid-${anatomicalSide}`, [
      [x - 0.18, 0.3, 0.625], [x, 0.355, 0.665], [x + 0.18, 0.3, 0.625],
    ], highlightLineMaterial, { samples: 34, worldOffsetY: 0.55, whiteMix: 0.18 }), headPivot)
    register(createLinePath(`lower-lid-${anatomicalSide}`, [
      [x - 0.17, 0.292, 0.625], [x, 0.26, 0.66], [x + 0.17, 0.292, 0.625],
    ], lineMaterial, { samples: 30, worldOffsetY: 0.54 }), headPivot)

    const pivot = new THREE.Group()
    pivot.name = `eye-${anatomicalSide}`
    pivot.position.set(x, 0.305, 0.64)
    pivot.userData.restPosition = pivot.position.clone()
    pivot.rotation.order = 'YXZ'
    register(pivot, headPivot)
    const irisRing = createLinePath(
      `iris-${anatomicalSide}`,
      Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2
        return [Math.cos(angle) * 0.043, Math.sin(angle) * 0.043, 0]
      }),
      highlightLineMaterial,
      { samples: 48, worldOffsetY: 0.555, whiteMix: 0.25, closed: true },
    )
    irisRing.position.z = 0.035
    register(irisRing, pivot)
    const pupil = createFeatureDisc(`pupil-${anatomicalSide}`, 0.011, featureMaterial, 0.555, 0.32)
    pupil.position.z = 0.04
    register(pupil, pivot)
    eyePivots.push(pivot)
  })

  ;[-1, 1].forEach((side) => {
    const x = side * 0.31
    register(createLinePath(`brow-${side < 0 ? 'r' : 'l'}`, [
      [x - 0.2, 0.53, 0.58], [x, 0.59, 0.64], [x + 0.2, 0.54, 0.58],
    ], lineMaterial, { samples: 38, worldOffsetY: 0.8 }), headPivot)
  })

  register(createLinePath('nose-bridge', [
    [-0.045, 0.29, 0.64], [-0.04, 0.11, 0.7], [-0.035, -0.09, 0.72],
  ], lineMaterial, { samples: 40, worldOffsetY: 0.44 }), headPivot)
  register(createLinePath('nose-tip', [
    [-0.13, -0.13, 0.65], [-0.065, -0.19, 0.72], [0, -0.17, 0.755],
    [0.065, -0.19, 0.72], [0.13, -0.13, 0.65],
  ], highlightLineMaterial, { samples: 44, worldOffsetY: 0.08, whiteMix: 0.1 }), headPivot)

  register(createLinePath('lip-upper', [
    [-0.25, -0.39, 0.61], [-0.09, -0.41, 0.68], [0, -0.385, 0.7],
    [0.09, -0.41, 0.68], [0.25, -0.39, 0.61],
  ], highlightLineMaterial, { samples: 52, worldOffsetY: -0.14, whiteMix: 0.13 }), headPivot)
  register(createLinePath('lip-lower', [
    [-0.22, -0.42, 0.62], [0, -0.475, 0.67], [0.22, -0.42, 0.62],
  ], lineMaterial, { samples: 40, worldOffsetY: -0.18 }), headPivot)

  const cheekMark = createFeatureDisc('cheek-mark', 0.006, markMaterial, 0.34, 0.45)
  cheekMark.position.set(-0.41, 0.09, 0.64)
  register(cheekMark, headPivot)

  root.userData.sculptRuntime = {
    nodes: Object.fromEntries(nodes),
    pivots: { head: headPivot, eyes: eyePivots },
    colliders: { head: { type: 'capsule', center: [0, 0.18, 0], radius: 0.92, height: 2.35 } },
    destructionGroups: {
      neck: ['neck'],
      head: [...nodes.keys()].filter((name) => name !== 'neck'),
    },
  }

  const dispose = () => {
    root.traverse((object) => object.geometry?.dispose())
    pointMaterial.dispose()
    featureMaterial.dispose()
    markMaterial.dispose()
    lineMaterial.dispose()
    highlightLineMaterial.dispose()
  }

  return {
    root,
    headPivot,
    eyePivots,
    revealUniform,
    revealRange: [REVEAL_MIN_Y, REVEAL_MAX_Y],
    dispose,
  }
}
