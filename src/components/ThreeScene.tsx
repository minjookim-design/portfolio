import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'

// Lerp helper
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// --- Spotlight that follows the mouse ---
function MouseSpotLight() {
  const lightRef = useRef<THREE.SpotLight>(null!)
  const targetRef = useRef<THREE.Object3D>(null!)
  const { size } = useThree()

  useFrame(({ mouse, scene }) => {
    if (!lightRef.current || !targetRef.current) return

    const x = mouse.x * (size.width / 100)
    const z = mouse.y * -(size.height / 100)

    // Smooth follow
    lightRef.current.position.x = lerp(lightRef.current.position.x, x, 0.08)
    lightRef.current.position.z = lerp(lightRef.current.position.z, z + 2, 0.08)

    targetRef.current.position.x = lerp(targetRef.current.position.x, x * 0.4, 0.08)
    targetRef.current.position.z = lerp(targetRef.current.position.z, z * 0.4, 0.08)
    targetRef.current.updateMatrixWorld()

    if (lightRef.current.target !== targetRef.current) {
      lightRef.current.target = targetRef.current
      scene.add(targetRef.current)
    }
  })

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[0, 8, 2]}
        angle={0.35}
        penumbra={0.8}
        intensity={60}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        color="#fff8f0"
      />
      <object3D ref={targetRef} />
    </>
  )
}

// --- Interactive 3D Button ---
function InteractiveButton() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  useFrame(() => {
    if (!meshRef.current) return

    // Target Y: pressed = sink, hovered = levitate, default = rest
    const targetY = pressed ? -0.05 : hovered ? 0.35 : 0.25

    meshRef.current.position.y = lerp(meshRef.current.position.y, targetY, 0.12)
  })

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      position={[0, 0.25, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => { setHovered(false); setPressed(false) }}
      onPointerDown={(e) => { e.stopPropagation(); setPressed(true) }}
      onPointerUp={() => setPressed(false)}
    >
      <boxGeometry args={[1, 0.5, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.55}
        metalness={0.0}
      />
    </mesh>
  )
}

// --- Scene contents (runs inside Canvas context) ---
function Scene() {
  return (
    <>
      <color attach="background" args={['#f7f7f5']} />

      <ambientLight intensity={0.4} color="#fff8f0" />

      <MouseSpotLight />

      <Grid
        receiveShadow
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#d4d4d0"
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor="#c0c0bc"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid
      />

      <InteractiveButton />
    </>
  )
}

// --- Root Canvas ---
export function ThreeScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 4, 6], fov: 45 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Scene />
    </Canvas>
  )
}
