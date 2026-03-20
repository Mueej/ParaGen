import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei'
import * as THREE from 'three'
import { generate3DMesh } from '../utils/ParachuteGeometry'

const ParachuteModel = ({ params, isDark = false }) => {
  const bgColor = isDark ? "#202020" : "#F2F2F2";
  const lineColor = isDark ? "#D0D0D0" : "#202020";

  const visualParams = useMemo(() => ({
    ...params,
    diameter: params.diameter / 1000
  }), [params])

  const meshData = useMemo(() => generate3DMesh(visualParams), [visualParams])
  const { vertices, indices, gores: N } = meshData
  const resolution = 40

  const nonIndexedVertices = useMemo(() => {
    const v = new Float32Array(indices.length * 3)
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i]
      v[i * 3 + 0] = vertices[idx * 3 + 0]
      v[i * 3 + 1] = vertices[idx * 3 + 1]
      v[i * 3 + 2] = vertices[idx * 3 + 2]
    }
    return v
  }, [vertices, indices])

  const canopyGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(nonIndexedVertices, 3))
    g.computeVertexNormals()
    return g
  }, [nonIndexedVertices])

  const goreSeams = useMemo(() => {
    const seams = []
    for (let j = 0; j <= N; j++) {
      const path = []
      for (let i = 0; i <= resolution; i++) {
        const idx = i * (N + 1) + j
        path.push(new THREE.Vector3(vertices[idx * 3], vertices[idx * 3 + 1], vertices[idx * 3 + 2]))
      }
      seams.push(path)
    }
    return seams
  }, [vertices, N])

  const rings = useMemo(() => {
    const ringPaths = []
    const ringIndices = [0, resolution]
    for (const i of ringIndices) {
      const path = []
      for (let j = 0; j <= N; j++) {
        const idx = i * (N + 1) + j
        path.push(new THREE.Vector3(vertices[idx * 3], vertices[idx * 3 + 1], vertices[idx * 3 + 2]))
      }
      ringPaths.push(path)
    }
    return ringPaths
  }, [vertices, N])

  React.useEffect(() => {
    return () => canopyGeometry.dispose()
  }, [canopyGeometry])

  return (
    <group>
      <mesh geometry={canopyGeometry}>
        <meshBasicMaterial 
          color={bgColor} 
          side={THREE.DoubleSide} 
          polygonOffset={true}
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      
      {goreSeams.map((points, i) => (
        <Line 
          key={`seam-${i}`}
          points={points}
          color={lineColor}
          lineWidth={2}
          transparent
          opacity={0.9}
        />
      ))}

      {rings.map((points, i) => (
        <Line 
          key={`ring-${i}`}
          points={points}
          color={lineColor}
          lineWidth={2}
          transparent
          opacity={0.9}
        />
      ))}
    </group>
  )
}

const Visualizer = ({ params, isDark = false }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 1050)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1050)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const d = params.diameter / 1000
  const shapeRatio = params.shapeRatio || 1.0
  const h = (d / 2) * shapeRatio
  
  const camY = Math.max(d, h) * 1.25
  const camZ = d * 1.8
  const targetY = h / 2

  return (
    <Canvas 
      gl={{ 
        antialias: true, 
        alpha: true,
        toneMapping: THREE.NoToneMapping
      }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera 
        makeDefault 
        position={[0, camY, camZ]} 
        fov={50} 
        zoom={isMobile ? 1.6 : 1} 
      />
      <OrbitControls 
        makeDefault 
        enableDamping 
        dampingFactor={0.05} 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
        target={[0, targetY, 0]}
      />
      
      <ParachuteModel params={params} isDark={isDark} />
    </Canvas>
  )
}

export default Visualizer
