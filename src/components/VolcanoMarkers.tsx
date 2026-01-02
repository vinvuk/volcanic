"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Volcano, STATUS_CONFIG } from "@/lib/types";

/**
 * Earth radius - must match Earth.tsx
 */
const EARTH_RADIUS = 2;

/**
 * Earth rotation offset to align with texture
 * Must match the value used in Earth.tsx
 */
const EARTH_ROTATION_OFFSET = -Math.PI / 2;

/**
 * Offset above surface to prevent clipping
 * Needs to be large enough to keep sprites above the curved surface
 */
const SURFACE_OFFSET = 0.025;

/**
 * Convert latitude/longitude to 3D position on sphere
 * @param lat - Latitude in degrees
 * @param lon - Longitude in degrees
 * @param radius - Sphere radius
 * @returns THREE.Vector3 position
 */
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180) + EARTH_ROTATION_OFFSET;

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Create a circular gradient texture for sprites
 */
function createGlowTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Radial gradient from center
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.3)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Create a ring texture for pulse effects
 */
function createRingTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Ring shape
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 2;
  const innerRadius = size / 2 - 8;

  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
  ctx.fillStyle = "white";
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Shared textures (created once)
let glowTexture: THREE.Texture | null = null;
let ringTexture: THREE.Texture | null = null;

function getGlowTexture(): THREE.Texture {
  if (!glowTexture) {
    glowTexture = createGlowTexture();
  }
  return glowTexture;
}

function getRingTexture(): THREE.Texture {
  if (!ringTexture) {
    ringTexture = createRingTexture();
  }
  return ringTexture;
}

interface VolcanoMarkerProps {
  volcano: Volcano;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovering: boolean, screenPos?: { x: number; y: number }) => void;
}

/**
 * Individual volcano marker using billboard sprites
 * Sprites always face the camera and don't clip into each other
 */
