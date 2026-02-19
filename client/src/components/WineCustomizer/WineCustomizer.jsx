import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import "./WineCustomizer.css";

const textSizeMap = {
  small: 90,
  medium: 130,
  large: 170
};

function WineBottle({
  labelText = "",
  capColor = "#8B0000",
  labelImage = null,
  textSize = "medium",        // small | medium | large
  textPosition = "center",    // top | center | bottom
  layout = "text-image"       // text-image | image-text
}) {
  const { nodes } = useGLTF("/models/wine_bottle.glb");
  const { invalidate } = useThree();

  const labelRef = useRef(null);
  const capRef = useRef(null);

  const canvasRef = useRef(null);
  const textureRef = useRef(null);

  /* ---------- HELPERS ---------- */

  const wrapText = (ctx, text, maxWidth) => {
    const paragraphs = text.split('\n');
    const allLines = [];

    const breakLongWord = (word) => {
      const parts = [];
      let current = '';

      for (let i = 0; i < word.length; i++) {
        const test = current + word[i];

        if (ctx.measureText(test).width > maxWidth) {
          if (current) parts.push(current);
          current = word[i];
        } else {
          current = test;
        }
      }

      if (current) parts.push(current);

      return parts;
    };

    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === '') {
        allLines.push('');
        return;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if (ctx.measureText(word).width > maxWidth) {
          if (currentLine) {
            allLines.push(currentLine);
            currentLine = '';
          }

          const broken = breakLongWord(word);
          allLines.push(...broken);
          continue;
        }

        const testLine = currentLine ? currentLine + ' ' + word : word;

        if (ctx.measureText(testLine).width > maxWidth) {
          if (currentLine) allLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) allLines.push(currentLine);
    });

    return allLines;
  };

  const drawImageContain = (ctx, img, x, y, w, h) => {
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;

    let drawW, drawH;
    let offsetX = 0, offsetY = 0;

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

  /* ---------- INIT CANVAS ---------- */

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
    const setVH = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  };

  setVH();
    window.addEventListener("resize", setVH);

    return () => window.removeEventListener("resize", setVH);
  }, []);

  /* ---------- DRAW LABEL ---------- */

  useEffect(() => {
    if (!canvasRef.current || !textureRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const hasText = !!labelText?.trim();
    const hasImage = !!labelImage;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const totalH = canvas.height;
    const textRatio = hasText && hasImage ? 0.45 : (hasText ? 1 : 0);
    const imageRatio = hasText && hasImage ? 0.55 : (hasImage ? 1 : 0);

    const textAreaH = totalH * textRatio;
    const imageAreaH = totalH * imageRatio;

    const isTextFirst = !hasImage || layout === "text-image";

    const textAreaY = isTextFirst ? 0 : imageAreaH;
    const imageAreaY = isTextFirst ? textAreaH : 0;

    /* ----- TEXT ----- */
    const drawText = () => {
      if (!hasText) return;

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const padding = 140;
      const maxWidth = canvas.width - padding * 2;
      const baseSize = textSizeMap[textSize] || 130;
      
      // Set font to measure text properly
      ctx.font = `bold ${baseSize}px Georgia, serif`;
      
      // Wrap text into multiple lines
      let lines = wrapText(ctx, labelText.trim(), maxWidth);
      
      // Adjust font size if needed to fit all lines
      let fontSize = baseSize;
      let lineHeight = fontSize * 1.2;
      let totalTextHeight = lines.length * lineHeight;
      
      // If text is too tall, reduce font size and re-wrap
      if (totalTextHeight > textAreaH * 0.9) {
        fontSize = Math.max(18, (textAreaH * 0.9) / (lines.length * 1.2));
        ctx.font = `bold ${fontSize}px Georgia, serif`;
        // Re-wrap with new font size
        lines = wrapText(ctx, labelText.trim(), maxWidth);
        lineHeight = fontSize * 1.2;
      }
      
      ctx.font = `bold ${fontSize}px Georgia, serif`;
      const finalLineHeight = lineHeight;

      // Calculate starting Y position to center all lines
      let startY;
      const totalHeight = lines.length * finalLineHeight;
      
      if (textPosition === "top") {
        startY = textAreaY + textAreaH * 0.25 - (totalHeight / 2) + (finalLineHeight / 2);
      } else if (textPosition === "center") {
        startY = textAreaY + textAreaH / 2 - (totalHeight / 2) + (finalLineHeight / 2);
      } else {
        startY = textAreaY + textAreaH * 0.75 - (totalHeight / 2) + (finalLineHeight / 2);
      }

      // Draw each line
      lines.forEach((line, index) => {
        const y = startY + (index * finalLineHeight);
        ctx.fillText(line, canvas.width / 2, y);
      });
    };

    const finish = () => {
      textureRef.current.needsUpdate = true;
      invalidate();
    };

    /* ----- IMAGE ----- */
    if (hasImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = labelImage;

      img.onload = () => {
        drawImageContain(
          ctx,
          img,
          0,
          imageAreaY,
          canvas.width,
          imageAreaH
        );

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
  }, [labelText, labelImage, textSize, textPosition, layout, invalidate]);

  /* ---------- CAP COLOR ---------- */

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
    <group
      scale={[0.8, 0.8, 0.8]}
      position={[0, -1.6, 0]}
      rotation={[Math.PI, 0, 0]}
    >
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

export default function WineCustomizer(props) {
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
        <WineBottle {...props} />
      </Suspense>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
