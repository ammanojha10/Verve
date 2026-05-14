'use client'

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RevealSection } from "@/components/ui/RevealSection"
import { Button } from "@/components/ui/Button"
import { ChevronRight } from "lucide-react"

export function LiquidShaderHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      // Function to create noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float ratio = resolution.x / resolution.y;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= ratio;

        float n = snoise(p * 0.5 + time * 0.1);
        float n2 = snoise(p * 1.5 - time * 0.15);
        
        vec3 color1 = vec3(0.75, 0.22, 0.17); // Verve Red
        vec3 color2 = vec3(1.0, 1.0, 1.0);    // White
        
        float dist = length(p);
        float mask = smoothstep(0.4, 0.8, n + n2 * 0.5 + dist * 0.2);
        
        vec3 finalColor = mix(color2, color1, mask * 0.8);
        
        // Liquid Refraction Effect
        float refraction = snoise(p * 2.0 + time * 0.2) * 0.02;
        finalColor += refraction;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2() }
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.resolution.value.set(w, h)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.01
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <RevealSection>
          <div className="text-[12px] tracking-[4px] uppercase text-primary font-bold mb-6 bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block border border-white/50">
            Phase II: The Kinetic Era
          </div>
        </RevealSection>
        
        <RevealSection delay={200}>
          <h1 className="font-heading text-[clamp(64px,12vw,160px)] leading-[0.85] tracking-tight text-foreground mb-10 kinetic-text">
            RUN THE <span className="text-primary italic">LIQUID</span> EDGE.
          </h1>
        </RevealSection>

        <RevealSection delay={400}>
          <p className="text-xl md:text-2xl font-light text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-12">
            Experience the next evolution of Verve. Gamified competition meets minimalistic precision.
          </p>
        </RevealSection>

        <RevealSection delay={600}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button size="lg" className="h-16 px-10 text-lg group rounded-none depth-25d bg-primary hover:bg-primary-deep" asChild>
              <a href="/join">
                Start Your Legacy <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-none border-foreground/10 hover:bg-foreground/5" asChild>
              <a href="/leaderboard">View Board</a>
            </Button>
          </div>
        </RevealSection>
      </div>

      {/* 2.5D Decor */}
      <div className="absolute bottom-12 left-12 hidden lg:block">
        <RevealSection delay={800}>
          <div className="glass p-6 rounded-2xl depth-25d border-white/40">
            <div className="text-[10px] tracking-[2px] uppercase text-primary mb-2">Current Tier</div>
            <div className="font-heading text-4xl">PROSPECTS</div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}