function VolcanoMarker({ volcano, isSelected, onClick, onHover }: VolcanoMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const pulseRef = useRef<THREE.Sprite>(null);
  const { camera, gl } = useThree();

  // Calculate position above Earth surface
  const position = useMemo(() => {
    const surfacePos = latLonToVector3(volcano.latitude, volcano.longitude, EARTH_RADIUS);
    const normal = surfacePos.clone().normalize();
    return surfacePos.add(normal.multiplyScalar(SURFACE_OFFSET));
  }, [volcano.latitude, volcano.longitude]);

  // Surface normal for visibility check
  const surfaceNormal = useMemo(() => {
    return position.clone().normalize();
  }, [position]);

  const statusConfig = STATUS_CONFIG[volcano.status];
  const color = useMemo(() => new THREE.Color(statusConfig.color), [statusConfig.color]);

  const isErupting = volcano.status === "erupting";
  const isWarning = volcano.status === "warning";
  const isActive = isErupting || isWarning;

  // Base size - increased for better visibility
  const baseSize = isErupting ? 0.035 : isWarning ? 0.028 : isSelected ? 0.024 : 0.018;

  // Animation and visibility
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Check if marker is on visible side of Earth (facing camera)
    const cameraDir = camera.position.clone().normalize();
    const dotProduct = surfaceNormal.dot(cameraDir);

    // Hide markers on the far side of Earth (with small threshold for edge)
    const isVisible = dotProduct > -0.1;
    groupRef.current.visible = isVisible;

    if (!isVisible) return;

    // Fade markers near the edge
    const edgeFade = Math.min(1, (dotProduct + 0.1) * 2);

    // Pulse the main sprite for active volcanoes
    if (spriteRef.current) {
      const pulse = isErupting
        ? 1 + Math.sin(time * 4) * 0.2
        : isWarning
        ? 1 + Math.sin(time * 2) * 0.1
        : isSelected
        ? 1 + Math.sin(time * 2) * 0.08
        : 1;

      const size = baseSize * pulse;
      spriteRef.current.scale.set(size, size, 1);
      (spriteRef.current.material as THREE.SpriteMaterial).opacity = 0.95 * edgeFade;
    }

    // Animate glow - enhanced for visibility
    if (glowRef.current) {
      const glowPulse = isErupting
        ? 2.0 + Math.sin(time * 3) * 0.4
        : isActive
        ? 1.8 + Math.sin(time * 2) * 0.3
        : 1.6;

      const glowSize = baseSize * glowPulse;
      glowRef.current.scale.set(glowSize, glowSize, 1);

      const glowOpacity = isErupting
        ? 0.7 + Math.sin(time * 5) * 0.2
        : isActive
        ? 0.5
        : 0.4;
      (glowRef.current.material as THREE.SpriteMaterial).opacity = glowOpacity * edgeFade;
    }

    // Expanding pulse ring - smaller max size
    if (pulseRef.current && isActive) {
      const phase = (time * (isErupting ? 1.0 : 0.5)) % 1;
      const ringSize = baseSize * (1.2 + phase * 2);
      const opacity = (1 - phase) * 0.5 * edgeFade;

      pulseRef.current.scale.set(ringSize, ringSize, 1);
      (pulseRef.current.material as THREE.SpriteMaterial).opacity = opacity;
    }
  });

  /**
   * Handle pointer events
   */
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";

    const vector = position.clone();
    vector.project(camera);
    const x = (vector.x * 0.5 + 0.5) * gl.domElement.clientWidth;
    const y = (-vector.y * 0.5 + 0.5) * gl.domElement.clientHeight;
    onHover(true, { x, y });
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
    onHover(false);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Invisible click target - slightly larger for easier interaction */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Outer glow sprite */}
      <sprite ref={glowRef} scale={[baseSize * 2, baseSize * 2, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          color={color}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Core sprite - main marker */}
      <sprite ref={spriteRef} scale={[baseSize, baseSize, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          color={color}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </sprite>

      {/* Expanding pulse ring for active */}
      {isActive && (
        <sprite ref={pulseRef} scale={[baseSize * 1.5, baseSize * 1.5, 1]}>
          <spriteMaterial
            map={getRingTexture()}
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* Selection indicator - subtle ring */}
      {isSelected && (
        <sprite scale={[baseSize * 1.8, baseSize * 1.8, 1]}>
          <spriteMaterial
            map={getRingTexture()}
            color={color}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}
    </group>
  );
}

interface VolcanoMarkersProps {
  volcanoes: Volcano[];
  selectedVolcano: Volcano | null;
  onSelectVolcano: (volcano: Volcano | null) => void;
  visibleStatuses: Set<string>;
  onHoverVolcano?: (
    volcano: { name: string; status: string } | null,
    screenPos: { x: number; y: number } | null
  ) => void;
}

/**
 * Container component for all volcano markers
 * Uses billboard sprites for clean rendering without clipping
 */
export function VolcanoMarkers({
  volcanoes,
  selectedVolcano,
  onSelectVolcano,
  visibleStatuses,
  onHoverVolcano,
}: VolcanoMarkersProps) {
  const filteredVolcanoes = useMemo(
    () => volcanoes.filter((v) => visibleStatuses.has(v.status)),
    [volcanoes, visibleStatuses]
  );

  return (
    <group>
      {filteredVolcanoes.map((volcano) => (
        <VolcanoMarker
          key={volcano.id}
          volcano={volcano}
          isSelected={selectedVolcano?.id === volcano.id}
          onClick={() => {
            if (selectedVolcano?.id === volcano.id) {
              onSelectVolcano(null);
            } else {
              onSelectVolcano(volcano);
            }
          }}
          onHover={(hovering, screenPos) => {
            if (onHoverVolcano) {
              if (hovering && screenPos) {
                onHoverVolcano(
                  { name: volcano.name, status: volcano.status },
                  screenPos
                );
              } else {
                onHoverVolcano(null, null);
              }
            }
          }}
        />
      ))}
    </group>
  );
}
