"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { Hands } from "@mediapipe/hands"
import { Camera } from "@mediapipe/camera_utils"

export default function HandControlledBox() {
  const boxRef = useRef(null)
  const handX = useRef(0)

  useEffect(() => {
    const video = document.createElement("video")
    video.style.display = "none"
    document.body.appendChild(video)

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    })

    hands.onResults((results) => {
      if (results.multiHandLandmarks?.length) {
        handX.current = results.multiHandLandmarks[0][8].x // 0–1
      }
    })

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video })
      },
      width: 640,
      height: 480
    })

    camera.start()

    return () => {
      video.remove()
    }
  }, [])

  useFrame(() => {
    if (!boxRef.current) return

    // 0–1 → -2 ile +2 arası
    const targetX = (handX.current - 0.5) * 4

    // smooth hareket (titreşim öldürücü)
    boxRef.current.position.x +=
      (targetX - boxRef.current.position.x) * 0.1
  })

  return (
      <mesh ref={boxRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
  )
}