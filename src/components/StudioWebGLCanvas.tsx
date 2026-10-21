import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Sparkles,
  Stars,
  Environment,
  ContactShadows,
  Grid,
  Text,
  TorusKnot,
  Icosahedron,
  Octahedron,
  Sphere,
  RoundedBox,
  Torus,
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStudioStore, COLOR_THEMES } from '../store/useStudioStore';

// 1. Gaussian Splatting / Neural Point Cloud Showcase (.spz / SPLATLoader simulation)
const GaussianSplatField: React.FC<{ accent: string; secondary: string; distortion: number }> = ({
  accent,
  secondary,
  distortion,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2400;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color(accent);
    const c2 = new THREE.Color(secondary);

    for (let i = 0; i < count; i++) {
      // Spiral galaxy / torus splat distribution
      const angle = (i / count) * Math.PI * 28;
      const radius = 1.2 + Math.sin(angle * 0.25) * 0.8 + (Math.random() - 0.5) * 0.35;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle * 0.5) * 1.1 + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const mixed = c1.clone().lerp(c2, (i / count + Math.random() * 0.2) % 1);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return { positions: pos, colors: col };
  }, [accent, secondary]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.22;
    pointsRef.current.rotation.x = Math.sin(t * 0.35) * (0.2 + distortion * 0.3);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 2. Rapier WASM Rigid-Body Physics / Zero-G Attractor Cluster Simulation
const PhysicsOrbitalSwarm: React.FC<{
  accent: string;
  secondary: string;
  physicsMode: string;
  impulseCounter: number;
  wireframe: boolean;
}> = ({ accent, secondary, physicsMode, impulseCounter, wireframe }) => {
  const groupRef = useRef<THREE.Group>(null);
  const impulseBoost = useRef(0);

  useEffect(() => {
    if (impulseCounter > 0) {
      impulseBoost.current = 2.6;
    }
  }, [impulseCounter]);

  const nodes = useMemo(() => {
    return Array.from({ length: 14 }, (_, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / 14);
      const theta = Math.sqrt(14 * Math.PI) * phi;
      return {
        id: idx,
        basePos: new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * 2.2,
          Math.sin(theta) * Math.sin(phi) * 2.2,
          Math.cos(phi) * 2.2
        ),
        scale: 0.16 + (idx % 3) * 0.08,
        speed: 0.6 + (idx % 5) * 0.25,
        isAccent: idx % 2 === 0,
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    impulseBoost.current = THREE.MathUtils.lerp(impulseBoost.current, 0, delta * 3.5);

    const mx = state.pointer.x * 2.0;
    const my = state.pointer.y * 2.0;

    groupRef.current.children.forEach((child, i) => {
      const n = nodes[i];
      if (!n) return;
      const pulse = 1 + impulseBoost.current * 0.55;

      if (physicsMode === 'rapier-rigid') {
        // Colliding attractor feel
        const bounce = Math.abs(Math.sin(t * n.speed * 2 + i)) * 0.45;
        child.position.x = n.basePos.x * pulse + Math.cos(t * n.speed + i) * 0.35 + mx * 0.25;
        child.position.y = n.basePos.y * pulse + bounce - 0.2 + my * 0.25;
        child.position.z = n.basePos.z * pulse + Math.sin(t * n.speed + i) * 0.35;
      } else if (physicsMode === 'zero-g-attractor') {
        child.position.x = THREE.MathUtils.lerp(child.position.x, n.basePos.x * 0.85 * pulse + mx * 0.6, 0.05);
        child.position.y = THREE.MathUtils.lerp(child.position.y, n.basePos.y * 0.85 * pulse + my * 0.6, 0.05);
        child.position.z = n.basePos.z * pulse + Math.cos(t + i) * 0.5;
      } else if (physicsMode === 'spring-verlet') {
        const spring = Math.sin(t * 3.2 + i * 0.7) * 0.4;
        child.position.set(
          n.basePos.x * pulse + spring,
          n.basePos.y * pulse - spring * 0.5,
          n.basePos.z * pulse
        );
      } else {
        // orbital-choreography
        const angle = t * n.speed + i;
        const rad = 2.3 * pulse;
        child.position.set(Math.cos(angle) * rad, Math.sin(angle * 1.3) * 1.1, Math.sin(angle) * rad);
      }

      child.rotation.x += delta * (1.2 + impulseBoost.current * 3);
      child.rotation.y += delta * (1.5 + impulseBoost.current * 2);
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n) => (
        <mesh key={n.id} position={n.basePos} scale={n.scale}>
          {n.id % 3 === 0 ? (
            <octahedronGeometry args={[1, 0]} />
          ) : n.id % 3 === 1 ? (
            <icosahedronGeometry args={[1, 1]} />
          ) : (
            <boxGeometry args={[1.3, 1.3, 1.3]} />
          )}
          <meshStandardMaterial
            color={n.isAccent ? accent : secondary}
            emissive={n.isAccent ? accent : secondary}
            emissiveIntensity={0.35}
            metalness={0.85}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
};

// 3. Primary Hero Artifact + TSL / Transmission / Liquid Chrome Material
const CenterpieceArtifact: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const {
    geometryPrimitive,
    shaderMaterial,
    colorTheme,
    wireframeOverlay,
    distortionStrength,
    theatreCameraPath,
    enableTroika3DText,
    brandName,
    physicsMode,
    physicsImpulseCounter,
    cameraFov,
  } = useStudioStore();

  const theme = COLOR_THEMES[colorTheme];

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera && Math.abs(cam.fov - cameraFov) > 0.1) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, cameraFov, 0.15);
      cam.updateProjectionMatrix();
    }
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.35 + state.pointer.y * 0.3;
      meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.2 + state.pointer.x * 0.3;
    }

    // Theatre.js Camera Choreography Simulation
    if (theatreCameraPath === 'orbit-cinematic') {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(t * 0.35) * 1.4 + state.pointer.x * 0.8, 0.04);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.cos(t * 0.25) * 0.7 + state.pointer.y * 0.6, 0.04);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.2, 0.04);
      state.camera.lookAt(0, 0, 0);
    } else if (theatreCameraPath === 'dolly-zoom') {
      const zTarget = 4.5 + Math.sin(t * 0.8) * 1.2;
      state.camera.position.set(state.pointer.x * 0.5, state.pointer.y * 0.5, zTarget);
      state.camera.lookAt(0, 0, 0);
    } else if (theatreCameraPath === 'top-down-architect') {
      state.camera.position.lerp(new THREE.Vector3(0, 3.2, 4.0), 0.04);
      state.camera.lookAt(0, 0, 0);
    } else {
      state.camera.position.lerp(new THREE.Vector3(state.pointer.x * 1.6, state.pointer.y * 1.2, 5.0), 0.06);
      state.camera.lookAt(0, 0, 0);
    }
  });

  const renderMaterial = () => {
    if (shaderMaterial === 'iridescent-transmission') {
      return (
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.65}
          chromaticAberration={0.18 + distortionStrength * 0.3}
          anisotropy={0.3}
          distortion={distortionStrength}
          distortionScale={0.5}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1.3}
          color={theme.accent}
          wireframe={wireframeOverlay}
        />
      );
    }
    if (shaderMaterial === 'tsl-plasma-displace') {
      return (
        <MeshDistortMaterial
          color={theme.accent}
          emissive={theme.secondary}
          emissiveIntensity={0.45}
          roughness={0.12}
          metalness={0.85}
          distort={0.35 + distortionStrength * 0.45}
          speed={3.2}
          wireframe={wireframeOverlay}
        />
      );
    }
    if (shaderMaterial === 'liquid-chrome') {
      return (
        <MeshDistortMaterial
          color="#ffffff"
          roughness={0.04}
          metalness={1.0}
          distort={distortionStrength * 0.35}
          speed={2.0}
          wireframe={wireframeOverlay}
        />
      );
    }
    // wireframe-hologram
    return (
      <meshStandardMaterial
        color={theme.accent}
        emissive={theme.accent}
        emissiveIntensity={0.8}
        wireframe={true}
        transparent
        opacity={0.85}
      />
    );
  };

  return (
    <group>
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.9}>
        {geometryPrimitive === 'gaussian-pointcloud' ? (
          <GaussianSplatField
            accent={theme.accent}
            secondary={theme.secondary}
            distortion={distortionStrength}
          />
        ) : (
          <mesh ref={meshRef} castShadow receiveShadow>
            {geometryPrimitive === 'torus-knot' && <torusKnotGeometry args={[1.05, 0.34, 180, 32]} />}
            {geometryPrimitive === 'icosahedron-crystal' && <icosahedronGeometry args={[1.45, 1]} />}
            {geometryPrimitive === 'metaball-cluster' && <sphereGeometry args={[1.38, 64, 64]} />}
            {geometryPrimitive === 'cyber-monolith' && <boxGeometry args={[1.3, 2.2, 0.65, 16, 16, 16]} />}
            {geometryPrimitive === 'architectural-ring' && <torusGeometry args={[1.35, 0.38, 48, 120]} />}
            {renderMaterial()}
          </mesh>
        )}
      </Float>

      {/* Physics Rigid-Body / Orbital Satellites */}
      <PhysicsOrbitalSwarm
        accent={theme.accent}
        secondary={theme.secondary}
        physicsMode={physicsMode}
        impulseCounter={physicsImpulseCounter}
        wireframe={wireframeOverlay}
      />

      {/* Troika MSDF 3D Spatial Text Layer */}
      {enableTroika3DText && (
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
          <Text
            position={[0, 0, -1.65]}
            fontSize={0.95}
            maxWidth={10}
            lineHeight={1}
            letterSpacing={0.08}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            color={theme.text}
            fillOpacity={0.14}
            outlineWidth={0.008}
            outlineColor={theme.accent}
            outlineOpacity={0.45}
          >
            {(brandName || 'STUDIO CRASH').toUpperCase()}
          </Text>
        </Float>
      )}
    </group>
  );
};

