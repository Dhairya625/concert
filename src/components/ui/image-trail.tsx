'use client'

import { Children, useCallback, useEffect, useMemo, useRef } from "react"
import {
  AnimationSequence,
  motion,
  Target,
  Transition,
  useAnimate,
  useAnimationFrame,
} from "framer-motion"

import { useMouseVector } from "@/components/hooks/use-mouse-vector"

type TrailSegment = [Target, Transition]

type TrailAnimationSequence = TrailSegment[]

interface ImageTrailProps {
  children: React.ReactNode
  containerRef?: React.RefObject<HTMLElement | null>
  newOnTop?: boolean
  rotationRange?: number
  animationSequence?: TrailAnimationSequence
  interval?: number
  velocityDependentSpawn?: boolean
}

interface TrailItem {
  id: string
  x: number
  y: number
  rotation: number
  animationSequence: TrailAnimationSequence
  scale: number
  child: React.ReactNode
}

const ImageTrail = ({
  children,
  newOnTop = false, // Set false to ensure new trails go behind so text floats better
  rotationRange = 15,
  containerRef,
  animationSequence = [
    [{ scale: 1.1, opacity: 1 }, { duration: 0.1, ease: "circOut" }],
    [{ scale: 0.9, opacity: 0 }, { duration: 1.2, ease: "circIn" }],
  ],
  interval = 120, // Tweaked for slightly lazier trailing so it doesnt overwhelm
}: ImageTrailProps) => {
  const trailRef = useRef<TrailItem[]>([])

  const lastAddedTimeRef = useRef<number>(0)
  const { position: mousePosition } = useMouseVector(containerRef)
  const lastMousePosRef = useRef(mousePosition)
  const currentIndexRef = useRef(0)
  
  // Convert children to array for sequential selection
  const childrenArray = useMemo(() => Children.toArray(children), [children])

  // Batch updates using useCallback
  const addToTrail = useCallback(
    (mousePos: { x: number; y: number }) => {
      // Avoid rendering without children
      if (childrenArray.length === 0) return

      const newItem: TrailItem = {
        id: crypto.randomUUID(),
        x: mousePos.x,
        y: mousePos.y,
        rotation: (Math.random() - 0.5) * rotationRange * 2,
        animationSequence,
        scale: 1,
        child: childrenArray[currentIndexRef.current],
      }

      // Increment index and wrap around if needed
      currentIndexRef.current =
        (currentIndexRef.current + 1) % childrenArray.length

      if (newOnTop) {
        trailRef.current.push(newItem)
      } else {
        trailRef.current.unshift(newItem)
      }
    },
    [childrenArray, rotationRange, animationSequence, newOnTop]
  )

  const removeFromTrail = useCallback((itemId: string) => {
    const index = trailRef.current.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      trailRef.current.splice(index, 1)
    }
  }, [])

  useAnimationFrame((time) => {
    // Skip if mouse hasn't moved
    if (
      lastMousePosRef.current.x === mousePosition.x &&
      lastMousePosRef.current.y === mousePosition.y
    ) {
      return
    }
    lastMousePosRef.current = mousePosition

    const currentTime = time

    if (currentTime - lastAddedTimeRef.current < interval) {
      return
    }

    lastAddedTimeRef.current = currentTime

    addToTrail(mousePosition)
  })

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {trailRef.current.map((item) => (
        <TrailItemNode key={item.id} item={item} onComplete={removeFromTrail} />
      ))}
    </div>
  )
}

interface TrailItemProps {
  item: TrailItem
  onComplete: (id: string) => void
}

const TrailItemNode = ({ item, onComplete }: TrailItemProps) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    const sequence = item.animationSequence.map((segment: TrailSegment) => [
      scope.current,
      ...segment,
    ])

    animate(sequence as AnimationSequence).then(() => {
      onComplete(item.id)
    })
  }, [animate, item.animationSequence, item.id, onComplete, scope])

  return (
    <motion.div
      ref={scope}
      className="absolute pointer-events-none origin-center"
      style={{
        left: item.x,
        top: item.y,
        rotate: item.rotation,
        x: '-50%',
        y: '-50%' // center align items precisely on mouse tip
      }}
      initial={{ opacity: 0, scale: 0.8 }} // Start slightly small and transparent
    >
      {item.child}
    </motion.div>
  )
}

export { ImageTrail }
