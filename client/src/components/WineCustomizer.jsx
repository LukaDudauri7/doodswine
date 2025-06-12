import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

// კომპონენტი ბოთლისთვის
export function WineBottle({ labelText = "ჩემი ღვინო" }) {
  const { nodes } = useGLTF("/models/wine_bottle.glb");
  const labelRef = useRef();

  // დინამიური ტექსტურა ლეიბლისთვის
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(labelText, canvas.width / 2, 130);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    if (labelRef.current) {
      labelRef.current.material.map = texture;
      labelRef.current.material.needsUpdate = true;
    }
  }, [labelText]);

  // ყველა mesh-ს ვაგენერირებთ, ერთს ვუკავშირდებით label-ს
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
      scale={[0.8, 0.8, 0.8]} // ოპტიმალური ზომა
      position={[0, -1.5, 0]} // ოდნავ ქვემოთ, რომ არ იჭრებოდეს
      rotation={[Math.PI, 0, 0]} // საჭირო შემთხვევაში შებრუნება
    >
      {meshKeys.map((key, i) => (
        <mesh
          key={key}
          geometry={nodes[key].geometry}
          material={nodes[key].material}
          ref={i === 0 ? labelRef : null}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/wine_bottle.glb");

// App კომპონენტი
export default function App() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ width: "", height: "80vh", background: "#f0f0f0" }}
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
        <WineBottle labelText="ჩემი ღვინო" />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
