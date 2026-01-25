"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const CustomCursorGesture = () => {
  const cursorRef = useRef(null);
  const videoRef = useRef(null);

  // cursor smoothing
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  // scroll
  const prevMiddleY = useRef(null);
  const lenisRef = useRef(null);

  /* =======================
     Lenis init
  ======================= */
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  /* =======================
     Cursor smoothing loop
  ======================= */
  useEffect(() => {
    const update = () => {
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;

      gsap.set(cursorRef.current, {
        x: current.current.x,
        y: current.current.y,
      });

      requestAnimationFrame(update);
    };

    update();
  }, []);

  /* =======================
     MediaPipe Hands
  ======================= */
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (!results.multiHandLandmarks?.length) return;

      const landmarks = results.multiHandLandmarks[0];

      const indexFinger = landmarks[8];
      const middleFinger = landmarks[12];

      // finger states (basit yaklaşım)
      const indexUp = indexFinger.y < landmarks[6].y;
      const middleUp = middleFinger.y < landmarks[10].y;

      /* ===== CURSOR ===== */
      const x = (1 - indexFinger.x) * window.innerWidth;
      const y = indexFinger.y * window.innerHeight;

      target.current.x = x;
      target.current.y = y;

      /* ===== SCROLL (index + middle) ===== */
      if (indexUp && middleUp && lenisRef.current) {
        if (prevMiddleY.current !== null) {
          const delta = prevMiddleY.current - middleFinger.y;

          lenisRef.current.scrollTo(
            lenisRef.current.scroll + delta * 800,
            { immediate: true }
          );
        }
        prevMiddleY.current = middleFinger.y;
      } else {
        prevMiddleY.current = null;
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      hands.close();
    };
  }, []);

  return (
    <>
      {/* Kamera gizli */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
      />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-5 h-5 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

export default CustomCursorGesture;