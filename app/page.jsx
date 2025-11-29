"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";

// components
import Social from "@/components/Social";
import Photo from "@/components/Photo";
import Stats from "@/components/Stats";
import Image from "next/image";

export default function Home() {

  return (
    <section className="h-full">
      <div className='bg-[#a0a0a0] relative h-screen flex justify-center items-center'>
        <Image
          src="/assets/my-photo2.png"
          alt="Resume"
          width={750}
          height={1000}
          className="absolute bottom-0"
        />

      </div>
      <div className="container mx-auto h-full"
      >
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 pb-12 xl:pb-24">
          <div className="text-center xl:text-left order-2 xl:order-none">
            <span className="text-xl">Frontend Developer</span>
            <h1 className="h1 mb-6">
              Hello I'm <br />
              <span className="text-accent">Berat Murathan Bayram</span>
            </h1>
            <p className="max-w-[500px] mb-9 text-white/80">
              I'm a frontend developer based in Istanbul, Turkey. I have rich
              experience in web site design and building, also I am excel at
              crafting elegant digital experiences and I am preficient in
              various programming languages and tecnologies
            </p>
            <div className="flex flex-col xl:flex-row items-center gap-8">
              <Button variant="outline" size="lg" className="uppercase flex items-center gap-2">
                <span>Download CV</span>
                <FiDownload className="mr-2" />
              </Button>
              <div className="mb-8 xl:mb-0">
                <Social containerStyles="flex gap-6" iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500" />
              </div>
            </div>
          </div>
          <div className="order-1 xl:order-none mb-8 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>
      <Stats />
    </section>
  );
}
