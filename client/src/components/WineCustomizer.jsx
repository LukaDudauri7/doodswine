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
    canvas.width = 1024; // უკეთესი ხარისხისთვის
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // მაღალი ხარისხის რენდერინგი
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // თეთრი ფონი
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // შავი ტექსტი
    ctx.fillStyle = "#000000";
    ctx.font = "bold 60px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ტექსტს ვყოფთ ხაზების მიხედვით
    const lines = labelText.split('\n');
    const lineHeight = 80;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      // ტექსტის კონტური უკეთესი ხედვისთვის
      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 2;
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
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
        // Object_11 არის ჩაჩი, სხვადასხვა Object ლეიბლისთვის სცადოთ
        const isCap = key === "Object_11";
        // სცადეთ სხვადასხვა Object-ები ლეიბლისთვის
        const isLabel = key === "Object_13";
        
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
export default function App({ capColor = "#8B0000", labelText = "შექმენი შენი ეტიკეტი" }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ 
        width: "60%", 
        height: "80vh", 
        background: "#f0f0f0", 
        borderRadius: "50px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center" 
    }}
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