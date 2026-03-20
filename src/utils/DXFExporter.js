import { calculateGorePoints } from './ParachuteGeometry'

export const exportToDXF = (params) => {
  const { diameter, gores, ventRatio, seamAllowance } = params
  const resolution = 100
  const R = diameter / 2
  const N = gores
  
  let dxf = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n"
  dxf += "0\nSECTION\n2\nTABLES\n0\nENDSEC\n"
  dxf += "0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n"
  
  dxf += "0\nSECTION\n2\nENTITIES\n"

  const phi_vent = Math.asin((diameter * (ventRatio / 100) / 2) / R)
  const phi_max = Math.PI / 2
  const offsetPoints = []
  const innerPoints = []

  for (let i = 0; i <= resolution; i++) {
    const t = i / resolution
    const phi = phi_vent + t * (phi_max - phi_vent)
    const s = R * phi
    
    const local_r = R * Math.sin(phi)
    const x = (Math.PI * local_r) / N
    const y = s - R * phi_vent

    const dx_ds = (Math.PI / N) * Math.cos(phi)
    const dy_ds = 1

    const len = Math.sqrt(dx_ds * dx_ds + dy_ds * dy_ds)
    const nx = 1 / len
    const ny = -dx_ds / len
    
    innerPoints.push({ x, y })
    
    offsetPoints.push({
      x: x + nx * seamAllowance,
      y: y + ny * seamAllowance
    })
  }

  const buildPolygon = (pointsList) => {
    const poly = []
    pointsList.forEach(p => poly.push(p))
    for (let i = pointsList.length - 1; i >= 0; i--) {
      const p = pointsList[i]
      poly.push({ x: -p.x, y: p.y })
    }
    if (poly.length > 0) {
      poly.push({ x: poly[0].x, y: poly[0].y })
    }
    return poly
  }

  const outerPolygon = buildPolygon(offsetPoints)
  const innerPolygon = buildPolygon(innerPoints)

  const addLinesToDXF = (polygon, layer) => {
    for (let i = 0; i < polygon.length - 1; i++) {
        const p1 = polygon[i]
        const p2 = polygon[i + 1]
        dxf += "0\nLINE\n"
        dxf += `8\n${layer}\n`
        dxf += `10\n${p1.x.toFixed(4)}\n20\n${p1.y.toFixed(4)}\n30\n0.0\n`
        dxf += `11\n${p2.x.toFixed(4)}\n21\n${p2.y.toFixed(4)}\n31\n0.0\n`
    }
  }

  addLinesToDXF(outerPolygon, "Seam_Allowance")
  addLinesToDXF(innerPolygon, "Actual_Panel")

  dxf += "0\nENDSEC\n0\nEOF\n"

  try {
    const blob = new Blob([dxf], { type: 'application/octet-stream' }) 
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `parachute_panel_${diameter}mm_${gores}panels.dxf`)
    document.body.appendChild(link)
    link.click()
    
    setTimeout(() => {
      if (link.parentNode) document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 1000)
  } catch (err) {
    console.error("Failed to export DXF:", err)
  }
}
