import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Background() {
  const particlesInit = async (engine) => {
    await loadFull(engine); // Initialize tsparticles
  };

  const particleOptions = {
    fullScreen: { enable: true, zIndex: -1 }, // Fullscreen with zIndex for background effect
    background: { color: { value: "#000000" } }, // Background color (black)
    particles: {
      number: { value: 200 }, // Number of stars
      color: { value: "#ffffff" }, // Star color
      opacity: {
        value: 0.8,
        random: true, // Random opacity for stars
      },
      size: {
        value: { min: 1, max: 3 }, // Random star sizes
      },
      move: {
        enable: true,
        speed: 0.5, // Slow star movement
        direction: "none", // Stars move in all directions
        random: true, // Random movement
        straight: false, // Stars don't move in a straight line
        outModes: { default: "bounce" }, // Stars bounce off edges
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" }, // Stars repel when hovered
        onClick: { enable: true, mode: "push" }, // Clicking adds more stars
      },
      modes: {
        repulse: { distance: 100 },
        push: { quantity: 4 },
      },
    },
  };

  return <Particles init={particlesInit} options={particleOptions} />;
}
