export const calculateGorePoints = (params, resolution = 100) => {
  const { diameter, gores, ventRatio, shapeRatio = 1.0 } = params
  const R = diameter / 2
  const H = R * shapeRatio
  const R_vent = (diameter * (ventRatio / 100)) / 2
  const N = gores

  const points = []
  
  const phi_vent = Math.asin(R_vent / R)
  const phi_max = Math.PI / 2

  let current_s = 0
  const d_phi = (phi_max - phi_vent) / resolution

  for (let i = 0; i <= resolution; i++) {
    const phi = phi_vent + i * d_phi
    
    if (i > 0) {
      const mid_phi = phi - d_phi / 2
      const ds = Math.sqrt(
        Math.pow(R * Math.cos(mid_phi), 2) + 
        Math.pow(H * Math.sin(mid_phi), 2)
      ) * d_phi
      current_s += ds
    }
    
    const local_r = R * Math.sin(phi)
    const half_w = (Math.PI * local_r) / N
    
    points.push({
      x: half_w,
      y: current_s
    })
  }

  const leftSide = points.map(p => ({ x: -p.x, y: p.y })).reverse()
  return [...leftSide, ...points]
}

export const generate3DMesh = (params, resolution = 40) => {
  const { diameter, gores, ventRatio, shapeRatio = 1.0 } = params
  const R = diameter / 2
  const H = R * shapeRatio
  const R_vent = (diameter * (ventRatio / 100)) / 2
  const N = gores

  const vertices = []
  const indices = []

  const phi_vent = Math.asin(R_vent / R)
  const phi_max = Math.PI / 2

  for (let i = 0; i <= resolution; i++) {
    const t_phi = i / resolution
    const phi = phi_vent + t_phi * (phi_max - phi_vent)
    
    for (let j = 0; j <= N; j++) {
      const theta = (j / N) * Math.PI * 2
      
      const x = R * Math.sin(phi) * Math.cos(theta)
      const y = H * Math.cos(phi) 
      const z = R * Math.sin(phi) * Math.sin(theta)
      
      vertices.push(x, y, z)
    }
  }

  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < N; j++) {
      const a = i * (N + 1) + j
      const b = (i + 1) * (N + 1) + j
      const c = (i + 1) * (N + 1) + (j + 1)
      const d = i * (N + 1) + (j + 1)
      
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const edges = []
  
  for (let j = 0; j <= N; j++) {
    for (let i = 0; i < resolution; i++) {
      const idx1 = i * (N + 1) + j
      const idx2 = (i + 1) * (N + 1) + j
      edges.push(
        vertices[idx1 * 3], vertices[idx1 * 3 + 1], vertices[idx1 * 3 + 2],
        vertices[idx2 * 3], vertices[idx2 * 3 + 1], vertices[idx2 * 3 + 2]
      )
    }
  }

  const ringIndices = [0, resolution]
  for (const i of ringIndices) {
    for (let j = 0; j < N; j++) {
      const idx1 = i * (N + 1) + j
      const idx2 = i * (N + 1) + (j + 1)
      edges.push(
        vertices[idx1 * 3], vertices[idx1 * 3 + 1], vertices[idx1 * 3 + 2],
        vertices[idx2 * 3], vertices[idx2 * 3 + 1], vertices[idx2 * 3 + 2]
      )
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    edges: new Float32Array(edges),
    gores: N
  }
}
