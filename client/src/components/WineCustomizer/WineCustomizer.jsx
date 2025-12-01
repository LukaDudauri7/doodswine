import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "./WineCustomizer.css";

export function WineBottle({ labelText = "ჩემი ღვინო", capColor = "#8B0000", labelImage = null }) {
  const { nodes } = useGLTF("/models/wine_bottle.glb");

  const labelRef = useRef();
  const capRef = useRef();

  // NEW: store canvas + texture once
  const canvasRef = useRef(null);
  const textureRef = useRef(null);

  // 🚀 1) Create canvas + texture only once
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1320;

    canvasRef.current = canvas;
    textureRef.current = new THREE.CanvasTexture(canvas);

    // attach material once
    if (labelRef.current) {
      const mat = labelRef.current.material.clone();
      mat.transparent = true;
      mat.map = textureRef.current;
      mat.needsUpdate = true;

      labelRef.current.material = mat;
    }
  }, []);

  // 🚀 2) Update canvas when text or image changes
  useEffect(() => {
    if (!canvasRef.current || !textureRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawTexture = () => {
      if (labelText) {
        ctx.fillStyle = "#000000";
        ctx.font = "bold 120px Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const lines = labelText.split("\n");
        const lineHeight = 80;
        const textStartY = labelImage ? 1210 : 670;

        lines.forEach((line, index) => {
          const y = textStartY + index * lineHeight;
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      // update GPU only (VERY fast)
      textureRef.current.needsUpdate = true;
    };

    if (labelImage) {
      const img = new Image();
      img.src = labelImage;

      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height - canvas.height / 6
        );
        drawTexture();
      };
    } else {
      drawTexture();
    }
  }, [labelText, labelImage]);

  // 🚀 3) Update cap color (super fast)
  useEffect(() => {
    if (capRef.current && capRef.current.material) {
      capRef.current.material.color.set(capColor);
      capRef.current.material.needsUpdate = true;
    }
  }, [capColor]);

  const meshKeys = [
    "Object_5",
    "Object_6",
    "Object_7",
    "Object_8",
    "Object_9",
    "Object_11",
    "Object_13",
  ];

  return (
    <group
      scale={[0.8, 0.8, 0.8]}
      position={[0, -1.6, 0]}
      rotation={[Math.PI, 0, 0]}
    >
      {meshKeys.map((key) => {
        const isCap = key === "Object_11";
        const isLabel = key === "Object_13";

        return (
          <mesh
            key={key}
            geometry={nodes[key]?.geometry}
            material={nodes[key]?.material}
            ref={isCap ? capRef : isLabel ? labelRef : null}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}

useGLTF.preload("/models/wine_bottle.glb");

export default function App({
  capColor = "#8B0000",
  labelText = "შექმენი შენი ეტიკეტი",
  labelImage = null,
}) {
  return (
    <Canvas
      frameloop="demand"
      shadows={false}
      dpr={[1, 2]}
      camera={{ position: [0, 2, 5], fov: 40 }}
      className="canvas-container"
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Suspense fallback={null}>
        <WineBottle
          labelText={labelText}
          capColor={capColor}
          labelImage={labelImage}
        />
      </Suspense>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
