import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Text } from '@react-three/drei'
import * as THREE from 'three'

/* ─────────────────────────────────────────────
   Braun CSV 13 Amplifier — three.js recreation
   Designed by Dieter Rams, 1965
   ───────────────────────────────────────────── */

const SOURCE_POSITIONS = [
  { label: 'radio',          angle:  60 },
  { label: 'phono 1',        angle:  40 },
  { label: 'phono 2',        angle:  20 },
  { label: 'phono 3',        angle:   0 },
  { label: 'phono 4',        angle: -20 },
  { label: 'tonel',          angle: -40 },
  { label: 'stereo  T 1080', angle: -60 },
]

const KNOB_LABELS = ['lautstärke', 'balance', 'tiefen', 'höhen']

export default function CSV13Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.4, 4.6], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#FFFFFF']} />
      <fog attach="fog" args={['#FFFFFF', 8, 18]} />

      <ambientLight intensity={0.8} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-5, 3, -2]} intensity={0.55} color="#E8C8A8" />
      <pointLight position={[0, 2, 3]} intensity={0.35} />
      <hemisphereLight args={['#FFFFFF', '#D8D4CC', 0.35]} />

      <Suspense fallback={null}>
        <Amplifier />
        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.32}
          scale={8}
          blur={2.4}
          far={2}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={3.2}
        maxDistance={6.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />
    </Canvas>
  )
}

function Amplifier() {
  const groupRef = useRef()
  const [sourceIndex, setSourceIndex] = useState(0)
  const [knobValues, setKnobValues] = useState([0.6, 0.5, 0.55, 0.45]) // 0..1
  const [powerOn, setPowerOn] = useState(true)

  // Subtle breathing rotation while idle, paused on user interaction.
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.015
  })

  const setKnob = (i, val) => {
    setKnobValues(prev => {
      const next = prev.slice()
      next[i] = Math.max(0, Math.min(1, val))
      return next
    })
  }

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {/* The amp body — silver-aluminum face with a recessed dark interior */}
      <Body />

      {/* BRAUN wordmark, lower-left */}
      <BraunWordmark position={[-1.85, -0.32, 0.061]} />

      {/* Power button + indicator dot, far left */}
      <PowerCluster
        position={[-1.65, 0.05, 0.061]}
        on={powerOn}
        onToggle={() => setPowerOn(p => !p)}
      />

      {/* Source selector — the iconic pointed black teardrop */}
      <SourceSelector
        position={[-1.05, 0.05, 0.061]}
        index={sourceIndex}
        onChange={setSourceIndex}
      />

      {/* Four large rotary knobs */}
      {[0, 1, 2, 3].map(i => (
        <RotaryKnob
          key={i}
          position={[-0.10 + i * 0.62, 0.05, 0.061]}
          value={knobValues[i]}
          onChange={(v) => setKnob(i, v)}
          label={KNOB_LABELS[i]}
        />
      ))}

      {/* Three status indicators on the right */}
      <StatusCluster position={[2.22, 0.05, 0.061]} />

      {/* Four corner mounting screws */}
      {[
        [-2.30,  0.46], [ 2.30,  0.46],
        [-2.30, -0.46], [ 2.30, -0.46],
      ].map(([x, y], i) => (
        <Screw key={i} position={[x, y, 0.061]} />
      ))}
    </group>
  )
}

/* ─── Amp body ─── */

function Body() {
  // Two layers: a thicker recessed back plate + a thin top face panel
  return (
    <group>
      {/* Back plate — slightly darker, recessed */}
      <mesh position={[0, 0, -0.04]} receiveShadow>
        <boxGeometry args={[4.85, 1.05, 0.16]} />
        <meshStandardMaterial color="#D8D4CC" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Face panel — brushed aluminum-ish warm gray */}
      <mesh position={[0, 0, 0.04]} receiveShadow castShadow>
        <boxGeometry args={[4.80, 1.00, 0.04]} />
        <meshStandardMaterial
          color="#EDEAE3"
          roughness={0.45}
          metalness={0.35}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Subtle bevel highlight along the top edge */}
      <mesh position={[0, 0.50, 0.06]}>
        <boxGeometry args={[4.78, 0.005, 0.001]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}

/* ─── BRAUN wordmark ─── */

function BraunWordmark({ position }) {
  return (
    <Text
      position={position}
      fontSize={0.10}
      letterSpacing={0.04}
      color="#0A0A0A"
      anchorX="left"
      anchorY="middle"
    >
      BRAUN
    </Text>
  )
}