export const StudioWebGLCanvas: React.FC = () => {
  const {
    dimensionMode,
    colorTheme,
    cameraFov,
    postBloom,
    postChromatic,
    postNoiseGrain,
    postVignette,
    bloomIntensity,
    gridOverlay,
  } = useStudioStore();

  const theme = COLOR_THEMES[colorTheme];

  if (dimensionMode === '2d-editorial') {
    // Subtle minimalist architectural grid background when 2D editorial mode is chosen
    return (
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700 overflow-hidden"
        style={{ backgroundColor: theme.bg }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(${theme.accent} 1px, transparent 1px), linear-gradient(to right, ${theme.border} 1px, transparent 1px), linear-gradient(to bottom, ${theme.border} 1px, transparent 1px)`,
            backgroundSize: '48px 48px, 96px 96px, 96px 96px',
          }}
        />
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-[130px] opacity-25"
          style={{ background: `radial-gradient(circle, ${theme.accent}, ${theme.secondary})` }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5.2], fov: cameraFov }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[theme.bg]} />
        <fog attach="fog" args={[theme.bg, 5, 15]} />

        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} color={theme.accent} castShadow />
        <pointLight position={[-5, -4, -3]} intensity={1.8} color={theme.secondary} />
        <spotLight position={[0, 6, 3]} intensity={1.5} angle={0.5} penumbra={1} color="#ffffff" />

        <Environment preset="city" />

        <CenterpieceArtifact />

        <Sparkles count={75} scale={8} size={2.2} speed={0.4} color={theme.accent} opacity={0.55} />
        <Stars radius={30} depth={40} count={900} factor={3} saturation={0} fade speed={1} />

        {gridOverlay && (
          <Grid
            position={[0, -2.35, 0]}
            args={[20, 20]}
            cellSize={0.6}
            cellThickness={0.6}
            cellColor={theme.secondary}
            sectionSize={3}
            sectionThickness={1.2}
            sectionColor={theme.accent}
            fadeDistance={14}
            fadeStrength={1.2}
            infiniteGrid
          />
        )}

        <ContactShadows position={[0, -2.3, 0]} opacity={0.45} scale={10} blur={2.4} far={4.5} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={postBloom ? bloomIntensity : 0}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
          <ChromaticAberration
            offset={
              postChromatic
                ? new THREE.Vector2(0.0022, 0.0022)
                : new THREE.Vector2(0, 0)
            }
            radialModulation={false}
            modulationOffset={0.15}
          />
          <Noise opacity={postNoiseGrain ? 0.048 : 0} />
          <Vignette eskil={false} offset={0.15} darkness={postVignette ? 0.72 : 0} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
