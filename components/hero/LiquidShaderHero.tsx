'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function LiquidShaderHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    camera.position.z = 1

    const geometry = new THREE.PlaneGeometry(2, 2)

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      // Noise function for liquid movement
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float t = time * 0.2;

        // Create fluid movement
        float n = snoise(uv * 3.0 + t);
        float n2 = snoise(uv * 6.0 - t * 0.5);
        
        // Base glass color (White with slight tint)
        vec3 color = vec3(0.98, 0.98, 0.98);
        
        // Liquid Red accents
        float liquid = smoothstep(0.4, 0.6, snoise(uv * 2.0 + vec2(t * 0.5, t * 0.3)));
        color = mix(color, vec3(0.75, 0.22, 0.17), liquid * 0.15); // Primary Red tint
        
        // Refractive highlights
        float edge = abs(snoise(uv * 10.0 + t) - snoise(uv * 10.0 + t + 0.05));
        color += vec3(1.0) * smoothstep(0.0, 0.1, edge) * 0.1;
        
        // Vignette
        float vignette = 1.0 - length(uv - 0.5) * 0.5;
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2() }
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.resolution.value.set(w, h)
    }

    onResize()
    window.addEventListener('resize', onResize)

    let animId: number
    const animate = (t: number) => {
      animId = requestAnimationFrame(animate)
      uniforms.time.value = t * 0.001
      renderer.render(scene, camera)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />
}
