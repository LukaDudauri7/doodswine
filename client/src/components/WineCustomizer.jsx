import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

// კომპონენტი ბოთლისთვის
export function WineBottle({ labelText = "ჩემი ღვინო", capColor = "#8B0000" }) {
  const { nodes } = useGLTF("/models/wine_bottle.glb");
  const labelRef = useRef();
  const capRef = useRef();

  // დინამიური ტექსტურა ლეიბლისთვის
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";

    // ტექსტს ვყოფთ ხაზების მიხედვით
    const lines = labelText.split('\n');
    const lineHeight = 40;
    const startY = (canvas.height - (lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    if (labelRef.current) {
      labelRef.current.material.map = texture;
      labelRef.current.material.needsUpdate = true;
    }
  }, [labelText]);

  // ჩაჩის ფერის განახლება
  useEffect(() => {
    if (capRef.current) {
      // ახალი მასალის შექმნა ფერით
      capRef.current.material = capRef.current.material.clone();
      capRef.current.material.color.set(capColor);
      capRef.current.material.needsUpdate = true;
    }
  }, [capColor]);

  // ყველა mesh-ს ვაგენერირებთ
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
      position={[0, -1.5, 0]}
      rotation={[Math.PI, 0, 0]}
    >
      {meshKeys.map((key, i) => {
        // Object_11 არის ჩაჩი
        const isCap = key === "Object_11";
        const isLabel = key === "Object_13"; // ლეიბლისთვის
        
        return (
          <mesh
            key={key}
            geometry={nodes[key].geometry}
            material={nodes[key].material}
            ref={isCap ? capRef : (isLabel ? labelRef : null)}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}

useGLTF.preload("/models/wine_bottle.glb");

// App კომპონენტი
export default function App({ capColor = "#8B0000", labelText = "ჩემი ღვინო" }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ width: "100%", height: "80vh", background: "#f0f0f0" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={null}>
        <WineBottle labelText={labelText} capColor={capColor} />
      </Suspense>
      <OrbitControls enableZoom={false}/>
    </Canvas>
  );
}