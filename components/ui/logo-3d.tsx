"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { cn } from "@/lib/utils"

export function Logo3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    mesh: THREE.Mesh
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    // Scene setup
    const scene = new THREE.Scene()
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Geometry & Material
    const geometry = new THREE.PlaneGeometry(3, 3)
    
    // Load Texture
    const textureLoader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      side: THREE.DoubleSide
    })

    textureLoader.load(
      '/logo.png',
      (texture) => {
        texture.minFilter = THREE.LinearFilter
        material.map = texture
        material.needsUpdate = true
      },
      undefined,
      (err) => {
        console.error('Error loading logo.png texture', err)
      }
    )

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Handle window resize
    const onWindowResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", onWindowResize, false)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      
      // Gentle floating and rotating animation
      const time = Date.now() * 0.001
      mesh.rotation.y = Math.sin(time * 0.5) * 0.2
      mesh.rotation.z = Math.sin(time * 0.3) * 0.05
      mesh.position.y = Math.sin(time) * 0.1

      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      mesh,
      animationId: 0,
    }

    // Start animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full min-h-[300px]", className)}
    />
  )
}
