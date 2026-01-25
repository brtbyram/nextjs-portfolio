"use client"

import { Canvas } from '@react-three/fiber'
import React from 'react'
import ShaderPlane from './Shaderplane'
import TriangleShader from './TriangleShader'
import { GridHelper } from "three";
import { AxesHelper } from "three";

function Helpers() {
  return (
    <>
      <primitive object={new AxesHelper(1)} />
    </>
  );
}

function Grid() {
  return <primitive object={new GridHelper(2, 10)} />;
}

function Scene() {
  return (

    <Canvas camera={{ position: [0, 0, 2] }} >
      <Helpers />
      <Grid />
      <TriangleShader />
    </Canvas>

  )
}

export default Scene