"use client"

import { useRef } from "react"
import { useTheme } from "next-themes"
import TextCursorProximity from "@/components/ui/text-cursor-proximity"
import { Pencil, PenTool, Edit, PencilLine } from "lucide-react"

const icons = [Pencil, PenTool, Edit, PencilLine]

export default function Preview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div
      className="w-full h-full min-h-[calc(100vh-86px)] flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24"
      ref={containerRef}
    >
      <div 
        className="relative w-full cursor-pointer overflow-hidden justify-start items-start flex"
        style={{ 
          backgroundColor: isDark ? "#111111" : "#FFFFFF",
          color: isDark ? "#FFFFFF" : "#000000",
          minHeight: "400px",
          height: "100%"
        }}
      >
        <div className="flex flex-col justify-center uppercase leading-none pt-4 pl-6">
          <TextCursorProximity
            label="DIGITAL"
            className="text-3xl will-change-transform sm:text-6xl md:text-6xl lg:text-7xl font-overusedGrotesk"
            styles={{
              transform: {
                from: "scale(1)",
                to: "scale(1.4)",
              },
              color: { 
                from: isDark ? "#FFFFFF" : "#000000", 
                to: "#FF0000"
              },
            }}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          />
          <TextCursorProximity
            label="WORKSHOP"
            className="leading-none text-3xl will-change-transform sm:text-6xl md:text-6xl lg:text-7xl font-overusedGrotesk"
            styles={{
              transform: {
                from: "scale(1)",
                to: "scale(1.4)",
              },
              color: { 
                from: isDark ? "#FFFFFF" : "#000000", 
                to: "#FF0000"
              },
            }}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          />
        </div>

        <div className="absolute bottom-6 flex w-full justify-between px-6">
          {icons.map((Icon, i) => (
            <div key={i} className="opacity-80">
              <Icon className="w-6 h-6" />
            </div>
          ))}
        </div>

        <TextCursorProximity
          className="absolute top-6 right-6 hidden sm:block text-xs"
          label="15/01/2025"
          styles={{
            transform: {
              from: "scale(1)",
              to: "scale(1.4)",
            },
            color: { 
              from: isDark ? "#FFFFFF" : "#000000", 
              to: "#FF0000"
            },
          }}
          falloff="linear"
          radius={10}
          containerRef={containerRef}
        />
      </div>
    </div>
  )
}
