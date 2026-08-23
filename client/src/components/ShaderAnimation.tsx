"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShaderAnimationProps {
  height?: string;
  className?: string;
  colorMode?: "red" | "cyan" | "purple" | "green";
}

export function ShaderAnimation({
  height = "h-screen",
  className = "",
  colorMode = "red",
}: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    uniforms: any;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Fragment shader adaptado a colores neon
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform int colorMode;

      vec3 getColor(float value, int mode) {
        if (mode == 0) {
          // Red neon
          return vec3(
            sin(value + time * 0.01) * 0.5 + 0.5,
            0.1,
            0.2
          );
        } else if (mode == 1) {
          // Cyan neon
          return vec3(
            0.1,
            sin(value + time * 0.01) * 0.5 + 0.7,
            sin(value + time * 0.015) * 0.5 + 0.8
          );
        } else if (mode == 2) {
          // Purple neon
          return vec3(
            sin(value + time * 0.01) * 0.5 + 0.6,
            0.1,
            sin(value + time * 0.015) * 0.5 + 0.8
          );
        } else {
          // Green neon
          return vec3(
            0.1,
            sin(value + time * 0.01) * 0.5 + 0.8,
            0.2
          );
        }
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            float dist = abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            color += getColor(float(i) * 0.2, colorMode) * lineWidth*float(i*i) / (dist + 0.01);
          }
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Initialize Three.js scene
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const colorModeMap = { red: 0, cyan: 1, purple: 2, green: 3 };

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      colorMode: { type: "i", value: colorModeMap[colorMode] },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    // Initial resize
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, [colorMode]);

  return (
    <div
      ref={containerRef}
      className={`${height} w-full relative overflow-hidden ${className}`}
      style={{
        background: "#0a0a0a",
        overflow: "hidden",
      }}
    />
  );
}
