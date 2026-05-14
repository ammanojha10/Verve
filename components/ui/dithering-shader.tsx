'use client'

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface DitheringShaderProps {
  shape?: "sphere" | "plane"
  type?: "random" | "ordered"
  colorBack?: string
  colorFront?: string
  pxSize?: number
  speed?: number
  className?: string
}

export function DitheringShader({
  shape = "sphere",
  type = "random",
  colorBack = "#000000",
  colorFront = "#C0392B",
  pxSize = 2,
  speed = 1.0,
  className = "",
}: DitheringShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio / pxSize)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      uniform vec3 colorBack;
      uniform vec3 colorFront;
      uniform vec2 resolution;
      varying vec2 vUv;
      varying vec3 vNormal;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec3 normal = normalize(vNormal);
        float light = dot(normal, vec3(1.0, 1.0, 1.0)) * 0.5 + 0.5;
        
        float noise = random(gl_FragCoord.xy + time);
        float threshold = light;
        
        vec3 finalColor = noise < threshold ? colorFront : colorBack;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    const geometry = shape === "sphere" ? new THREE.SphereGeometry(1, 64, 64) : new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorBack: { value: new THREE.Color(colorBack) },
        colorFront: { value: new THREE.Color(colorFront) },
        resolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      material.uniforms.time.value += 0.01 * speed
      if (shape === "sphere") {
        mesh.rotation.y += 0.005 * speed
        mesh.rotation.x += 0.003 * speed
      }
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      material.uniforms.resolution.value.set(w, h)
    }

    window.addEventListener("resize", handleResize)
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [shape, type, colorBack, colorFront, pxSize, speed])

  return <div ref={containerRef} className={`w-full h-full ${className}`} />
}