/* ─── Power button cluster ─── */

function PowerCluster({ position, on, onToggle }) {
  return (
    <group position={position}>
      {/* Tiny "ein/aus" dot indicator */}
      <mesh position={[0, 0.18, 0.005]}>
        <circleGeometry args={[0.025, 32]} />
        <meshStandardMaterial
          color={on ? '#FF6B1F' : '#3A3A37'}
          emissive={on ? '#FF6B1F' : '#000000'}
          emissiveIntensity={on ? 0.6 : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Tan/peach push button */}
      <mesh
        position={[0, -0.05, 0.025]}
        onClick={(e) => { e.stopPropagation(); onToggle() }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <cylinderGeometry args={[0.055, 0.06, 0.025, 32]} />
        <meshStandardMaterial color="#E8C8A8" roughness={0.55} />
      </mesh>
    </group>
  )
}

/* ─── Source selector — the iconic teardrop knob ─── */

function SourceSelector({ position, index, onChange }) {
  const groupRef = useRef()
  const targetAngle = SOURCE_POSITIONS[index].angle * (Math.PI / 180)

  // Smooth angular interpolation toward the target position
  useFrame(() => {
    if (!groupRef.current) return
    const current = groupRef.current.rotation.z
    groupRef.current.rotation.z = current + (targetAngle - current) * 0.18
  })

  const handleClick = (e) => {
    e.stopPropagation()
    // Cycle through positions on click
    onChange((index + 1) % SOURCE_POSITIONS.length)
  }

  return (
    <group position={position}>
      {/* Small label printed on the face panel — to the right of the knob */}
      <Text
        position={[0.16, 0, 0.001]}
        fontSize={0.028}
        color="#0A0A0A"
        anchorX="left"
        anchorY="middle"
        maxWidth={0.5}
      >
        {SOURCE_POSITIONS[index].label}
      </Text>

      {/* The teardrop knob itself — a custom shape pointing up by default */}
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <Teardrop />
      </group>
    </group>
  )
}

function Teardrop() {
  // Build a teardrop profile and lathe it around the Y axis
  const points = useMemo(() => {
    const pts = []
    // Pointed tip up at y = 0.18, fat bottom at y = -0.06
    pts.push(new THREE.Vector2(0, 0.20))
    pts.push(new THREE.Vector2(0.018, 0.14))
    pts.push(new THREE.Vector2(0.038, 0.07))
    pts.push(new THREE.Vector2(0.060, 0.00))
    pts.push(new THREE.Vector2(0.075, -0.04))
    pts.push(new THREE.Vector2(0.080, -0.07))
    pts.push(new THREE.Vector2(0.075, -0.085))
    pts.push(new THREE.Vector2(0, -0.085))
    return pts
  }, [])

  return (
    <mesh castShadow>
      <latheGeometry args={[points, 48]} />
      <meshStandardMaterial
        color="#0A0A0A"
        roughness={0.35}
        metalness={0.15}
        envMapIntensity={0.6}
      />
    </mesh>
  )
}

/* ─── Big rotary knob ─── */

function RotaryKnob({ position, value, onChange, label }) {
  const knobRef = useRef()
  const dragStateRef = useRef(null)
  // Sweep ±135° → 270° total range
  const minAngle = -135 * (Math.PI / 180)
  const maxAngle =  135 * (Math.PI / 180)
  const range = maxAngle - minAngle
  const targetZ = minAngle + value * range

  useFrame(() => {
    if (!knobRef.current) return
    knobRef.current.rotation.z += (targetZ - knobRef.current.rotation.z) * 0.25
  })

  const handlePointerDown = (e) => {
    e.stopPropagation()
    e.target.setPointerCapture?.(e.pointerId)
    dragStateRef.current = {
      startY: e.clientY,
      startVal: value,
    }
    document.body.style.cursor = 'grabbing'
  }

  const handlePointerMove = (e) => {
    const drag = dragStateRef.current
    if (!drag) return
    e.stopPropagation()
    // Vertical drag — 200px = full range
    const deltaY = drag.startY - e.clientY
    const next = drag.startVal + deltaY / 200
    onChange(next)
  }

  const handlePointerUp = (e) => {
    if (dragStateRef.current) {
      e.stopPropagation()
      e.target.releasePointerCapture?.(e.pointerId)
    }
    dragStateRef.current = null
    document.body.style.cursor = ''
  }

  return (
    <group position={position}>
      {/* Tick marks — 13 around the dial */}
      {Array.from({ length: 13 }, (_, i) => {
        const angle = minAngle + (i / 12) * range
        const isMajor = i % 6 === 0
        const r = 0.165
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * r, Math.cos(angle) * r, 0.001]}
            rotation={[0, 0, -angle]}
          >
            <planeGeometry args={[isMajor ? 0.005 : 0.003, isMajor ? 0.018 : 0.006]} />
            <meshBasicMaterial color="#0A0A0A" />
          </mesh>
        )
      })}

      {/* Number labels at the cardinal positions */}
      <Text position={[0, 0.21, 0.001]} fontSize={0.022} color="#0A0A0A" anchorX="center" anchorY="bottom">12</Text>
      <Text position={[0.205, 0, 0.001]} fontSize={0.022} color="#0A0A0A" anchorX="left" anchorY="middle">4</Text>
      <Text position={[-0.205, 0, 0.001]} fontSize={0.022} color="#0A0A0A" anchorX="right" anchorY="middle">24</Text>

      {/* Knob body — tall black cylinder, slightly tapered */}
      <group
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerOver={() => { if (!dragStateRef.current) document.body.style.cursor = 'grab' }}
        onPointerOut={() => { if (!dragStateRef.current) document.body.style.cursor = '' }}
      >
        {/* Main cylinder */}
        <mesh position={[0, 0, 0.06]} castShadow>
          <cylinderGeometry args={[0.115, 0.130, 0.110, 48]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.42} metalness={0.10} />
        </mesh>
        {/* Top cap with chamfer */}
        <mesh position={[0, 0, 0.118]} castShadow>
          <cylinderGeometry args={[0.108, 0.115, 0.012, 48]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.50} metalness={0.10} />
        </mesh>
        {/* Indicator line — small white tick on the side, points "up" at value */}
        <mesh position={[0, 0.116, 0.06]}>
          <planeGeometry args={[0.006, 0.045]} />
          <meshBasicMaterial color="#F0F0F0" />
        </mesh>
      </group>

      {/* Label below the knob */}
      <Text
        position={[0, -0.30, 0.001]}
        fontSize={0.026}
        color="#0A0A0A"
        anchorX="center"
        anchorY="top"
        letterSpacing={0.04}
      >
        {label}
      </Text>
    </group>
  )
}

