import React from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP eklentilerini kaydet
gsap.registerPlugin(ScrollTrigger);


function AnimationProvider() {
  return (
    <div>AnimationProvider</div>
  )
}

export default AnimationProvider