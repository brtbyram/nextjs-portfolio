"use client";

import { Canvas } from "@react-three/fiber";
import React from "react";
import HandControlledBox from "./HandControlledBox";

function TouchPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <HandControlledBox />
      </Canvas>
    </div>
  );
}

export default TouchPage;