/* ─── Status indicator cluster (right side) ─── */

function StatusCluster({ position }) {
  const items = [
    { label: 'rein', active: true },
    { label: 'pr',   active: false },
    { label: 'rf',   active: false },
  ]
  return (
    <group position={position}>
      {items.map((item, i) => (
        <group key={i} position={[0, 0.22 - i * 0.22, 0]}>
          {/* Dot indicator */}
          <mesh position={[-0.05, 0, 0.005]}>
            <circleGeometry args={[0.025, 32]} />
            <meshStandardMaterial
              color={item.active ? '#E8C8A8' : '#3A3A37'}
              emissive={item.active ? '#FF6B1F' : '#000000'}
              emissiveIntensity={item.active ? 0.3 : 0}
            />
          </mesh>
          {/* Tan push button */}
          <mesh position={[0.04, 0, 0.012]}>
            <cylinderGeometry args={[0.030, 0.034, 0.012, 32]} />
            <meshStandardMaterial color="#E8C8A8" roughness={0.55} />
          </mesh>
          {/* Small label */}
          <Text
            position={[0.10, 0, 0.001]}
            fontSize={0.022}
            color="#0A0A0A"
            anchorX="left"
            anchorY="middle"
          >
            {item.label}
          </Text>
        </group>
      ))}
    </group>
  )
}

/* ─── Mounting screw ─── */

function Screw({ position }) {
  return (
    <group position={position}>
      {/* Recessed circle behind the screw */}
      <mesh position={[0, 0, -0.005]}>
        <circleGeometry args={[0.024, 32]} />
        <meshStandardMaterial color="#C9C4BA" roughness={0.6} />
      </mesh>
      {/* Screw body */}
      <mesh position={[0, 0, 0.005]} castShadow>
        <cylinderGeometry args={[0.018, 0.020, 0.008, 32]} />
        <meshStandardMaterial color="#A8A39A" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Slot */}
      <mesh position={[0, 0, 0.010]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.024, 0.003]} />
        <meshBasicMaterial color="#3A3A37" />
      </mesh>
    </group>
  )
}
