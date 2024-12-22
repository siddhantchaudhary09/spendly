"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import banner from "../assets/hero-image.jpg";
import { Button } from "./ui/button";

const HeroSection = () => {
  const imageref = useRef();

  useEffect(() => {
    const imageElement = imageref.current;
    const handleScroll = () => {
      const scrollposition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollposition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className=" text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Spends <br /> with Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered expense tracker that helps you manage your finances and
          analyze your spending habits with ease .
        </p>
        <div className="flex justify-center space-x-4">
          <Link href={"/dashboard"}>
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href={"/dashboard"}>
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper ">
          <div ref={imageref} className="hero-image">
            <Image
              src={banner}
              width={1280}
              height={720}
              alt="preview"
              className=" rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
