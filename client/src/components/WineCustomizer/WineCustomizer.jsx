import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import "./WineCustomizer.css";

function WineBottle({
  labelText = "",
  capColor = "#8B0000",
  labelImage = null
}) {
  const { nodes } = useGLTF("/models/wine_bottle.glb");
  const { invalidate } = useThree();

  const labelRef = useRef(null);
  const capRef = useRef(null);

  const canvasRef = useRef(null);
  const textureRef = useRef(null);

  const fitText = (ctx, text, maxWidth, startSize) => {
    let size = startSize;
    while (size > 18) {
      ctx.font = `bold ${size}px Georgia, serif`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 4;
    }
    return 18;
  };

  const drawImageContain = (ctx, img, x, y, w, h) => {
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;

    let drawW, drawH;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > boxRatio) {
      drawW = w;
      drawH = w / imgRatio;
      offsetY = (h - drawH) / 2;
    } else {
      drawH = h;
      drawW = h * imgRatio;
      offsetX = (w - drawW) / 2;
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, drawW, drawH);
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1320;

    canvasRef.current = canvas;
    textureRef.current = new THREE.CanvasTexture(canvas);
    textureRef.current.anisotropy = 8;

    if (labelRef.current) {
      const material = labelRef.current.material.clone();
      material.map = textureRef.current;
      material.transparent = true;
      material.needsUpdate = true;
      labelRef.current.material = material;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !textureRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const hasText = !!labelText?.trim();
    const hasImage = !!labelImage;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imageHeight = hasImage && hasText ? canvas.height * 0.7 : canvas.height;
    const textHeight = hasImage && hasText ? canvas.height * 0.3 : canvas.height;

    const drawText = () => {
      if (!hasText) return;

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const padding = 140;
      const maxWidth = canvas.width - padding * 2;
      const fontSize = fitText(ctx, labelText.trim(), maxWidth, 140);
      ctx.font = `bold ${fontSize}px Georgia, serif`;

      const y = hasImage
        ? imageHeight + textHeight / 2
        : canvas.height / 2;

      ctx.fillText(labelText.trim(), canvas.width / 2, y);
    };

    const finish = () => {
      textureRef.current.needsUpdate = true;
      invalidate();
    };

    if (hasImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = labelImage;

      img.onload = () => {
        drawImageContain(ctx, img, 0, 0, canvas.width, imageHeight);
        drawText();
        finish();
      };

      img.onerror = () => {
        drawText();
        finish();
      };
    } else {
      drawText();
      finish();
    }
  }, [labelText, labelImage, invalidate]);

  useEffect(() => {
    if (capRef.current?.material) {
      capRef.current.material.color.set(capColor);
      capRef.current.material.needsUpdate = true;
      invalidate();
    }
  }, [capColor, invalidate]);

  const meshKeys = [
    "Object_5",
    "Object_6",
    "Object_7",
    "Object_8",
    "Object_9",
    "Object_11", // cap
    "Object_13", // label
  ];

  return (
    <group scale={[0.8, 0.8, 0.8]} position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
      {meshKeys.map((key) => (
        <mesh
          key={key}
          geometry={nodes[key]?.geometry}
          material={nodes[key]?.material}
          ref={key === "Object_11" ? capRef : key === "Object_13" ? labelRef : null}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/wine_bottle.glb");

export default function WineCustomizer({
  capColor = "#8B0000",
  labelText = "",
  labelImage = null,
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 2, 5], fov: 40 }}
      className="canvas-container"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={2} />

      <Suspense fallback={null}>
        <WineBottle
          capColor={capColor}
          labelText={labelText}
          labelImage={labelImage}
        />
      </Suspense>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
