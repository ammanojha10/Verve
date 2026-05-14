'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface DitheringShaderProps {
  shape?: 'sphere' | 'plane'
  type?: 'random' | 'bayer'
  colorBack?: string
  colorFront?: string
  pxSize?: number
  speed?: number
  className?: string
}

export function DitheringShader({
  shape = 'sphere',
  type = 'random',
  colorBack = '#000000',
  colorFront = '#C0392B',
  pxSize = 2,
  speed = 1.0,
  className = '',
}: DitheringShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio / pxSize)
    containerRef.current.appendChild(renderer.domElement)

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      uniform vec3 colorBack;
      uniform vec3 colorFront;
      varying vec2 vUv;
      varying vec3 vNormal;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        float diff = max(dot(vNormal, vec3(0.5, 0.5, 1.0)), 0.0);
        float noise = random(gl_FragCoord.xy + time);
        
        vec3 color = mix(colorBack, colorFront, step(noise, diff));
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const geometry = shape === 'sphere' ? new THREE.SphereGeometry(1, 64, 64) : new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorBack: { value: new THREE.Color(colorBack) },
        colorFront: { value: new THREE.Color(colorFront) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let animationId: number
    const animate = (t: number) => {
      animationId = requestAnimationFrame(animate)
      material.uniforms.time.value = t * 0.001 * speed
      if (shape === 'sphere') {
        mesh.rotation.y += 0.01 * speed
        mesh.rotation.x += 0.005 * speed
      }
      renderer.render(scene, camera)
    }

    animate(0)

    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [shape, type, colorBack, colorFront, pxSize, speed])

  return <div ref={containerRef} className={`w-full h-full overflow-hidden ${className}`} />
}
